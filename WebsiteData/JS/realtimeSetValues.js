var liveData = [];
var availableDocks = [];
var availableBikes = [];
var demandPrediction = [];
var cityName = '';
var refreshTime = [];
var sanJoseAvability = [];
var sanFranciscoAvability = [];
var paloAltoAvability = [];
var mountainViewAvability = [];
var redWoodCityAvability = [];
var myInterval;
$(function() {
  requestDataNew(cityName);
  $("#refreshValues1,#refreshValues2,#refreshValues3,#refreshValues4").click(function() {
    clearInterval(myInterval);
    $.getScript('/WebsiteData/JS/realtimeSetValues.js')
  })
});



function requestDataNew(city) {
  cityName = city || 'San Francisco';
  $.getJSON("http://www.bayareabikeshare.com/stations/json", function(data) {
    if (refreshTime.indexOf(data.executionTime) === -1) {
      if (refreshTime.length === 10) {
        refreshTime.shift();
        sanJoseAvability.shift();
        sanFranciscoAvability.shift();
        redWoodCityAvability.shift();
        mountainViewAvability.shift();
        paloAltoAvability.shift();
      }
      setRealTimeValues(data.stationBeanList);
      /* $("#stationNameRealTimeAvailableBikes").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeAvailableBikesCount").html(data.stationBeanList[0].availableBikes);
       $("#stationNameRealTimeAvailableDocks").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeAvailableDocksCount").html(data.stationBeanList[0].availableDocks);
       $("#stationNameRealTimeTotalDocks").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeTotalDocksCount").html(data.stationBeanList[0].totalDocks);
       $("#stationNameRealTimeDemandName").html("<h4>" + data.stationBeanList[0].stationName + "<h4>");
       $("#stationNameRealTimeDemand").html(getPrediction(data.stationBeanList[0].availableBikes,data.stationBeanList[0].availableDocks))*/

    }
  }, function(error) {
    console.log("Error in getting live data")
  });
}

/*function getDemand(availableBikes, availableDocks) {
  var total = availableBikes + availableDocks;
  return 100 - (availableBikes / total * 100);
}*/

function setRealTimeValues(data) {

  var dataRequired = [];
  dataRequired.push(data[0]);
  dataRequired.push(data[15]);
  dataRequired.push(data[21]);
  dataRequired.push(data[22]);
  dataRequired.push(data[27]);
  dataRequired.push(data[29]);
  dataRequired.push(data[57]);
  dataRequired.push(data[58]);
  dataRequired[6].stationName = dataRequired[6].stationName.substring(0, 23) + 'Station 2';
  dataRequired[7].stationName = dataRequired[7].stationName.substring(0, 23) + 'Station 4';
  $("#stationNameRealTimeAvailableBikes").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeAvailableBikesCount").html(dataRequired[0].availableBikes);
  $("#stationNameRealTimeAvailableDocks").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeAvailableDocksCount").html(dataRequired[0].availableDocks);
  $("#stationNameRealTimeTotalDocks").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeTotalDocksCount").html(dataRequired[0].totalDocks);
  $("#stationNameRealTimeDemandName").html("<h4>" + dataRequired[0].stationName + "<h4>");
  $("#stationNameRealTimeDemand").html(getPredictionNew(dataRequired[0].availableBikes, dataRequired[0].availableDocks));
  var i = 1;
  myInterval = setInterval(function() {
    $("#stationNameRealTimeAvailableBikes").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeAvailableBikesCount").html(dataRequired[i].availableBikes);
    $("#stationNameRealTimeAvailableDocks").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeAvailableDocksCount").html(dataRequired[i].availableDocks);
    $("#stationNameRealTimeTotalDocks").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeTotalDocksCount").html(dataRequired[i].totalDocks);
    $("#stationNameRealTimeDemandName").html("<h4>" + dataRequired[i].stationName + "<h4>");
    $("#stationNameRealTimeDemand").html(getPredictionNew(dataRequired[i].availableBikes, dataRequired[i].availableDocks));
    i++;
    if (i == dataRequired.length) i = 0;
  }, 5 * 1000);

}

function getPredictionNew(availableBikes, availableDocks) {
  var total = availableBikes + availableDocks;
  var demand = 100 - (availableBikes / total * 100);
  if (demand > 80) {
    return 'Very High';
  } else if (demand > 60 && demand <= 80) {
    return 'High';
  } else if (demand > 40 && demand <= 60) {
    return 'Moderate';
  } else if (demand > 20 && demand <= 40) {
    return 'Low';
  } else if (demand <= 20) {
    return 'Very Low';
  } else {
    return 'Unknown';
  }
}