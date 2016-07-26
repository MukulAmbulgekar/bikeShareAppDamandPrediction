var dataJson = [];
$(function() {
    $.getJSON("/DemandPrediction/data/jsonDayHour.json", function(data) {
        // console.log("plotChart();",JSON.stringify(data,null,2))
        dataJson = data;
        plotDayHourTripsChart();
    })


})

function plotDayHourTripsChart() {
    $('#dayHourTrips').highcharts({
        chart: {
            type: 'spline',
        },
        title: {
            text: 'People rent bikes for morning/evening commutes on weekdays, and daytime rides on weekends\n',
            x: -20 //center
        },
        subtitle: {
            text: 'Data Source: bayareabikeshare.com',
            x: -20
        },
        xAxis: {
            categories: _.uniq(_.pluck(dataJson, 'hour').map(function(eachHour) {
                return eachHour + ':00'
            })),
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
                text: 'Number of Trips',
                style: {
                    fontSize: '20',
                    color: "black"
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Avg. Trips',
            shared: true,
            crosshairs: [{
                color: '#b2d6a8',
                opacity: '0.5'
            }],
            style: {
                fontSize: '22px'
            }
        },
        plotOptions: {
            spline: {
                lineWidth: 7,

            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 2
        },
        series: [{
            name: 'Sunday',
            data: _.pluck(_.where(dataJson, {
                day: 'Sun'
            }), 'count')
        }, {
            name: 'Monday',
            data: _.pluck(_.where(dataJson, {
                day: 'Mon'
            }), 'count')
        }, {
            name: 'Tuesday',
            data: _.pluck(_.where(dataJson, {
                day: 'Tues'
            }), 'count')
        }, {
            name: 'Wednesday',
            data: _.pluck(_.where(dataJson, {
                day: 'Wed'
            }), 'count')
        }, {
            name: 'Thursday',
            data: _.pluck(_.where(dataJson, {
                day: 'Thurs'
            }), 'count')
        }, {
            name: 'Friday',
            data: _.pluck(_.where(dataJson, {
                day: 'Fri'
            }), 'count')
        }, {
            name: 'Saturday',
            data: _.pluck(_.where(dataJson, {
                day: 'Sat'
            }), 'count')
        }]
    });
};

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
    chart: {
        //backgroundColor: "#9bcdff",
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
            margin: "20"
                // fontWeight: 'bold'
        }
    },
    subtitle: {
        style: {
            color: 'black',
            fontSize: '20',
            margin: "20"
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