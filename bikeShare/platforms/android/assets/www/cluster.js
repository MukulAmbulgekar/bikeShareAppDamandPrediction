var stationMap;
var cluster1, cluster2, cluster3;

function getJSONCluster() {
	$.getJSON('cluster.json', function(data) {
		stationMap = data.stationMap;
		cluster1 = data.cluster1;
		cluster2 = data.cluster2;
		cluster3 = data.cluster3;
		plotCluster();
	})
};

$(function() {
	getJSONCluster();
})

function plotCluster() {
$('#clusterStations').highcharts({
	chart: {
		type: 'scatter',
		zoomType: 'xy'
	},
	title: {
		text: 'Station clustering based on trips served - 2015'
	},
	subtitle: {
		text: 'K-Means Clustering'
	},
	xAxis: {
		title: {
			enabled: true,
			text: 'Station Id'
		},
		startOnTick: true,
		endOnTick: true,
		showLastLabel: true
	},
	yAxis: {
		title: {
			text: 'Total trips'
		}
	},
	legend: {
		layout: 'vertical',
		align: 'left',
		verticalAlign: 'top',
		x: 100,
		y: 70,
		floating: true,
		backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
		borderWidth: 1
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
				pointFormat: '<b>Station Id:</b> {point.x}, <b>Trips:</b> {point.y} ',
				pointFormatter: function() {
					return '<b>Station:</b> ' + stationMap[this.x][0] + ' <b>Trips:</b> ' + this.y +
						'<br><b>City:</b> ' + stationMap[this.x][1];
				}
			}
		}
	},
	series: [{
		name: 'High Usage Stations',
		color: 'rgba(255, 0, 0, .5)',
		data: cluster1
	}, {
		name: 'Low Usage Stations',
		color: 'rgba(0, 255, 0, .5)',
		data: cluster2
	}, {
		name: 'Medium Usage Stations',
		color: 'rgba(0, 0, 255, .5)',
		data: cluster3
	}]
});
}