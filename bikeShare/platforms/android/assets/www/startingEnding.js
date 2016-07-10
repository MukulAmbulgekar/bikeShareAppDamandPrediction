var sortedStationsWiseData;


function getJSONStartEnd() {
	$.getJSON('startingEnding.json', function(data) {
		sortedStationsWiseData= _.sortBy(data,'starting_trips');
		plotStartEnd();
	})
};

$(function() {
	getJSONStartEnd();
})

function plotStartEnd() {
	$('#startEndStation').highcharts({
		chart: {
			type: 'bar',
			zoomType:'xy',
			height:'5000'
		},
		title: {
			text: 'Starting and Ending Trips'
		},
		subtitle: {
			text: 'All ' + ' - ' + '2015'
		},
		xAxis: [{
			categories: _.pluck(sortedStationsWiseData, 'station_name'),
			reversed: false,
			labels: {
				step: 1
			}
		}, { // mirror axis on right side
			opposite: true,
			reversed: false,
			categories: _.pluck(sortedStationsWiseData, 'station_name'),
			linkedTo: 0,
			labels: {
				step: 1
			}
		}],
		yAxis: {
			title: {
				text: null
			},
			labels: {
				formatter: function() {
					return Math.abs(this.value);
				}
			}
		},
		plotOptions: {
			series: {
				stacking: 'normal'
			}
		},

		tooltip: {
			formatter: function() {
				return '<b>' + this.series.name + ' from ' + this.point.category + '</b><br/>' +
					'Number of rides: ' + Math.abs(this.point.y);
			}
		},
		series: [{
			name: 'Starting Rides',
			data: _.pluck(sortedStationsWiseData, 'starting_trips')
		}, {
			name: 'Ending Rides',
			data: _.pluck(sortedStationsWiseData, 'ending_trips')
		}]
	});
}