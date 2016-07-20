	var newData = [];
$(function () {
	$.getJSON("/bikeShare/www/data/2_Prediction.json",function(data){
	
		_.forEach(data,function(eachData){
			eachData.time = new Date(eachData.time)
			if (eachData.time.getTime() > new Date("Oct 30, 2014").getTime() && eachData.time.getTime() < new Date("Oct 31, 2014").getTime()){
				eachData.Predicted_Count = Math.round(eachData.Predicted_Count);
				eachData.hours= eachData.time.getHours()
				newData.push(eachData);
			}
		})
		plotDemand();
	})
})

function plotDemand(){
	$('#container').highcharts({
        title: {
            text: 'Daily Demand Prediction on hourly basis - '+ newData[0].name + ' -  Correlation :' + newData[0].correlation,
            x: -20 //center
        },
        subtitle: {
            text: 'Demand Prediction- ' + newData[0].time.getFullYear() + "/" + (newData[0].time.getMonth() + 1) + "/" + newData[0].time.getDate() ,
            x: -20
        },
        xAxis: {
            categories: _.pluck(newData,'hours'),
             title: {
                text: ' Hours [0-23]'
            }
        },
        yAxis: {
            title: {
                text: ' Avalaible Bikes'
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
            name: 'Actual Avalability',
            data: _.pluck(newData,'Actual_Count')
        }, {
            name: 'Predicted Avalability',
            data: _.pluck(newData,'Predicted_Count')
        }]
    });
}