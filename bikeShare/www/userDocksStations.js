function initlizeArray() {
  userWiseTripsData = {
    "Customer": 43935,
    "Subscriber": 310217
  }
  cityWiseTripsData = {
    "San Jose": 17956,
    "San Francisco": 321105,
    "Palo Alto": 3073,
    "Mountain View": 9999,
    "Redwood City": 2019
  }

  cityWiseDocksData = {
    "San Jose": 264,
    "San Francisco": 665,
    "Palo Alto": 75,
    "Mountain View": 117,
    "Redwood City": 115
  }

  cityWiseStationsData = {
    "San Jose": 16,
    "San Francisco": 35,
    "Palo Alto": 5,
    "Mountain View": 7,
    "Redwood City": 7
  }
};

$(function() {
  initlizeArray();
  $('#cityWiseStationsData').highcharts({
    chart: {
/*      height: '530',
      width: '390',*/
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'City wise Stations Data - ' + '2015'
    },
    subtitle: {
      text: 'Total Number of Stations - ' + _.values(cityWiseStationsData).reduce(function(a, b) {
        return a + b
      })
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
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Stations',
      colorByPoint: true,
      data: [{
        name: 'San Jose',
        y: cityWiseStationsData['San Jose']
      }, {
        name: 'San Francisco',
        y: cityWiseStationsData['San Francisco'],
        sliced: true,
        selected: true
      }, {
        name: 'Mountain View',
        y: cityWiseStationsData['Mountain View']
      }, {
        name: 'Redwood City',
        y: cityWiseStationsData['Redwood City']
      }, {
        name: 'Palo Alto',
        y: cityWiseStationsData['Palo Alto']
      }]
    }]
  });
  $('#cityWiseDocksData').highcharts({
    chart: {
/*      height: '530',
      width: '390',*/
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'City wise Docks Data - ' + '2015'
    },
    subtitle: {
      text: 'Total Number of Docks - ' + _.values(cityWiseDocksData).reduce(function(a, b) {
        return a + b
      })
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
      name: 'Docks',
      colorByPoint: true,
      data: [{
        name: 'San Jose',
        y: cityWiseDocksData['San Jose']
      }, {
        name: 'San Francisco',
        y: cityWiseDocksData['San Francisco'],
        sliced: true,
        selected: true
      }, {
        name: 'Mountain View',
        y: cityWiseDocksData['Mountain View']
      }, {
        name: 'Redwood City',
        y: cityWiseDocksData['Redwood City']
      }, {
        name: 'Palo Alto',
        y: cityWiseDocksData['Palo Alto']
      }]
    }]
  });
  $('#userTypeWiseTrips').highcharts({
    chart: {
/*      height: '530',
      width: '390',*/
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'User Type wise (Customer or Subscriber) Trip Data - ' + '2015'
    },
    subtitle: {
      text: 'Total Number of Trips - ' + (userWiseTripsData.Customer + userWiseTripsData.Subscriber)
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            'font-weight': 'bold'
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Users',
      colorByPoint: true,
      data: [{
        name: 'Customer(%)',
        y: Math.round(userWiseTripsData.Customer / (userWiseTripsData.Subscriber + userWiseTripsData.Customer) * 100),
      }, {
        name: 'Subscriber(%)',
        y: Math.round(userWiseTripsData.Subscriber / (userWiseTripsData.Subscriber + userWiseTripsData.Customer) * 100),
      }],
    }]
  });

  $('#cityWiseTrips').highcharts({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Citywise Trip Data - ' + '2015'
    },
    subtitle: {
      text: 'Total Number of Trips - ' + _.values(cityWiseTripsData).reduce(function(a, b) {
        return a + b
      })
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
          }
        },
        showInLegend: true
      }
    },
    series: [{
      name: 'Trips',
      colorByPoint: true,
      data: [{
        name: 'San Jose',
        y: cityWiseTripsData['San Jose']
      }, {
        name: 'San Francisco',
        y: cityWiseTripsData['San Francisco'],
        sliced: true,
        selected: true
      }, {
        name: 'Mountain View',
        y: cityWiseTripsData['Mountain View']
      }, {
        name: 'Redwood City',
        y: cityWiseTripsData['Redwood City']
      }, {
        name: 'Palo Alto',
        y: cityWiseTripsData['Palo Alto']
      }]
    }]
  });
})