var map;
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
     description: 'Best coffee ever. Not sure I can live without it any more!'},
    {title: 'Momo Sushi Shack',
     location: {lat: 40.70512, lng: -73.933463},
     description: 'Best sushi ever. You will never look at sushi the same way again.'},
    {title: 'David Barton Gym',
     location: {lat: 40.740404, lng: -73.993308},
     description: 'A gym within a church! Working out has just gotten more spiritual and beautiful. Worship to the gods of fitness.'},
    {title: 'Cafe Mogador Williamsburg',
     location: {lat: 40.719726, lng: -73.959983},
     description: 'Best maroccan restaurant. Try the lamb tagine!'},
    {title: 'Smorgasburg',
     location: {lat: 40.72102, lng: -73.962178},
     description: 'Amazing food in a flea market style flair.'},
    {title: 'The Cliffs at LIC',
     location: {lat: 40.748649, lng: -73.948733},
     description: 'Best climbing in the town. Very crowded, but hey it is NYC.'}
  ];

  // Create new blank arrays for all the listing markers
  var markers = [];

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // The following group uses the location array to create an
  // array of markers on initialize
  for (var i = 0, max = locations.length; i < max; i++) {
    // Get the position from the location array
    var position = locations[i].location;
    var title = locations[i].title;
    var description = locations[i].description;
    // Create a new marker per location, and put
    // into markers array
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
      description: description
    });

    // Push the marker to our array of markers
    markers.push(marker);
    bounds.extend(marker.position);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    map.fitBounds(bounds);
  }

  // This function populates the infowindow when the markers is clicked. We'll only allow one infowindow which will open at the marker that is clicked, and populate based on that markers position.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.description + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.setMarker(null);
      });
    }
  }
}
