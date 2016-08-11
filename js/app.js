var zoom = 14;
var map;

// Create new blank arrays for all the listing markers
var markers = [];

// This global polygon variable is to ensure only ONE polygon is rendered
var polygon = null;

function initMap() {
  // Create a styles array to use with the map
  // var styles = JSON.parse(pinkMap.json);

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: zoom,
    styles: styles,
    mapTypeControl: false
  });

  // These are locations shown to the user. Normally
  // we'd have these in a database instead
  var locations = [
    {title: 'Variety',
     location: {lat: 40.715407, lng: -73.944341},
     description: 'My fav coffee. Not sure I can live without it any more!',
     iconImage: 'img/icons/coffee.png',
     descriptionImage: 'http://i.giphy.com/YU0HoCQidyGEE.gif'},
    {title: 'Momo Sushi Shack',
     location: {lat: 40.70512, lng: -73.933463},
     description: 'Best sushi ever. You will never look at sushi the same way again.',
     iconImage: 'img/icons/noodles.png',
     descriptionImage: 'http://i.giphy.com/X2QBmjCQAHtle.gif'},
    {title: 'David Barton Gym',
     location: {lat: 40.740404, lng: -73.993308},
     description: 'A gym within a church! Working out has just gotten more spiritual and beautiful.',
     iconImage: 'img/icons/weightlifting.png',
     descriptionImage: 'http://i.giphy.com/hlh2xvhZOfzji.gif'},
    {title: 'Cafe Mogador Williamsburg',
     location: {lat: 40.719726, lng: -73.959983},
     description: 'My fav maroccan restaurant. Try the lamb tagine!',
     iconImage: 'img/icons/noodles.png',
     descriptionImage: 'http://i.giphy.com/l0O9yqyFbuxZoBifu.gif'},
    {title: 'Smorgasburg',
     location: {lat: 40.72102, lng: -73.962178},
     description: 'Amazing food in a flea market style flair.',
     iconImage: 'img/icons/noodles.png',
     descriptionImage: 'http://i.giphy.com/3F3QVLy3w6OfC.gif'},
    {title: 'BARC Shelter',
     location: {lat: 40.716199, lng: -73.963794},
     description: 'You can go on walks with dogs here, or hang out with cats.',
     iconImage: 'img/icons/tiger.png',
     descriptionImage: 'http://i.giphy.com/eij3Aplt9hquI.gif'},
    {title: 'DUMBO Boulders',
     location: {lat: 40.704272, lng: -73.989235},
     description: 'Outdoor bouldering.',
     iconImage: 'img/icons/climbing.png',
     descriptionImage: 'http://i.giphy.com/NotDYMTH9HUiI.gif'},
    {title: 'The Cliffs at LIC',
     location: {lat: 40.748649, lng: -73.948733},
     description: 'Awesome climbing gym.',
     iconImage: 'img/icons/climbing.png',
     descriptionImage: 'http://i.giphy.com/NotDYMTH9HUiI.gif'},
    {title: 'Champs',
     location: {lat: 40.70844, lng: -73.9409},
     description: 'My fav vegan diner.',
     iconImage: 'img/icons/noodles.png',
     descriptionImage: 'http://i.giphy.com/jKaFXbKyZFja0.gif'}
  ];

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Initialize the drawing manager
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });

  // Style the markers a bit.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the location array to create an
  // array of markers on initialize
  for (var i = 0, max = locations.length; i < max; i++) {
    // Get the position from the location array
    var position = locations[i].location;
    var title = locations[i].title;
    var description = locations[i].description;
    var descriptionImage = locations[i].descriptionImage;
    var iconImage = locations[i].iconImage;
    // Create a new marker per location, and put
    // into markers array
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
      description: description,
      descriptionImage: descriptionImage,
      icon: iconImage
    });

    // Push the marker to our array of markers
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    })
  }
  map.fitBounds(bounds);

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
  document.getElementById('toggle-drawing').addEventListener('click', function() {
    toggleDrawing(drawingManager);
  });
  document.getElementById('zoom-to-area').addEventListener('click', function() {
    zoomToArea();
  });
  document.getElementById('search-within-time').addEventListener('click', function() {
    searchWithinTime();
  });
  // Add an event listener so that the polygon is captured, call the
  // seachWithinPolygon function. This will show the markers in the polygon,
  // and hide any outside of it.
  drawingManager.addListener('overlaycomplete', function(event) {
    // First, check if there is an existing polygon.
    // If there is, get rid of it and remove the markers
    if (polygon) {
      polygon.setMap(null);
      hideListings();
    }
    // Switching the drawing mode to the HAND (i.e. no longer drawing)
    drawingManager.setDrawingMode(null);
    // Creating a new editable polygon from the overlay
    polygon = event.overlay;
    polygon.setEditable(true);
    polygon.setDraggable(true);
    // Searching within the polygon
    searchWithinPolygon();
    // Make sure the search is redone if the poly is changed
    polygon.getPath().addListener('set_at', searchWithinPolygon);
    polygon.getPath().addListener('insert_at', searchWithinPolygon);
  });

  // This function populates the infowindow when the markers is clicked. We'll only allow one infowindow which will open at the marker that is clicked, and populate based on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened
    // on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute
      // the position of the streetview image, then calculate the heading,
      // then get a panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
          infowindow.setContent('<div id="pano"></div><img class="infowindow-image" src="' + marker.descriptionImage + '"><div>' + marker.description + '</div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<img class="infowindow-image" src="' + marker.descriptionImage + '"><div>' + marker.description + '</div>');
        }
      }
      // Use streetview service to get the closest streetvew image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker
      infowindow.open(map, marker);
    }
  }

  // This function will loop through the markers array and display them all
  function showListings() {
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0, max = markers.length; i < max; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }

  // This function will loop through the listings and hide them all
  function hideListings() {
    for (var i = 0, max = markers.length; i < max; i++) {
      markers[i].setMap(null);
    }
  }

  // This function takes in a COLOR, and then creates a new marker icon
  // of that color. The icon will be 21 px wide by 34 high, have an
  // origin of 0, 0 and be anchored at 10, 34
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  // This shows and hides (respectively) the drawing options
  function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
      drawingManager.setMap(null);
      // In case the user drew anything, get rid of the polygon
      if (polygon) {
        polygon.setMap(null);
      }
    } else {
      drawingManager.setMap(map);
    }
  }

  // This function hides all markers outside the polygon, and shows
  // only the ones within it. This is so that the user can specify
  // an exact area of search.
  function searchWithinPolygon() {
    console.log("Area in polygon: " + google.maps.geometry.spherical.computeArea(polygon.getPath()));
    for (var i = 0; i < markers.length; i++) {
      if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
        markers[i].setMap(map);
      } else {
        markers[i].setMap(null);
      }
    }
  }

  // This function takes the input value in the find nearby area text input
  // locates it, and then zooms into that area. This is so that the user
  // can show all listings, then decide to focus on one area of the map.
  function zoomToArea() {
    // Initialize the geocoder
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered
    var address = document.getElementById('zoom-to-area-text').value;
    // Make sure the address isn't blank
    if (address == '') {
      window.alert('You must enter an area, or address.');

    } else {
      // Geocode the address/area entered to get the center. Then, center
      // the map on it and zoom in
      geocoder.geocode(
        {
          address: address,
          componentRestrictions: {locality: 'New York'}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(zoom);
          } else {
            window.alert('We could not find that location - try entering a more specific place.');
          }
        })
    }
  }

  // This function allows the user to input a desired travel time, in
  // minutes, and a travel mode, and a location - and only show the listings
  // that are within that travel time (via that travel mode) of the
  // location
  function searchWithinTime() {
    // Initialize the distance matrix service
    var distanceMatrixService = new google.maps.DistanceMatrixService;
    var address = document.getElementById('search-within-time-text').value;
    // Check to make sure the place entered isn't blank
    if (address == '') {
      window.alert('You must enter an address.');
    } else {
      hideListings();
      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      var origins = [];
      for (var i = 0; i < markers.length; i++) {
        origins[i] = markers[i].position;
      }
      var destination = address;
      var mode = document.getElementById('mode').value;
      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.
      distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [destination],
        travelMode: google.maps.TravelMode[mode],
        unitSystem: google.maps.UnitSystem.IMPERIAL
      }, function(response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          displayMarkersWithinTime(response);
        }
      });
    }
  }

  // This function will go through each of the results, and,
  // if the distance is LESS than the value in the picker, show it on
  // the map
  function displayMarkersWithinTime(response) {
    var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    // Parse through the results, and get the distance and duration of each.
    // because there might be multiple origins and destination we have a
    // nested loop
    // Then, make sure at least 1 result was found
    var atLeastOne = false;
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        if (element.status === "OK") {
          // The distance is returned in feet, but the TEXT is in miles.
          // If we wanted to switch the function to show markers within a
          // user-entered DISTANCE, we would need the value for
          // distance, but for now we only need the text.
          var distanceText = element.distance.text;
          // Duration value is given in seconds so we make it MINUTES. We
          // need both the value and the text
          var duration = element.duration.value / 60;
          var durationText = element.duration.text;
          if (duration <= maxDuration) {
            // the origin [i] should = the markers[i]
            markers[i].setMap(map);
            atLeastOne = true;
            // Create a mini infowindow to open immediately and contain the
            // distance and duration
            var infowindow = new google.maps.InfoWindow({
              content: durationText + ' away, ' + distanceText
            });
            infowindow.open(map, markers[i]);
            // Put this in so that this small window closes if the user
            // clicks the marker, when the big infowindow opens
            markers[i].infowindow = infowindow;
            google.maps.event.addListener(markers[i], 'click', function() {
              console.log('close window now');
              this.infowindow.close();
            });
          }
        }
      }
    }
  }
}
