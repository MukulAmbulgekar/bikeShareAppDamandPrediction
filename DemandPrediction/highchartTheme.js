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
    colors: ["#DF5353", "blue", "green", "yellow", "#ff0066",
        "#7798BF", "#2B908F", "#f45b5b", "#55BF3B", "orange"
    ],
    chart: {
        style: {
            fontFamily: "Signika, serif"
        },
        borderWidth: "2",
        borderColor: "black"
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
        title: {
            style: {
                color: 'black',
                fontSize: '20px'
            }
        },
        labels: {
            style: {
                color: 'black',
                fontSize: '20px'
            }
        }
    },
    yAxis: {
        labels: {
            style: {
                color: 'black',
                fontSize: '20'
            }
        },
        title: {
            style: {
                color: 'black',
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