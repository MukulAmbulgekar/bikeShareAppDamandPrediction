
var clusterHours1=[], clusterHours2=[], clusterHours3=[];

function getJSONClusterHours() {
	$.getJSON('clusterHours.json', function(data) {
		processClusters(_.where(data,{"cluster":1}),1);
		processClusters(_.where(data,{"cluster":2}),2);
		processClusters(_.where(data,{"cluster":3}),3);
		plotClusterHours();
		
	})
};

function processClusters(cluster,num){
	_.forEach(cluster,function(each){
		if(num===1){
			clusterHours1.push([each.hour,each.trips])
		}
		if(num===2){
			clusterHours2.push([each.hour,each.trips])
		}
		if(num===3){
			clusterHours3.push([each.hour,each.trips])
		}
	})
}

$(function() {
	getJSONClusterHours();
})

function plotClusterHours() {
$('#clusterHours').highcharts({
	chart: {
		type: 'scatter',
		zoomType: 'xy'
	},
	title: {
		text: 'Station clustering based on hour of the day and Trips - 2015'
	},
	subtitle: {
		text: 'K-Means Clustering'
	},
	xAxis: {
		title: {
			enabled: true,
			text: 'Hours'
		},
		startOnTick: true,
		minTickInterval:1,
		endOnTick: true,
		showLastLabel: true
	},
	yAxis: {
		title: {
			text: 'Total trips'
		}
	},
	plotOptions: {
		scatter: {
			marker: {
				radius: 8,
				states: {
					hover: {
						enabled: true,
						lineColor: 'rgb(100,100,100)'
					}
				}
			},
			states: {
				hover: {
					marker: {
						enabled: false
					}
				}
			},
			tooltip: {
				headerFormat: '<b>{series.name}</b><br>',
				pointFormat: '<b>Hour - </b> {point.x}:00,<br> <b>Trips:</b> {point.y} ',
			}
		}
	},
	series: [{
		name: 'Low Demand Hours Usage Stations',
		color: 'rgba(255, 0, 0, .5)',
		data: clusterHours1
	}, {
		name: 'Average Demand Hours Usage Stations',
		color: 'rgba(0, 255, 0, .5)',
		data: clusterHours2
	}, {
		name: 'Peak Demand Hours Usage Stations',
		color: 'rgba(0, 0, 255, .5)',
		data: clusterHours3
	}]
});
}