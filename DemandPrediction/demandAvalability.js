var randomForest = [];
var gradientBoosting = [];
var adaBoostingTrips = [];
var extraTreesClassifierTrips = [];
var dateSelected = 'Mar 23, 2015';
var fromDate;
var toDate;
var stationIdSelected = 70;
var stationsNames = [];
$(function() {
    $.getJSON("data/stations.json", function(data) {
        stationsNames = data;
        populateSelectList();
        getPrediction(dateSelected);
    })
})

function getPrediction(dateSelect) {
    if ($("#items option:selected").val() !== undefined) {
        stationIdSelected = $("#items option:selected").val();
    }
    if (dateSelect) {
        dateSelected = new Date(dateSelect);
    }
    randomForest = [];
    gradientBoosting = [];
    extraTreesClassifierTrips = [];
    adaBoostingTrips = [];
    fromDate = new Date(dateSelected);
    var toDate = new Date(dateSelected)
    toDate.setDate(toDate.getDate() + 1);
    $.getJSON("/DemandPrediction/Demand Analysis/Prediction/RandomForestStatus/" + stationIdSelected + "_Prediction_Status_RF.json", function(data) {
        _.forEach(data, function(eachData) {
            eachData.time = new Date(eachData.time)
            if (eachData.time.getTime() > fromDate.getTime() && eachData.time.getTime() < toDate.getTime()) {
                eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                eachData.hours = eachData.time.getHours() + ':00'
                randomForest.push(eachData);
            }
        });
        $.getJSON("/DemandPrediction/Demand Analysis/Prediction/GradientBoostingStatus/" + stationIdSelected + "_Prediction_Status_GB.json", function(data) {
            _.forEach(data, function(eachData) {
                eachData.time = new Date(eachData.time)
                if (eachData.time.getTime() > fromDate.getTime() && eachData.time.getTime() < toDate.getTime()) {
                    eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                    eachData.hours = eachData.time.getHours() + ':00'
                    gradientBoosting.push(eachData);
                }
            })
            $.getJSON("/DemandPrediction/Demand Analysis/Prediction/ExtraTreesStatus/" + stationIdSelected + "_Prediction_Status_ET.json", function(data) {
                _.forEach(data, function(eachData) {
                    eachData.time = new Date(eachData.time)
                    if (eachData.time.getTime() > fromDate.getTime() && eachData.time.getTime() < toDate.getTime()) {
                        eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                        eachData.hours = eachData.time.getHours() + ':00'
                        extraTreesClassifierTrips.push(eachData);
                    }
                })
                $.getJSON("/DemandPrediction/Demand Analysis/Prediction/AdaBoostingStatus/" + stationIdSelected + "_Prediction_Status_AB.json", function(data) {
                    _.forEach(data, function(eachData) {
                        eachData.time = new Date(eachData.time)
                        if (eachData.time.getTime() > fromDate.getTime() && eachData.time.getTime() < toDate.getTime()) {
                            eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                            eachData.hours = eachData.time.getHours() + ':00'
                            adaBoostingTrips.push(eachData);
                        }
                    })
                    if (randomForest.length !== 0) {
                        plotDemand();
                        generateTableValues();
                    } else {
                        alert("Data not found Please check dates selected")
                    }
                })

            })

        })
    })
}


function populateSelectList() {
    var option = '';
    for (var i = 0; i < stationsNames.length; i++) {
        option += '<option value="' + stationsNames[i].station_id + '">' + stationsNames[i].name + '</option>';
    }
    //$('#items').append("<option value='70'>San Francisco Caltrain (Townsend at 4th) </option>");
    $('#items').append(option);
}

function generateTableValues(){
$("#gradientRSML").text(Math.round(gradientBoosting[0].RMSLE * 100) / 100)
$("#gradientCOR").text(gradientBoosting[0].COR)
$("#randomRSML").text(Math.round(randomForest[0].RMSLE * 100) / 100)
$("#randomCOR").text(randomForest[0].COR)
$("#extraRSML").text(Math.round(extraTreesClassifierTrips[0].RMSLE * 100) / 100)
$("#extraCOR").text(extraTreesClassifierTrips[0].COR)
$("#adaRSML").text(Math.round(adaBoostingTrips[0].RMSLE * 100) / 100)
$("#adaCOR").text(adaBoostingTrips[0].COR)
/*$("#gradientCOR").text('Mukul')
$("#gradientCOR").text('Mukul')
$("#gradientCOR").text('Mukul')
$("#gradientCOR").text('Mukul')
$("#gradientCOR").text('Mukul')
$("#gradientCOR").text('Mukul')*/

}

function plotDemand() {
    $('#randomForest').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + randomForest[0].name + '</b><br> Correlation :<b>' + randomForest[0].COR + '</b>  RMSLE:<b>' + Math.round(randomForest[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + '</b> <br> Algorithm - <b>Random Forest</b>'

        },
        xAxis: {
            categories: _.pluck(randomForest, 'hours'),
            title: {
                text: ' Hours [0-23]',
                style: {
                    fontSize: '16px'
                }
            }
        },
        yAxis: {
            title: {
                text: ' Total number of Bikes',
                style: {
                    fontSize: '16px'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Bikes',
            style: {
                fontSize: '16px'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(randomForest, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(randomForest, 'Predicted_Count')
        }]
    });
    // gradient boosting

    $('#gradientBoosting').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + gradientBoosting[0].name + '</b><br> Correlation :<b>' + gradientBoosting[0].COR + '</b>  RMSLE:<b>' + Math.round(gradientBoosting[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + '</b> <br> Algorithm - <b>Gradient Boosting</b>'

        },
        xAxis: {
            categories: _.pluck(gradientBoosting, 'hours'),
            title: {
                text: ' Hours [0-23]',
                style: {
                    fontSize: '16px'
                }
            }
        },
        yAxis: {
            title: {
                text: ' Total number of Bikes',
                style: {
                    fontSize: '16px'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Bikes',
            style: {
                fontSize: '16px'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(gradientBoosting, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(gradientBoosting, 'Predicted_Count')
        }]
    });adaBoostingTrips
    $('#extraTreesClassifierTrips').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + extraTreesClassifierTrips[0].name + '</b><br> Correlation :<b>' + extraTreesClassifierTrips[0].COR + '</b>  RMSLE:<b>' + Math.round(extraTreesClassifierTrips[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + '</b> <br> Algorithm - <b>Extra Trees Regressor</b>'

        },
        xAxis: {
            categories: _.pluck(extraTreesClassifierTrips, 'hours'),
            title: {
                text: ' Hours [0-23]',
                style: {
                    fontSize: '16px'
                }
            }
        },
        yAxis: {
            title: {
                text: ' Total number of Bikes',
                style: {
                    fontSize: '16px'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Bikes',
            style: {
                fontSize: '16px'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(extraTreesClassifierTrips, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(extraTreesClassifierTrips, 'Predicted_Count')
        }]
    });
     $('#adaBoostingTrips').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + adaBoostingTrips[0].name + '</b><br> Correlation :<b>' + adaBoostingTrips[0].COR + '</b>  RMSLE:<b>' + Math.round(adaBoostingTrips[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + '</b> <br> Algorithm - <b>ADA Boosting</b>'

        },
        xAxis: {
            categories: _.pluck(adaBoostingTrips, 'hours'),
            title: {
                text: ' Hours [0-23]',
                style: {
                    fontSize: '16px'
                }
            }
        },
        yAxis: {
            title: {
                text: ' Total number of Bikes',
                style: {
                    fontSize: '16px'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Bikes',
            style: {
                fontSize: '16px'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(adaBoostingTrips, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(adaBoostingTrips, 'Predicted_Count')
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
    colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
        "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"
    ],
    chart: {
        backgroundColor: "#aaeeee",
        style: {
            fontFamily: "Signika, serif"
        },
        height: '530'
    },
    title: {
        style: {
            color: 'black',
            fontSize: '20px',
            // fontWeight: 'bold'
        }
    },
    subtitle: {
        style: {
            color: 'black',
            fontSize: '16px',
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
        }
    },

    // Highstock specific
    navigator: {
        xAxis: {
            gridLineColor: '#D0D0D8'
        }
    },
    rangeSelector: {
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
    },
    scrollbar: {
        trackBorderColor: '#C0C0C8'
    },

    // General
    background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);