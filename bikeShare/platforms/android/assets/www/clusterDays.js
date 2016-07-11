var clusterDays1 = [],
	clusterDays2 = [];
var days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getJSONClusterDays() {
	$.getJSON('clusterDays.json', function(data) {
		processClustersDays(_.where(data, {
			"cluster": 1
		}), 1);
		processClustersDays(_.where(data, {
			"cluster": 2
		}), 2);
		plotClusterDays();

	})
};

function processClustersDays(cluster, num) {
	_.forEach(cluster, function(each) {
		if (num === 1) {
			clusterDays1.push([parseInt(each.day_of_week_number), each.trips])
		}
		if (num === 2) {
			clusterDays2.push([parseInt(each.day_of_week_number), each.trips])
		}
	})
}

$(function() {
	getJSONClusterDays();
})

function plotClusterDays() {
	$('#clusterDays').highcharts({
		chart: {
			type: 'scatter',
			zoomType: 'xy'
		},
		title: {
			text: 'Station clustering based on WeekDay/Weekend and Trips - 2015'
		},
		subtitle: {
			text: 'K-Means Clustering'
		},
		xAxis: {
			title: {
				enabled: true,
				text: 'Days'
			},
			startOnTick: true,
			minTickInterval: 1,
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
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '<b>Day - </b> {point.x}:00,<br> <b>Trips:</b> {point.y} ',
					pointFormatter: function() {
						return '<b>Day:</b> ' + days[this.x] + '<br> <b>Trips:</b> ' + this.y;
					}
				}
			}
		},
		series: [{
			name: 'Weekday Usage Stations',
			data: clusterDays1,
			marker: {
				radius: 15,
				fillColor: {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.7
					},
					stops: [
						[0, 'rgba(255, 0, 0, .5)'],
						[1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
					]
				}
			}
		}, {
			name: 'Weekend Usage Stations',
			data: clusterDays2,
			marker: {
				radius: 12,
				fillColor: {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.7
					},
					stops: [
						[0, 'blue'],
						[1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
					]
				}
			}
		}]
	});
}