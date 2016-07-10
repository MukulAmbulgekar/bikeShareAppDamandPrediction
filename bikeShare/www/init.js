    var map;
    var currentPosition;
    var stationLocations = [];
    var latitude;
    var longitude;
    var GOOGLE;
    var gmarkers = [];
    var highAvailabilityMarkers = [];
    var lowAvailabilityMarkers = [];
    var mediumAvailabilityMarkers = [];
    var allMArkers = [];
    var nearByStations = 0;
    var nearestStation = {
      name: null,
      distance: null,
      location: null
    };
    var angularScope;
    var uri = 'http://www.bayareabikeshare.com/stations/json';
    var MIN_DISTANCE = 999999;
    var sortedStationsWiseData = [];
    var lastRefreshedTimeNew = null;
    var newMap;
    var availableBikesArray = [];
    var availableDocskArray = [];

    function getRealTimeStatus() {
      availableBikesArray = [];
      availableDocskArray = [];
      var cities = ['San Francisco', 'San Jose', 'Mountain View', 'Palo Alto'];
      for (var i = 0; i < cities.length; i++) {
        availableBikesArray.push(_.pluck(_.where(stationLocations, {
          city: cities[i]
        }), 'availableBikes').reduce(function(a, b) {
          return a + b
        }))
        availableDocskArray.push(_.pluck(_.where(stationLocations, {
          city: cities[i]
        }), 'availableDocks').reduce(function(a, b) {
          return a + b
        }))
      }
    };

    if (!window.localStorage.defaultCity) {
      window.localStorage.defaultCity = 'San Jose';
    }
    if (!window.localStorage.defaultDistance) {
      window.localStorage.defaultDistance = 'M';
    }
    if (!window.localStorage.defaultTemprature) {
      window.localStorage.defaultTemprature = 'Imperial';
    }
    if (!window.localStorage.defaultRefresh) {
      window.localStorage.defaultRefresh = 'On';
    }
    var defaultCity = window.localStorage.defaultCity;
    var defaultDistance = window.localStorage.defaultDistance;
    var defaultTemprature = window.localStorage.defaultTemprature;
    var defaultRefresh = window.localStorage.defaultRefresh;



    function getWeather(latitude, longitude) {
      // alert(latitude, longitude);

      // Get a free key at http://openweathermap.org/. Replace the "Your_Key_Here" string with that key.
      var OpenWeatherAppKey = "660a831b22ee38ed5f74408e4061b856";

      var queryString =
        'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=' + defaultTemprature;

      $.getJSON(queryString, function(results) {

        if (results.weather.length) {

          $.getJSON(queryString, function(results) {

            if (results.weather.length) {
              var weatherInfo = 'City: <b>' + defaultCity + '</b><br>Temp: <b>' + results.main.temp + (defaultTemprature === 'Imperial' ? '&#8457;' : '&#8451;') + '</b><br>Wind: <b>' + results.wind.speed + '</b><br>Humidity: <b>' + results.main.humidity + '</b><br>Visbility: <b>' + results.weather[0].main + '</b>';
              $('#weather').html(weatherInfo);
              $('#avabilityInfo').html('<img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png">High <img src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png">Average <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png">Low')
            }

          });
        }
      }).fail(function() {
        console.log("error getting location");
      });
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
      alert('Error in getting your device location');
      refreshData(getURI(defaultCity));
    }

    function getdistance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1 / 180
      var radlat2 = Math.PI * lat2 / 180
      var theta = lon1 - lon2
      var radtheta = Math.PI * theta / 180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180 / Math.PI
      dist = dist * 60 * 1.1515
      if (unit == "K") {
        dist = dist * 1.609344
      }
      if (unit == "N") {
        dist = dist * 0.8684
      }
      dist = Math.round(dist * 100) / 100
      return dist
    }

    function navigateToBikeStation(fromLocation, toLocation, stationName) {
      if (confirm("Do you want to navigate - " + stationName)) {
        //polyline.remove();
        plugin.google.maps.external.launchNavigation({
          "from": fromLocation,
          "to": toLocation,
          "travelMode": "biking" // toLocation
        });
      }
    }



    function initAutocomplete() {
      /*  var watchID = navigator.geolocation.watchPosition(onSuccess1, onError, {
          timeout: 30000
        });*/
      //alert(latitude);
      navigator.geolocation.getCurrentPosition(onSuccess1, onError, {
        timeout: 5000,
        enableHighAccuracy: true
      });


      $("#button").click(function() {
        if ($("#button").html() === "-") {
          $("#button").html("+");
        } else {
          $("#button").html("-");
        }
        $("#box-holder").slideToggle();
      });
      $("#refreshDataButton").click(function() {
        map.clear();
        refreshData(getURI(defaultCity));
      });
      $("#saveSettings1").click(function() {
        setLocalStorage('1');
        /* map.clear();
         initAutocomplete();*/
      });
      $("#saveSettings").click(function() {
        setLocalStorage()
        refreshData(getURI(defaultCity));
        setCenter(defaultCity);
        /*  map.clear();
          initAutocomplete();*/
      });


      /*   window.localStorage.defaultCity = document.getElementById('selectedCity').value;*/
      uri = getURI(defaultCity);

      function onSuccess1(position) {
        // currentPosition = position;
        $.getJSON(uri, function(data) {
          angularScope.get(getURI(defaultCity), data);
          stationLocations = data.stationBeanList;
          lastRefreshedTimeNew = data.executionTime;
          if (defaultCity === 'San Francisco' || defaultCity === 'San Jose') {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
          } else {
            latitude = stationLocations[0].latitude;
            longitude = stationLocations[0].longitude;
          }

          $('#lastRefreshedTime').html('Last Refreshed: <b>' + data.executionTime + '</b>');
          // alert(GOOGLE)
          document.addEventListener("deviceready", function() {
            var div = document.getElementById("map_canvas");
            //var suggestStation = document.getElementById("map_suggest");
            GOOGLE = new plugin.google.maps.LatLng(latitude, longitude);
            //const GOOGLE = new plugin.google.maps.LatLng(data.stationBeanList[0].latitude, data.stationBeanList[0].longitude);

            // Initialize the map view
            map = plugin.google.maps.Map.getMap(div, {
              'camera': {
                'latLng': GOOGLE,
                'zoom': 14
              }
            });

            var geocoder = new google.maps.Geocoder();

            document.getElementById('submit').addEventListener('click', function() {
              geocodeAddress(geocoder);
            });

            // Wait until the map is ready status.
            map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
              map.setOptions({
                'backgroundColor': 'white',
                'controls': {
                  'compass': true,
                  'myLocationButton': true,
                  'indoorPicker': true,
                  'zoom': true // Only for Android
                },
                'gestures': {
                  'scroll': true,
                  'tilt': true,
                  'rotate': true,
                  'zoom': true
                }
              });
              plotstationNamesAndLines();
              addCurrentLocationMarker(GOOGLE);
            })
          });

          getWeather(latitude, longitude);
        });

        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      }
    }

    function plotstationNamesAndLines() {
      map.clear();

      mediumAvailabilityMarkers = [];
      lowAvailabilityMarkers = [];
      highAvailabilityMarkers = [];
      allMArkers = [];
      nearByStations = 0;
      nearestStation = {
        name: null,
        distance: null,
        location: null
      };
      MIN_DISTANCE = 999999;
      stationLocations.map(function(eachStation) {
        var stationLocation = new plugin.google.maps.LatLng(eachStation.latitude, eachStation.longitude);
        var color = null;
        var markerObject = {
          'position': stationLocation,
          'title': eachStation.stationName + '\nAvailable Bikes: ' + eachStation.availableBikes + '\nAvailable Docks: ' + eachStation.availableDocks + '\nDistance: ' + getdistance(eachStation.latitude, eachStation.longitude, latitude, longitude, defaultDistance) + ' ' + (defaultDistance === 'M' ? 'Miles' : 'KMs'),
          //icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", //https://bytebucket.org/bikeshareanalysis/bikeshareanalysis/raw/08fb3398ab2bad6d4b5f331c25da4d310be02794/WebsiteData/Media/Images/bike.ico?token=2e353d92e4ae4715de167cf4637352ec092f4802",
          'styles': {
            'text-align': 'center',
            'font-style': 'italic',
            'font-weight': 'bold',
            'color': 'grey',
            //'backgroundColor':'red',
            'maxWidth': '50%',
            'maxHeight': '50%',
          },
          'markerClick': function(marker) {
            //alert(data.stationBeanList[i].latitude)
            marker.showInfoWindow();
          }
        };

        if (eachStation.availableBikes / eachStation.totalDocks * 100 >= 30 && eachStation.availableBikes / eachStation.totalDocks * 100 <= 70) {
          markerObject.icon = "yellow";
          color = "yellow";
        }
        if (eachStation.availableBikes / eachStation.totalDocks * 100 < 30) {
          markerObject.icon = "skyblue";
          color = "skyblue";
        }
        if (eachStation.availableBikes / eachStation.totalDocks * 100 > 70) {
          markerObject.icon = "yellowgreen";
          color = "yellowgreen";
        }
        if (eachStation.availableBikes < 2) {
          markerObject.icon = "darkblue";
          color = "darkblue";
        }
        if (eachStation.availableDocks < 2) {
          markerObject.icon = "darkgreen";
          color = "darkgreen";
        }
        addLines(latitude, longitude, eachStation.latitude, eachStation.longitude, eachStation.stationName);
        // var 'stationLocation_' + i = new plugin.google.maps.LatLng(data.stationBeanList[i].latitude, data.stationBeanList[i].longitude);
        map.addMarker(markerObject, function(marker) {
          //alert(markerObject.icon==='')
          allMArkers.push(marker);
          if (color === 'yellow') {
            mediumAvailabilityMarkers.push(marker);
          }
          if (color === 'skyblue' || color === 'darkblue') {
            lowAvailabilityMarkers.push(marker);
          }
          if (color === 'yellowgreen' || color === 'darkgreen') {
            highAvailabilityMarkers.push(marker);
          }
          if (getdistance(eachStation.latitude, eachStation.longitude, latitude, longitude, 'M') < 0.5) {
            marker.setTitle(eachStation.stationName + '\nAvailable Bikes: ' + eachStation.availableBikes + '\nAvailable Docks: ' + eachStation.availableDocks + '\nDistance: ' + getdistance(eachStation.latitude, eachStation.longitude, latitude, longitude, defaultDistance) + ' ' + (defaultDistance === 'M' ? 'Miles' : 'KMs'))
          }
          //gmarkers.push(marker);
          marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
            navigateToBikeStation(new plugin.google.maps.LatLng(latitude, longitude), stationLocation, eachStation.stationName);
          });
          /*     marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function() {
                 map.addPolyline({
                   points: [
                     new plugin.google.maps.LatLng(latitude, longitude),
                     stationLocation
                   ],
                   'color': 'black',
                   'width': 2,
                   'geodesic': true
                 });
                 marker.showInfoWindow();
               });*/
        });

      });
      // plot charts
      setTimeout(function() {
        drawRealTimeCharts()
      }, 2000)

      setDefaultValues();

      $('#availability').change(function(e) {
          if (this.value === 'high')
            hideMarkers(mediumAvailabilityMarkers.concat(lowAvailabilityMarkers), highAvailabilityMarkers);
          if (this.value === 'low')
            hideMarkers(mediumAvailabilityMarkers.concat(highAvailabilityMarkers), lowAvailabilityMarkers);
          if (this.value === 'medium')
            hideMarkers(highAvailabilityMarkers.concat(lowAvailabilityMarkers), mediumAvailabilityMarkers);
          if (this.value === 'all')
            hideMarkers([], allMArkers);
        })
        //alert(nearByStations);
        // angularScope.get(getURI(defaultCity))
      getWeather(latitude, longitude);


    }

    function addLines(lat1, long1, lat2, long2, stationName) {

      // if station is located within 1 miles draw line
      if (getdistance(lat1, long1, lat2, long2, 'M') < 0.5) {

        if (MIN_DISTANCE > getdistance(lat1, long1, lat2, long2, defaultDistance)) {
          MIN_DISTANCE = getdistance(lat1, long1, lat2, long2, defaultDistance);
          nearestStation.distance = getdistance(lat1, long1, lat2, long2, defaultDistance);
          nearestStation.name = stationName;
          nearestStation.location = new plugin.google.maps.LatLng(lat2, long2);
        }
        nearByStations++;

        /*       map.addPolyline({
                 points: [
                   new plugin.google.maps.LatLng(lat1, long1),
                   new plugin.google.maps.LatLng(lat2, long2)
                 ],
                 'color': 'red',
                 'width': 2,
                 'geodesic': true
               }, function(polyline) {
                 // remove lines after 5 seconds
                 setTimeout(function() {
                   polyline.remove();
                 }, 10000)
               });*/
        //alert(nearByStations);
      }

    }

    function geocodeAddress(geocoder) {
      var address = document.getElementById('pac-input').value;

      geocoder.geocode({
        'address': address
      }, function(results, status) {

        if (status === google.maps.GeocoderStatus.OK) {
          latitude = results[0].geometry.location.lat();
          longitude = results[0].geometry.location.lng();
          plotstationNamesAndLines();
          map.setCenter(new plugin.google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
          map.setZoom(14);
          map.addMarker({
            position: results[0].geometry.location,
            'title': 'Address - ' + address + ' \nTotal Stations (within 0.5 ' + (defaultDistance === 'M' ? 'Miles' : 'KMs') + ') - ' + nearByStations + '\nNearest station - ' + nearestStation.name + ' at ' + nearestStation.distance + ' ' + (defaultDistance === 'M' ? 'Miles' : 'KMs'),
            icon: 'red',
            'styles': {
              'font-weight': 'bold',
              'color': 'grey',
              'maxWidth': '50%',
              'maxHeight': '50%'
            },
            'markerClick': function(marker) {
              marker.showInfoWindow();
            },
          }, function(marker) {
            gmarkers.push(marker);
            marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
              navigateToBikeStation(new plugin.google.maps.LatLng(latitude, longitude), nearestStation.location, nearestStation.name);
            });
          })
          map.addCircle({
            'center': results[0].geometry.location,
            'radius': 805,
            'strokeColor': 'black',
            'strokeWidth': 1,
            'fillColor': 'grey'
          });
        } else {
          alert('Error in searching ' + status);
        }
      });
    }

    function removeAllMarkers() {
      for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].remove();
      }
    }

    function removeMarker(marker) {
      marker.remove();
      // marker.infoWindow.setMap(null)
    }

    function hideMarkers(markersArrayFalse, markersArrayTrue) {
      for (i = 0; i < markersArrayFalse.length; i++) {
        // map.addMarker(markersArray[i]);
        markersArrayFalse[i].setVisible(false);
      }
      for (i = 0; i < markersArrayTrue.length; i++) {
        // map.addMarker(markersArray[i]);
        markersArrayTrue[i].setVisible(true);
      }
    }

    function setLocalStorage(number) {
      window.localStorage.defaultCity = $('#selectCity').val();
      defaultCity = window.localStorage.defaultCity;
      window.localStorage.defaultDistance = $('#switchDistance').val();
      defaultDistance = window.localStorage.defaultDistance;
      window.localStorage.defaultTemprature = $('#switchTemprature').val();
      defaultTemprature = window.localStorage.defaultTemprature;
      window.localStorage.defaultRefresh = $('#switchAutoRefresh').val();
      defaultRefresh = window.localStorage.defaultRefresh;
    }

    function initAutocompleteDelayed() {
      angularScope = angular.element(document.getElementById('angularApp')).scope();
      setTimeout(function() {
        initAutocomplete();
      })
    }

    function refreshData(inputUri) {
      $.getJSON(inputUri, function(data) {
        angularScope.get(inputUri, data);
        stationLocations = data.stationBeanList;
        lastRefreshedTimeNew = data.executionTime;
        $('#lastRefreshedTime').html('Last Refreshed: <b>' + data.executionTime + '</b>');
        plotstationNamesAndLines();
        addCurrentLocationMarker(new plugin.google.maps.LatLng(latitude, longitude))
        getWeather();
      })
    }

    function addCurrentLocationMarker(positionParams) {
      map.addMarker({
        position: positionParams,
        'title': 'Total Stations (within 0.5 ' + (defaultDistance === 'M' ? 'Miles' : 'KMs') + ') - ' + nearByStations + '\nNearest station - ' + nearestStation.name + ' at ' + nearestStation.distance + ' ' + (defaultDistance === 'M' ? 'Miles' : 'KMs'),
        icon: 'red',
        'styles': {
          'font-weight': 'bold',
          'color': 'grey',
          'maxWidth': '50%',
          'maxHeight': '50%',
        },
        'markerClick': function(marker) {
          marker.showInfoWindow();
        },
      }, function(marker) {
        gmarkers.push(marker);
        marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
          navigateToBikeStation(new plugin.google.maps.LatLng(latitude, longitude), nearestStation.location, nearestStation.name);
        });
      })
      map.addCircle({
        'center': positionParams,
        'radius': 805,
        'strokeColor': 'black',
        'strokeWidth': 2,
        'fillColor': 'grey'
      });
    }
    // auto refresh every two minutes if user has selected auto refresh

    setInterval(function() {
      if (defaultRefresh === 'on') {
        map.clear();
        refreshData(getURI(defaultCity));
      }
    }, 120000)

    function getURI(city) {
      if (city === 'San Francisco' || city === 'San Jose') {
        return 'http://www.bayareabikeshare.com/stations/json';
      }
      if (city === 'Chicago') {
        return 'http://www.divvybikes.com/stations/json';
      }
      if (city === 'New York') {
        return 'http://feeds.citibikenyc.com/stations/stations.json';
      } else {
        return 'http://www.bayareabikeshare.com/stations/json';
      }
    }



    function setCenter(city) {
      if (city === 'San Francisco') {
        latitude = 37.787998;
        longitude = -122.4096261;
        map.setCenter(new plugin.google.maps.LatLng(37.787998, -122.4096261));
        map.setZoom(14);
      }
      if (city === 'San Jose') {
        // dont overwrite lat long san jose, take device location 
        latitude = 37.3358697;
        longitude = -121.8911205;
        map.setCenter(new plugin.google.maps.LatLng(37.3358697, -121.8911205));
        map.setZoom(14);
      }

      if (city === 'Chicago') {
        latitude = 41.8825048;
        longitude = -87.6320975;
        map.setCenter(new plugin.google.maps.LatLng(41.8825048, -87.6320975));
        map.setZoom(14);
      }
      if (city === 'New York') {
        latitude = 40.7570288;
        longitude = -73.9883985;
        map.setCenter(new plugin.google.maps.LatLng(40.7570288, -73.9883985));
        map.setZoom(14);
      }
    }

    function setDefaultValues() {

      //$("$defaultCity").val(defaultCity);
      /*$("#availability option[value='all']").val("all");
      $("#availability option[value='all']").attr("selected", "selected");*/
      $("#selectCity option[value='" + defaultCity + "']").val(defaultCity);
      $("#selectCity option[value='" + defaultCity + "']").attr("selected", "selected");
      $("#switchTemprature option[value='" + defaultTemprature + "']").val(defaultTemprature);
      $("#switchTemprature option[value='" + defaultTemprature + "']").attr("selected", "selected");
      $("#switchDistance option[value='" + defaultDistance + "']").val(defaultDistance);
      $("#switchDistance option[value='" + defaultDistance + "']").attr("selected", "selected");
      $("#switchAutoRefresh option[value='" + defaultRefresh + "']").val(defaultRefresh);
      $("#switchAutoRefresh option[value='" + defaultRefresh + "']").attr("selected", "selected");
    }



    function drawRealTimeCharts() {
      $('#availability option[value="all"]').text("All (" + allMArkers.length + ')');
      $('#availability option[value="high"]').text("High (" + highAvailabilityMarkers.length + ')');
      $('#availability option[value="low"]').text("Low (" + lowAvailabilityMarkers.length + ')');
      $('#availability option[value="medium"]').text("Average (" + mediumAvailabilityMarkers.length + ')');
      getRealTimeStatus();
      $('#realTimeAvailability').highcharts({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Availability wise data - ' + defaultCity
        },
        subtitle: {
          text: 'Total number of Stations -' + allMArkers.length + '<br>Last Refreshed: <b>' + lastRefreshedTimeNew + '</b>'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}',
            },
            showInLegend: true
          }
        },
        series: [{
          name: 'Availability',
          colorByPoint: true,
          data: [{
            name: 'High',
            y: _.uniq(highAvailabilityMarkers).length
          }, {
            name: 'Low',
            y: _.uniq(lowAvailabilityMarkers).length,
          }, {
            name: 'Average',
            y: _.uniq(mediumAvailabilityMarkers).length,
            sliced: true,
            selected: true
          }]
        }]
      });
      //$("#realTimeAvailabilityStationsWise").html('aa')
      $('#realTimeAvailabilityStationsWise').highcharts({
        chart: {
          type: 'column'
        },
        title: {
          text: 'City Wise Availability'
        },
        subtitle: {
          text: 'Last Refreshed: <b>' + lastRefreshedTimeNew + '</b>'
        },
        xAxis: {
          categories: ['San Francisco', 'San Jose', 'Mountain View', 'Palo Alto', 'Redwood City']
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Total Docks'
          }
        },
        legend: {
          reversed: true
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          },
          dataLabels: {
            enabled: true,
          },
        },
        series: [{
          name: 'Avalable Bikes',
          data: availableBikesArray
        }, {
          name: 'Avalable Docks',
          data: availableDocskArray
        }]
      });
      /*  $('#realTimeAvailabilityStationsWise').highcharts({
          chart: {
            height: '530',
            width: '450',
            type: 'pie',
            options3d: {
              enabled: true,
              alpha: 45
            }
          },
          title: {
            text: 'City Wise Number of Stations'
          },
          subtitle: {
            text: 'Total Stations - ' + allMArkers.length
          },
          plotOptions: {
            pie: {
              innerSize: 100,
              depth: 45
            }
          },
          series: [{
            name: 'Number of Stations',
            data: [
              ['San Francisco', _.where(stationLocations, {
                city: 'San Francisco'
              }).length],
              ['San Jose', _.where(stationLocations, {
                city: 'San Jose'
              }).length],
              ['Mountain View', _.where(stationLocations, {
                city: 'Mountain View'
              }).length],
              ['Palo Alto', _.where(stationLocations, {
                city: 'Palo Alto'
              }).length],
              ['Redwood City', _.where(stationLocations, {
                city: 'Redwood City'
              }).length],
            ]
          }]
        });*/
    }