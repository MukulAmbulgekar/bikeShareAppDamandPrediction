var newData = [];
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
    newData = [];
    fromDate = new Date(dateSelected);
    var toDate = new Date(dateSelected)
    toDate.setDate(toDate.getDate() + 1);
    $.getJSON("/bikeShare/www/RandomForestTripsScikit/" + stationIdSelected + "_Prediction_RF_SCI.json", function(data) {
        _.forEach(data, function(eachData) {
            eachData.time = new Date(eachData.time)
            if (eachData.time.getTime() > fromDate.getTime() && eachData.time.getTime() < toDate.getTime()) {
                eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                eachData.hours = eachData.time.getHours() + ':00'
                newData.push(eachData);
            }
        })
        if (newData.length !== 0) {
            plotDemand();
        } else {
            alert("Data not found Please check dates selected")
        }
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

function plotDemand() {
    $('#container').highcharts({
        title: {
            text: 'Daily Demand Prediction for Trips on hourly basis - <b>' + newData[0].name + '</b><br> Correlation :<b>' + newData[0].COR + '</b>  RMSLE:<b>' + Math.round(newData[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + '</b> <br> Algorithm - <b>Random Forest</b>'

        },
        xAxis: {
            categories: _.pluck(newData, 'hours'),
            title: {
                text: ' Hours [0-23]',
                style: {
                    fontSize: '16px'
                }
            }
        },
        yAxis: {
            title: {
                text: ' Total number of trips',
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
            valueSuffix: ' Trips',
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
            name: 'Actual Trips',
            data: _.pluck(newData, 'Actual_Count')
        }, {
            name: 'Predicted Trips',
            data: _.pluck(newData, 'Predicted_Count')
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
        height: '600'
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
        fontSize: '14px'
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
                color: '#6e6e70',
                fontSize: '20px'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: '#6e6e70',
                fontSize: '20px'
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