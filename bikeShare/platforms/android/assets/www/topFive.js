var yearSelected = '2015';
var cityName = 'San Francisco';
var dayData, monthData, yearData;

$(function() {
	loadDataTopFive();
/*	$("#year2015,#year2014").click(function() {
		loadDataTopFive();
	});*/
/*	$(".city,.mytripssort").click(function() {
		filterDataTopFive();
	})*/
    

    
})


function loadDataTopFive() {
	//yearSelected = $('.myYear:checked').val();
	//$.getJSON("http://52.39.148.231:3000/getData?filename=" + yearSelected + "Monthwise", function(data) {
	$.getJSON("/bikeShare/www/js/" + yearSelected + "Monthwise.json", function(data) {
		monthData = data;
		//$.getJSON("http://52.39.148.231:3000/getData?filename=" + yearSelected + "Daywise", function(data) {
		$.getJSON("/bikeShare/www/js/" + yearSelected + "Daywise.json", function(data) {
			dayData = data;
			//$.getJSON("http://52.39.148.231:3000/getData?filename=" + yearSelected + "Hourwise", function(data) {
			$.getJSON("/bikeShare/www/js/" + yearSelected + "Hourwise.json", function(data) {
				yearData = data;
				filterDataTopFive();
			}, function(error) {
				console.log(error)
			});
		}, function(error) {
			console.log(error)
		});
	}, function(error) {
		console.log(error)
	});
}

function filterDataTopFive() {
	cityName = 'San Francisco';
	calculateMost(yearData);
}

function calculateMost(data) {
	var mostPopularStartingStations = [];
	var mostPopularEndingStations = [];
	var mostTravelledRoutes = [];
	var mostPopularHours = [];
	var mostPopularDays = [];
	var mostPopularMonths = [];
	var mostPopularDaysData = [];
	var mostTravelledRoutesData = {};
	var mostPopularMonthsData = [];
	var mostPopularHoursData = [];
	var stationsWiseData = [];



	var stations = _.uniq(_.pluck(_.where(data, {
		city: cityName
	}), 'start_station').concat(_.pluck(_.where(data, {
		city: cityName
	}), 'end_station')));
	for (var i = 0; i < stations.length; i++) {
		stationsWiseData[stations[i]] = {
			starting_trips: 0,
			ending_trips: 0
		};
	}

	_.forEach(data, function(eachTrip) {
		if (eachTrip.city === cityName) {
			stationsWiseData[eachTrip.start_station]['starting_trips'] = stationsWiseData[eachTrip.start_station]['starting_trips'] + eachTrip.trips;
			stationsWiseData[eachTrip.end_station]['ending_trips'] = stationsWiseData[eachTrip.end_station]['ending_trips'] + eachTrip.trips;
		}
	});

	var sortedStationsWiseData = [];
	for (var key in stationsWiseData) {
		if (stationsWiseData.hasOwnProperty(key)) {
			var value = stationsWiseData[key];
			sortedStationsWiseData.push({
				'station_name': key,
				'starting_trips': stationsWiseData[key].starting_trips,
				'ending_trips': -stationsWiseData[key].ending_trips
			})
		}
	}

	_.forEach(monthData, function(eachTrip) {
		if (eachTrip.city === cityName) {
			if (mostPopularMonthsData[eachTrip.month_of_trip] === undefined) {
				mostPopularMonthsData[eachTrip.month_of_trip] = 0;
			}
			if (mostTravelledRoutesData[eachTrip.start_station + ' - ' + eachTrip.end_station] === undefined) {
				mostTravelledRoutesData[eachTrip.start_station + ' - ' + eachTrip.end_station] = 0;
			}
			mostTravelledRoutesData[eachTrip.start_station + ' - ' + eachTrip.end_station] = mostTravelledRoutesData[eachTrip.start_station + ' - ' + eachTrip.end_station] + eachTrip.trips;
			mostPopularMonthsData[eachTrip.month_of_trip] = mostPopularMonthsData[eachTrip.month_of_trip] + eachTrip.trips;
		}

	});

	_.forEach(dayData, function(eachTrip) {
		if (eachTrip.city === cityName) {
			if (mostPopularDaysData[eachTrip.day_of_week] === undefined) {
				mostPopularDaysData[eachTrip.day_of_week] = 0;

			}
			mostPopularDaysData[eachTrip.day_of_week] = mostPopularDaysData[eachTrip.day_of_week] + eachTrip.trips;
		}
	});

	_.forEach(data, function(eachTrip) {
		if (eachTrip.city === cityName) {
			if (mostPopularHoursData[eachTrip.hour_of_trip] === undefined) {
				mostPopularHoursData[eachTrip.hour_of_trip] = 0;
			}
			mostPopularHoursData[eachTrip.hour_of_trip] = mostPopularHoursData[eachTrip.hour_of_trip] + eachTrip.trips;
		}
	});

	for (var key in mostTravelledRoutesData) {
		if (mostTravelledRoutesData.hasOwnProperty(key)) {
			mostTravelledRoutes.push({
				'route_name': key,
				'trips': mostTravelledRoutesData[key]
			})
		}
	}

	convertObjectToArray(mostPopularMonthsData, 'month_name', mostPopularMonths);
	convertObjectToArray(mostPopularDaysData, 'day_name', mostPopularDays);
	convertObjectToArray(mostPopularHoursData, 'hour_name', mostPopularHours)

	function convertObjectToArray(data, keyName, arrayName) {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				arrayName.push({
					[keyName]: keyName === 'hour_name' ? processHours(key) : key,
						'trips': data[key]
				})
			}
		}
	}

	function processHours(hour) {
		return parseInt(hour) < 12 ? parseInt(hour) + ':00 AM - ' + (parseInt(hour) + 1) + ':00 AM' : parseInt(hour) - 12 + ':00 PM - ' + (parseInt(hour) - 12 + 1) + ':00 PM'
	}
	// making array empty after work done
	mostTravelledRoutesData = [];
	mostPopularMonthsData = [];
	mostPopularHoursData = [];
	mostPopularDaysData = [];
	stationsWiseData =[];

	mostPopularDays = _.sortBy(mostPopularDays, 'trips').reverse().slice(0, 5);
	mostPopularHours = _.sortBy(mostPopularHours, 'trips').reverse().slice(0, 5);
	mostPopularMonths = _.sortBy(mostPopularMonths, 'trips').reverse().slice(0, 5);
	mostTravelledRoutes = _.sortBy(mostTravelledRoutes, 'trips').reverse().slice(0, 5);
	mostPopularStartingStations = _.sortBy(sortedStationsWiseData, 'starting_trips').reverse().slice(0, 5);
	mostPopularEndingStations = _.sortBy(sortedStationsWiseData, 'ending_trips').slice(0, 5);
	var popularDays = '<table class="table table-striped" style="font-size: 20px; border: 3px solid black;border-color: #337ab7;"><caption class="text-center" style="font-weight:bold">Most Popular Days - '  +
		yearSelected + ' </caption> <thead> <tr> <th>Days</th> <th>Rides</th>  </tr> </thead> <tbody> <tr> <td>' + mostPopularDays[0].day_name + '</td> <td>' + mostPopularDays[0].trips + '</td> </tr> <tr> <td>' + mostPopularDays[1].day_name + '</td> <td>' + mostPopularDays[1].trips + '</td> </tr> <tr> <td>' + mostPopularDays[2].day_name + '</td> <td>' + mostPopularDays[2].trips + '</td></tr><tr> <td>' + mostPopularDays[3].day_name + '</td><td>' + mostPopularDays[3].trips + '</td> </tr><tr> <td>' + mostPopularDays[4].day_name + '</td><td>' + mostPopularDays[4].trips + '</td> </tr> </tbody> </table>';
	var popularHours = '<table class="table table-striped" style="font-size: 20px; border: 3px solid black;border-color: #337ab7;"><caption class="text-center" style="font-weight:bold">Most Popular Hours - ' +
		yearSelected + ' </caption> <thead> <tr> <th>Hours</th> <th>Rides</th>  </tr> </thead> <tbody> <tr> <td>' + mostPopularHours[0].hour_name + '</td> <td>' + mostPopularHours[0].trips + '</td> </tr> <tr> <td>' + mostPopularHours[1].hour_name + '</td> <td>' + mostPopularHours[1].trips + '</td> </tr> <tr> <td>' + mostPopularHours[2].hour_name + '</td> <td>' + mostPopularHours[2].trips + '</td></tr><tr> <td>' + mostPopularHours[3].hour_name + '</td><td>' + mostPopularHours[3].trips + '</td> </tr><tr> <td>' + mostPopularHours[4].hour_name + '</td><td>' + mostPopularHours[4].trips + '</td> </tr> </tbody> </table>';
	var popularMonths = '<table class="table table-striped" style="font-size: 20px; border: 3px solid black;border-color: #337ab7;"><caption class="text-center" style="font-weight:bold">Most Popular Months - '  +
		yearSelected + ' </caption> <thead> <tr> <th>Month Name</th> <th>Rides</th>  </tr> </thead> <tbody> <tr> <td>' + mostPopularMonths[0].month_name + '</td> <td>' + mostPopularMonths[0].trips + '</td> </tr> <tr> <td>' + mostPopularMonths[1].month_name + '</td> <td>' + mostPopularMonths[1].trips + '</td> </tr> <tr> <td>' + mostPopularMonths[2].month_name + '</td> <td>' + mostPopularMonths[2].trips + '</td></tr><tr> <td>' + mostPopularMonths[3].month_name + '</td><td>' + mostPopularMonths[3].trips + '</td> </tr><tr> <td>' + mostPopularMonths[4].month_name + '</td><td>' + mostPopularMonths[4].trips + '</td> </tr> </tbody> </table>';
	var popularRoutes = '<table class="table table-striped" style="font-size: 20px; border: 3px solid black;border-color: #337ab7;"> <caption class="text-center"style="font-weight:bold">Most Popular Routes - '  +
		yearSelected + ' </caption> <thead> <tr> <th>From Station</th>   <th>To Station</th><th>Rides</th>  </tr> </thead> <tbody> <tr> <td>' + mostTravelledRoutes[0].route_name.split('-')[0] + '</td> <td>' + mostTravelledRoutes[0].route_name.split('-')[1] + '</td><td>' + mostTravelledRoutes[0].trips + '</td> </tr> <tr> <td>' + mostTravelledRoutes[1].route_name.split('-')[0] + '</td> <td>' + mostTravelledRoutes[1].route_name.split('-')[1] + '</td><td>' + mostTravelledRoutes[1].trips + '</td> </tr><tr> <td>' + mostTravelledRoutes[2].route_name.split('-')[0] + '</td> <td>' + mostTravelledRoutes[2].route_name.split('-')[1] + '</td><td>' + mostTravelledRoutes[2].trips + '</td> </tr><tr> <td>' + mostTravelledRoutes[3].route_name.split('-')[0] + '</td> <td>' + mostTravelledRoutes[3].route_name.split('-')[1] + '</td><td>' + mostTravelledRoutes[3].trips + '</td> </tr><tr> <td>' + mostTravelledRoutes[4].route_name.split('-')[0] + '</td> <td>' + mostTravelledRoutes[4].route_name.split('-')[1] + '</td><td>' + mostTravelledRoutes[4].trips + '</td> </tr> </tbody> </table>';
		var startingStations = '<table class="table table-striped" style="font-size: 20px; border: 3px solid black;border-color: #337ab7;"><caption class="text-center"style="font-weight:bold" >Most Popular Starting Stations - '  +
		yearSelected + ' </caption> <thead> <tr> <th>Station Name</th> <th>Rides</th>  </tr> </thead> <tbody> <tr> <td>' + mostPopularStartingStations[0].station_name + '</td> <td>' + mostPopularStartingStations[0].starting_trips + '</td> </tr> <tr> <td>' + mostPopularStartingStations[1].station_name + '</td> <td>' + mostPopularStartingStations[1].starting_trips + '</td> </tr> <tr> <td>' + mostPopularStartingStations[2].station_name + '</td> <td>' + mostPopularStartingStations[2].starting_trips + '</td></tr><tr> <td>' + mostPopularStartingStations[3].station_name + '</td><td>' + mostPopularStartingStations[3].starting_trips + '</td> </tr><tr> <td>' + mostPopularStartingStations[4].station_name + '</td><td>' + mostPopularStartingStations[4].starting_trips + '</td> </tr> </tbody> </table>';
	var endingStations = '<table class="table table-striped" style="font-size: 20px; border: 3px solid black;border-color: #337ab7;"> <caption class="text-center" style="font-weight:bold">Most Popular Destinations - '  +
		yearSelected + ' </caption> <thead> <tr> <th>Station Name</th> <th>Rides</th>  </tr> </thead> <tbody> <tr> <td>' + mostPopularEndingStations[0].station_name + '</td> <td>' + (-mostPopularEndingStations[0].ending_trips) + '</td> </tr> <tr> <td>' + mostPopularEndingStations[1].station_name + '</td> <td>' + (-mostPopularEndingStations[1].ending_trips) + '</td> </tr> <tr> <td>' + mostPopularEndingStations[2].station_name + '</td> <td>' + (-mostPopularEndingStations[2].ending_trips) + '</td></tr><tr> <td>' + mostPopularEndingStations[3].station_name + '</td><td>' + (-mostPopularEndingStations[3].ending_trips) + '</td> </tr><tr> <td>' + mostPopularEndingStations[4].station_name + '</td><td>' + (-mostPopularEndingStations[4].ending_trips) + '</td> </tr> </tbody> </table>';

		console.log("popularMonths",popularHours)
		console.log("popularDays",popularDays)
		console.log("startingStations",startingStations)
		console.log("endingStations",endingStations)
		
	$("#mostPopularMonths").html(popularMonths);
	$("#mostPopularRoutes").html(popularRoutes);
	$("#mostPopularDays").html(popularDays);
	$("#mostPopularHours").html(popularHours);
	$("#mostStartingStations").html(startingStations);
	$("#mostEndingStations").html(endingStations);
}