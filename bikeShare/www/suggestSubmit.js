var map_suggest;
var iconMarker;

function suggestStation() {
  iconMarker = L.icon({
    iconUrl: 'http://rb.evo-studio.net/img/icn_big_marker_bikeparking.png',
    iconSize: [40, 50]
  })
  map_suggest = L.map('map_suggest');

  $("#pac-input1").geocomplete();

  //map_suggest.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSuggest);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 18,
    id: 'mapbox.streets'
  }).addTo(map_suggest);

  function onLocationFound(e) {
    var radius = e.accuracy;
    L.marker(e.latlng).addTo(map_suggest)
      .bindPopup("<b style='color:red'>You are within 20 meters from this point</b>").openPopup();

    L.circle(e.latlng, 50, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.3
    }).addTo(map_suggest);
    plotBikeStations(e.latlng);

  }

  function onMapClick(e) {
    getAddressFromLatLong(e.latlng);
  }

  map_suggest.on('click', onMapClick);

  function onLocationError(e) {
    alert(e.message);
  }

  map_suggest.on('locationfound', onLocationFound);
  map_suggest.on('locationerror', onLocationError);

  map_suggest.locate({
    setView: true,
    maxZoom: 16
  });

  // map2 = new google.maps.Map(document.getElementById("map_canvas2"), myOptions);
}

function plotBikeStations(latlng) {
  $.getJSON('http://www.bayareabikeshare.com/stations/json', function(data) {
    _.forEach(data.stationBeanList, function(eachStation) {
      L.marker(L.latLng(eachStation.latitude, eachStation.longitude), {
          icon: iconMarker
        }).addTo(map_suggest)
        .bindPopup("<b style='color:blue'>" + eachStation.stationName + ' - ' + eachStation.landMark + "</b>").openPopup();
    });
     map_suggest.setView(latlng, 16);
  })
}

function getAddressFromLatLong(latLng) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'location': latLng
  }, function(results, status) {
    if (confirm("Is the address correct - " + results[0].formatted_address + ' ?')) {
      L.marker(latLng).addTo(map_suggest)
        .bindPopup("<b style='color:red'>Suggested Bike Station</b>").openPopup();
      // alert('Thanks for suggesting bike Station at  --' +results[0].formatted_address);
    }

    return results[0].formatted_address;
  })
}


function getLatLongFromAddress(address) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({
    'address': address
  }, function(results, status) {

    if (status === google.maps.GeocoderStatus.OK) {
      var newLatLng = new L.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
      map_suggest.setView(newLatLng, 18);
      //map_suggest.setCenter()
      L.marker(newLatLng).addTo(map_suggest)
        .bindPopup("<b style='color:red'>You are within 20 meters from this point</b>").openPopup();

      L.circle(newLatLng, 50, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3
      }).addTo(map_suggest);

    }
  })
}
suggestStation();

function suggestSubmit() {
  getLatLongFromAddress(document.getElementById('pac-input1').value)

}