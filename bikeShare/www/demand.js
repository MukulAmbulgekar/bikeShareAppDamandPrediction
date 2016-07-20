var newData = [];
var dateSelected = 'Mar 23, 2015';
var fromDate;
var toDate;
var stationIdSelected = 70;
$(function() {
    getPrediction(dateSelected);
})


function getPrediction(dateSelect) {
    newData = [];
    fromDate = new Date(dateSelect);
    var toDate = new Date(dateSelect)
    toDate.setDate(toDate.getDate() + 1);
    $.getJSON("/bikeShare/www/GradientBoosting/" + stationIdSelected + "_Prediction_GB.json", function(data) {
        _.forEach(data, function(eachData) {
            eachData.time = new Date(eachData.time)
            if (eachData.time.getTime() > fromDate.getTime() && eachData.time.getTime() < toDate.getTime()) {
                eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
                eachData.hours = eachData.time.getHours()
                newData.push(eachData);
            }
        })
        $.getJSON("data/stations.json", function(data) {
            if (newData.length !== 0) {
                plotDemand();
            } else {
                alert("Data not found Please check dates selected")
            }

        })

    })
}

function plotDemand() {
    $('#container').highcharts({
        title: {
            text: 'Daily Demand Prediction for Trips on hourly basis - <b>' + newData[0].name + '</b><br> Correlation :<b>' + newData[0].COR + '</b> <br> RMSLE:<b>' + Math.round(newData[0].RMSLE * 100) / 100 + '</b>',
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- <b>' + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + '</b> <br> Algorithm - <b>Gradient Boosting</b>'

        },
        xAxis: {
            categories: _.pluck(newData, 'hours'),
            title: {
                text: ' Hours [0-23]'
            }
        },
        yAxis: {
            title: {
                text: ' Total number of trips'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' Bikes'
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