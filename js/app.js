var map;

// Create new blank arrays for all the listing markers
var markers = [];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 14
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
  }

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);

  // This function populates the infowindow when the markers is clicked. We'll only allow one infowindow which will open at the marker that is clicked, and populate based on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<img class="infowindow-image" src="' + marker.descriptionImage + '"><div>' + marker.description + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  // This function will loop through the markers array and display them all
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
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
}
