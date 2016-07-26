var predictedData = [];
var gradientBoosting = [];
var adaBoostingTrips = [];
var extraTreesClassifierTrips = [];
var dateSelected = 'Mar 23, 2015';
var fromDate;
var toDate;
var newPredictedDataArray = {
    "San Francisco": [],
    "San Jose": [],
    "Palo Alto": [],
    "Mountain View": [],
    "Redwood City": []
};
var cities = ["San Francisco", "San Jose", "Palo Alto", "Mountain View", "Redwood City"]
var allData = [];
var stationIdSelected = 70;
var monthSelected = 'July';
var daySelected = 'Weekday';
var tempSelected = 60;
//var cloudSelected = 8;
var rainSelected = 'No';
var allHours = [
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
    ]
    //var monthSelected = 'January';
var stationsNames = [];
$(function() {

    $.getJSON("/DemandPrediction/data/stations.json", function(data) {
        stationsNames = data;
        populateSelectList();
        getData();

    })
})
var months = [{
    name: 'January',
    value: 1
}, {
    name: 'February',
    value: 2
}, {
    name: 'March',
    value: 3
}, {
    name: 'April',
    value: 4
}, {
    name: 'May',
    value: 5
}, {
    name: 'June',
    value: 6
}, {
    name: 'July',
    value: 7
}, {
    name: 'August',
    value: 8
}, {
    name: 'September',
    value: 9
}, {
    name: 'October',
    value: 10
}, {
    name: 'November',
    value: 11
}, {
    name: 'December',
    value: 12
}];

function getData() {

    $.getJSON("/DemandPrediction/Demand Analysis/Prediction/GradientBoosting/San Francisco_Prediction_GB.json", function(sf) {
        allData = allData.concat(sf);
        $.getJSON("/DemandPrediction/Demand Analysis/Prediction/GradientBoosting/San Jose_Prediction_GB.json", function(sj) {
            allData = allData.concat(sj);
            $.getJSON("/DemandPrediction/Demand Analysis/Prediction/GradientBoosting/Palo Alto_Prediction_GB.json", function(pa) {
                allData = allData.concat(pa);
                $.getJSON("/DemandPrediction/Demand Analysis/Prediction/GradientBoosting/Mountain View_Prediction_GB.json", function(mv) {
                    allData = allData.concat(mv);
                    $.getJSON("/DemandPrediction/Demand Analysis/Prediction/GradientBoosting/Redwood City_Prediction_GB.json", function(rw) {
                        allData = allData.concat(rw);
                        //console.log("allData", _.mean(_.pluck(allData, 'temp')))
                        $("#temprature").prop("max", _.max(_.pluck(allData, 'temp'))).slider("refresh");
                        $("#temprature").prop("min", _.min(_.pluck(allData, 'temp'))).slider("refresh");
                        $("#temprature").prop("value", 60).slider("refresh");
                        $("#cloudCover").prop("max", _.max(_.pluck(allData, 'Cloud'))).slider("refresh");
                        $("#cloudCover").prop("min", _.min(_.pluck(allData, 'Cloud'))).slider("refresh");
                        $("#cloudCover").prop("value", 4).slider("refresh");
                        getPrediction();
                    })
                })
            })

        })
    })

}

function getPrediction() {
    //alert($("#temprature").val())
    if ($("#items option:selected").val() !== undefined) {
        monthSelected = $("#items option:selected").val();
    }
    if ($("#days option:selected").val() !== undefined) {
        daySelected = $("#days option:selected").val();
    }
    if ($("#rain option:selected").val() !== undefined) {
        rainSelected = $("#rain option:selected").val();
    }
    if ($("#temprature").val() !== undefined) {
        tempSelected = $("#temprature").val();
    }
    predictedData = [];
    _.forEach(allData, function(eachData) {
        eachData.time = new Date(eachData.time);
        var conditionToCheck = eachData.time.getMonth() + 1 == monthSelected && eachData.Weekday == (daySelected == 'Weekday' ? true : false) && eachData.rain == (rainSelected == 'Yes') && eachData.temp > (tempSelected - 5) && eachData.temp < (tempSelected + 5);
        if (conditionToCheck) {
            eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
            eachData.hours = eachData.time.getHours() + ':00'
            predictedData.push(eachData);
        }
    });
    processData(predictedData);
    if (newPredictedDataArray.length !== 0) {
        plotDemand();
    } else {
        alert("Sorry No prediction found for this combination")
    }
}


function populateSelectList() {
    var option = '';
    var option1, option2;
    var days = ['Weekday', 'Weekend'];
    var rain = ['Yes', 'No']
    for (var i = 0; i < months.length; i++) {
        option += '<option value="' + months[i].value + '">' + months[i].name + '</option>';
    }
    for (var i = 0; i < days.length; i++) {
        option1 += '<option value="' + days[i] + '">' + days[i] + '</option>';
    }
    for (var i = 0; i < rain.length; i++) {
        option2 += '<option value="' + rain[i] + '">' + rain[i] + '</option>';
    }
    //$('#items').append("<option value='70'>San Francisco Caltrain (Townsend at 4th) </option>");
    $('#items').append(option);
    $('#days').append(option1);
    $('#rain').append(option2);
}

function processData(predictedData) {
    newPredictedDataArray = {
        "San Francisco": [],
        "San Jose": [],
        "Palo Alto": [],
        "Mountain View": [],
        "Redwood City": []
    };

    if (predictedData.length > 0) {
        _.forEach(allHours, function(eachHour) {
            _.forEach(cities, function(cityName) {
                var newPredictedData = {};
                if (_.where(predictedData, {
                        City: cityName
                    }).length > 0) {
                    newPredictedData.City = _.where(predictedData, {
                        City: cityName
                    })[0].City;
                    newPredictedData.hours = eachHour;
                    newPredictedData["Predicted_Count"] = getAverage(_.pluck(_.where(predictedData, {
                        hours: eachHour,
                        City: cityName
                    }), 'Predicted_Count'))
                    newPredictedDataArray[cityName].push(newPredictedData)
                }
            })
        })
    }

}

function getAverage(data) {

    var dataNew = data;;
    if (data.length === 0) {
        dataNew = [0]
    }

    return Math.round(dataNew.reduce(function(a, b) {
        return a + b;
    }) / dataNew.length)
}

function plotDemand() {
    // gradient boosting
    $('#gradientBoosting').highcharts({
        title: {
            text: 'Demand Prediction for Trips on hourly basis <b>', //+ gradientBoosting[0].name + '</b><br> Correlation :<b>' + gradientBoosting[0].COR + '</b>  RMSLE:<b>' + Math.round(gradientBoosting[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: '<br> Month: <b>' + months[monthSelected - 1].name + '</b> Type of Day: <b>' + daySelected + '</b><br> Rain:<b>' + rainSelected + '</b>' + '</b> Temp:<b>' + tempSelected + '</b>'

        },
        xAxis: {
            categories: allHours,
            //gridLineColor: 'transparent',
            title: {
                text: ' Hours [0-23]',
                style: {
                    fontSize: '20',
                    color: "black"
                }
            }
        },
        yAxis: {
            title: {
                text: ' Total number of trips',
                style: {
                    fontSize: '20',
                    color: "black"
                }
            },
            gridLineColor: 'black',
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Trips',
            crosshairs: [{
                color: '#b2d6a8',
                opacity: '0.5'
            }],
            shared: true,
            style: {
                fontSize: '22px'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'San Francisco',
            data: _.pluck(newPredictedDataArray["San Francisco"], 'Predicted_Count')
        }, {
            name: 'San Jose',
            data: _.pluck(newPredictedDataArray["San Jose"], 'Predicted_Count')
        }, {
            name: 'Mountain View',
            data: _.pluck(newPredictedDataArray["Mountain View"], 'Predicted_Count')
        }, {
            name: 'Palo Alto',
            data: _.pluck(newPredictedDataArray["Palo Alto"], 'Predicted_Count')
        }, {
            name: 'Redwood City',
            data: _.pluck(newPredictedDataArray["Redwood City"], 'Predicted_Count')
        }]
    });
}

/**
 * Sand-Signika theme for Highcharts JS
 * @author Torstein Honsi
 */

// Load the fonts
Highcharts.createElement('link', {
    href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
    rel: 'stylesheet',
    type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

// Add the background image to the container
Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function(proceed) {
    proceed.call(this);
    this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
});


Highcharts.theme = {
    colors: ["#DF5353", "blue", "green", "yellow", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
    ],
    chart: {
        backgroundColor: "#9bcdff",
        style: {
            fontFamily: "Signika, serif"
        },
        height: '1000',
        borderWidth: "2",
        borderColor: "black",
        type: 'spline'
    },
    title: {
        style: {
            color: 'black',
            fontSize: '24px',
            margin:"20"
            // fontWeight: 'bold'
        }
    },
    subtitle: {
        style: {
            color: 'black',
            fontSize: '20',
            margin:"20"
            //marginBottom:"10"
        }
    },
    tooltip: {
        borderWidth: 0,
        fontSize: '16px'
    },
    legend: {
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '18px'
        }
    },
    xAxis: {
        labels: {
            style: {
                color: 'black',
                fontSize: '20'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: 'black',
                fontSize: '20'
            }
        }
    },
    plotOptions: {
        series: {
            shadow: true
        },
        candlestick: {
            lineColor: '#404048'
        },
        map: {
            shadow: false
        },
        spline: {
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '20'
                },
            },
            enableMouseTracking: true
        }
    },

    // Highstock specific
    navigator: {
        xAxis: {
            gridLineColor: '#D0D0D8'
        }
    },
    /*    rangeSelector: {
            buttonTheme: {
                fill: 'white',
                stroke: '#C0C0C8',
                'stroke-width': 1,
                states: {
                    select: {
                        fill: '#D0D0D8'
                    }
                }
            }
        },*/
    scrollbar: {
        trackBorderColor: '#C0C0C8'
    },

    // General
    background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);