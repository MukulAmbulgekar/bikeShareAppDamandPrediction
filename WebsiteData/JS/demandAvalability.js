var randomForestAvailability = [];
var gradientBoostingAvailability = [];
var adaBoostingAvailability = [];
var extraTreesClassifierAvailability = [];
var dateSelectedAvailability = 'Jun 23, 2015';
var fromDateAvailability;
var toDateAvailability;
var stationIdSelectedAvailability = 70;
var stationsNamesAvailability = [];
$(function() {
    $.getJSON("/WebsiteData/HTML/data/station.json", function(data) {
        stationsNamesAvailability = data;
        populateSelectList();
        getPredictionAvalability(dateSelectedAvailability);
    })
})

function getPredictionAvalability(dateSelect) {
    if ($("#stationsAvalability option:selected").val() !== undefined) {
        stationIdSelectedAvailability = $("#stationsAvalability option:selected").val();
    }
    if (dateSelect) {
        dateSelectedAvailability = new Date(dateSelect);
    }
    randomForestAvailability = [];
    gradientBoostingAvailability = [];
    extraTreesClassifierAvailability = [];
    adaBoostingAvailability = [];
    fromDateAvailability = new Date(dateSelectedAvailability);
    var toDateAvailability = new Date(dateSelectedAvailability)
    toDateAvailability.setDate(toDateAvailability.getDate() + 1);
    $.getJSON("/DemandPrediction/Demand Analysis/Prediction/randomForestStatus/" + stationIdSelectedAvailability + "_Prediction_Status_RF.json", function(data) {
        _.forEach(data, function(eachData) {
            eachData.time = new Date(eachData.time)
            if (eachData.time.getTime() > fromDateAvailability.getTime() && eachData.time.getTime() < toDateAvailability.getTime()) {
                eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                eachData.hours = eachData.time.getHours() + ':00'
                randomForestAvailability.push(eachData);
            }
        });
        $.getJSON("/DemandPrediction/Demand Analysis/Prediction/gradientBoostingStatus/" + stationIdSelectedAvailability + "_Prediction_Status_GB.json", function(data) {
            _.forEach(data, function(eachData) {
                eachData.time = new Date(eachData.time)
                if (eachData.time.getTime() > fromDateAvailability.getTime() && eachData.time.getTime() < toDateAvailability.getTime()) {
                    eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                    eachData.hours = eachData.time.getHours() + ':00'
                    gradientBoostingAvailability.push(eachData);
                }
            })
            $.getJSON("/DemandPrediction/Demand Analysis/Prediction/ExtraTreesStatus/" + stationIdSelectedAvailability + "_Prediction_Status_ET.json", function(data) {
                _.forEach(data, function(eachData) {
                    eachData.time = new Date(eachData.time)
                    if (eachData.time.getTime() > fromDateAvailability.getTime() && eachData.time.getTime() < toDateAvailability.getTime()) {
                        eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                        eachData.hours = eachData.time.getHours() + ':00'
                        extraTreesClassifierAvailability.push(eachData);
                    }
                })
                $.getJSON("/DemandPrediction/Demand Analysis/Prediction/AdaBoostingStatus/" + stationIdSelectedAvailability + "_Prediction_Status_AB.json", function(data) {
                    _.forEach(data, function(eachData) {
                        eachData.time = new Date(eachData.time)
                        if (eachData.time.getTime() > fromDateAvailability.getTime() && eachData.time.getTime() < toDateAvailability.getTime()) {
                            eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                            eachData.hours = eachData.time.getHours() + ':00'
                            adaBoostingAvailability.push(eachData);
                        }
                    })
                    if (randomForestAvailability.length !== 0) {
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
    for (var i = 0; i < stationsNamesAvailability.length; i++) {
        option += '<option value="' + stationsNamesAvailability[i].station_id + '">' + stationsNamesAvailability[i].name + '</option>';
    }
    //$('#items').append("<option value='70'>San Francisco Caltrain (Townsend at 4th) </option>");
    $('#stationsAvalability').append(option);
    $("#stationsAvalability").val('70');
}

function generateTableValues() {
    $("#gradientRSMLAvail").text(Math.round(gradientBoostingAvailability[0].RMSLE * 100) / 100)
    $("#gradientCORAvail").text(gradientBoostingAvailability[0].COR)
    $("#randomRSMLAvail").text(Math.round(randomForestAvailability[0].RMSLE * 100) / 100)
    $("#randomCORAvail").text(randomForestAvailability[0].COR)
    $("#extraRSMLAvail").text(Math.round(extraTreesClassifierAvailability[0].RMSLE * 100) / 100)
    $("#extraCORAvail").text(extraTreesClassifierAvailability[0].COR)
    $("#adaRSMLAvail").text(Math.round(adaBoostingAvailability[0].RMSLE * 100) / 100)
    $("#adaCORAvail").text(adaBoostingAvailability[0].COR)
        /*$("#gradientCOR").text('Mukul')
        $("#gradientCOR").text('Mukul')
        $("#gradientCOR").text('Mukul')
        $("#gradientCOR").text('Mukul')
        $("#gradientCOR").text('Mukul')
        $("#gradientCOR").text('Mukul')*/

}

function plotDemand() {
    $('#randomForestAvailability').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + randomForestAvailability[0].name + '</b><br> Correlation :<b>' + randomForestAvailability[0].COR + '</b>  RMSLE:<b>' + Math.round(randomForestAvailability[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDateAvailability.getFullYear() + "/" + (fromDateAvailability.getMonth() + 1) + "/" + fromDateAvailability.getDate() + '</b> <br> Algorithm - <b>Random Forest</b>'

        },
        xAxis: {
            categories: _.pluck(randomForestAvailability, 'hours'),
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
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(randomForestAvailability, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(randomForestAvailability, 'Predicted_Count')
        }]
    });
    // gradient boosting

    $('#gradientBoostingAvailability').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + gradientBoostingAvailability[0].name + '</b><br> Correlation :<b>' + gradientBoostingAvailability[0].COR + '</b>  RMSLE:<b>' + Math.round(gradientBoostingAvailability[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDateAvailability.getFullYear() + "/" + (fromDateAvailability.getMonth() + 1) + "/" + fromDateAvailability.getDate() + '</b> <br> Algorithm - <b>Gradient Boosting</b>'

        },
        xAxis: {
            categories: _.pluck(gradientBoostingAvailability, 'hours'),
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
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(gradientBoostingAvailability, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(gradientBoostingAvailability, 'Predicted_Count')
        }]
    });
    adaBoostingAvailability
    $('#extraTreesClassifierAvailability').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + extraTreesClassifierAvailability[0].name + '</b><br> Correlation :<b>' + extraTreesClassifierAvailability[0].COR + '</b>  RMSLE:<b>' + Math.round(extraTreesClassifierAvailability[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDateAvailability.getFullYear() + "/" + (fromDateAvailability.getMonth() + 1) + "/" + fromDateAvailability.getDate() + '</b> <br> Algorithm - <b>Extra Trees Regressor</b>'

        },
        xAxis: {
            categories: _.pluck(extraTreesClassifierAvailability, 'hours'),
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
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(extraTreesClassifierAvailability, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(extraTreesClassifierAvailability, 'Predicted_Count')
        }]
    });
    $('#adaBoostingAvailability').highcharts({
        title: {
            text: 'Daily Demand Prediction for Bikes on hourly basis - <b>' + adaBoostingAvailability[0].name + '</b><br> Correlation :<b>' + adaBoostingAvailability[0].COR + '</b>  RMSLE:<b>' + Math.round(adaBoostingAvailability[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDateAvailability.getFullYear() + "/" + (fromDateAvailability.getMonth() + 1) + "/" + fromDateAvailability.getDate() + '</b> <br> Algorithm - <b>ADA Boosting</b>'

        },
        xAxis: {
            categories: _.pluck(adaBoostingAvailability, 'hours'),
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
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Actual Bikes',
            data: _.pluck(adaBoostingAvailability, 'Actual_Count')
        }, {
            name: 'Predicted Bikes',
            data: _.pluck(adaBoostingAvailability, 'Predicted_Count')
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
        // backgroundColor: "#aaeeee",
        style: {
            fontFamily: "Signika, serif"
        },
        height: '560',
        //borderWidth: "2",
        //borderColor: "blue"
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
        line: {
            dataLabels: {
                enabled: false,
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
    tooltip: {
        valueSuffix: ' Bikes',
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