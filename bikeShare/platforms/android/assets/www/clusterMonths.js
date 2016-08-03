var clusterMonths1 = [],
	clusterMonths2 = [],
	clusterMonths3 = [];
var months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function getJSONClusterHMonths() {
	$.getJSON('clusterMonths.json', function(data) {
		processClustersMonths(_.where(data, {
			"cluster": 1
		}), 1);
		processClustersMonths(_.where(data, {
			"cluster": 2
		}), 2);
		processClustersMonths(_.where(data, {
			"cluster": 3
		}), 3);
		plotClusterMonths();

	})
};

function processClustersMonths(cluster, num) {
	_.forEach(cluster, function(each) {
		if (num === 1) {
			clusterMonths1.push([parseInt(each.month_of_trip), each.trips])
		}
		if (num === 2) {
			clusterMonths2.push([parseInt(each.month_of_trip), each.trips])
		}
		if (num === 3) {
			clusterMonths3.push([parseInt(each.month_of_trip), each.trips])
		}
	})
}

$(function() {
	getJSONClusterHMonths();
})

function plotClusterMonths() {
	$('#clusterMonths').highcharts({
		chart: {
			type: 'scatter',
			plotBorderWidth: 5,
			zoomType: 'xy'
		},

		title: {
			text: 'Months clustering based on trips - 2015'
		},
		subtitle: {
			text: 'K-Means Clustering'
		},

		xAxis: {
			title: {
				text: 'Months'
			},
			gridLineWidth: 2,
			minTickInterval: 1
		},
		yAxis: {
			title: {
				text: 'Total trips'
			},
			startOnTick: false,
			endOnTick: false
		},
		plotOptions: {
			scatter: {
				tooltip: {
					headerFormat: '<b>{series.name}</b><br>',
					pointFormat: '<b>Month - </b> {point.x},<br> <b>Trips:</b> {point.y} ',
					pointFormatter: function() {
						return '<b>Month:</b> ' + months[this.x] + '<br> <b>Trips:</b> ' + this.y;
					}
				}
			}
		},
		series: [{
			data: clusterMonths1,
			name: 'Medium Demand Months',
			marker: {
				radius: 12,
				fillColor: {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.7
					},
					stops: [
						[0, 'rgba(0, 0, 255, .5)'],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
					]
				}
			}
		}, {
			data: clusterMonths2,
			name: 'High Demand Months',
			marker: {
				radius: 12,
				fillColor: {
					radialGradient: {
						cx: 0.4,
						cy: 0.3,
						r: 0.7
					},
					stops: [
						[0, 'rgba(0, 255, 0, .5)'],
						[1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
					]
				}
			}
		}, {
			data: clusterMonths3,
			name: 'Low Demand Months',
			marker: {
				radius: 12,
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
		}]
	});
}