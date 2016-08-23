# README #

This is android app for bay area bike share analysis (Real Time and Historical).
We are also providing dashboard analytics for bike vendors.
Also we are going to implement demand prediction based on historical data.

### Things that are done ###

Mobile Application

*  Find nearby bike stations (within 0.5 miles) and their avalability. (Cities included - Bay area, Chicago, New York)
*  Get real time status of available Bikes/Docks at a particular bike station
*  Get weather information
*  Search places on google maps to get bike status.
*  Suggest new Bike Stations

Web Application 

*  K-Means Clustering for stations based on number of trips
*  Added demand prediction for number of trips on hourly basis for last one year using Gradient Boosting, Random Forest, Ada Boosting and Extra Trees Regressor. 
*  Added demand prediction for number of bike availability for last one year on hourly basis using Gradient Boosting, Random Forest, Ada Boosting and Extra Trees Regressor. 
*  Added future demand prediction using gradient boosting algorithm as it was giving best results for given data set.



### How do I get set up? ###

* Set up Cordova - https://cordova.apache.org/docs/en/latest/guide/cli/

* Install geolocation plugin (to get device location ) - **cordova plugin add cordova-plugin-geolocation**

* Install google maps plugin (to show bike stations on map) -** cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID='Your Google API Key'**

* After set up, clone this project directory and build  run - **cordova build**

*  **cordova run --device**  (or emulator if you are running on android emulator)

**Sample screenshots of Application**

![Screenshot_20160626-180638.jpg](https://bitbucket.org/repo/LpbXRr/images/513438713-Screenshot_20160626-180638.jpg width="48")

![Screenshot_20160710-151640.jpg](https://bitbucket.org/repo/LpbXRr/images/272707689-Screenshot_20160710-151640.jpg)

![Screenshot_20160710-151702.jpg](https://bitbucket.org/repo/LpbXRr/images/2543461093-Screenshot_20160710-151702.jpg)

![Screenshot_20160710-151734.jpg]
(https://bitbucket.org/repo/LpbXRr/images/3886778214-Screenshot_20160710-151734.jpg)

![Screenshot_20160626-180551.png]
(https://bitbucket.org/repo/LpbXRr/images/2895305956-Screenshot_20160626-180551.png)

Station Cluster

![stationsCluster.png](https://bitbucket.org/repo/LpbXRr/images/1371861325-stationsCluster.png)

Hourly Clustering
![HoursCluster.png](https://bitbucket.org/repo/LpbXRr/images/3246384951-HoursCluster.png)


DemandPredictionDashboard

![PredictionDashoboard.png](https://bitbucket.org/repo/LpbXRr/images/1325917692-PredictionDashoboard.png)

DemandPredictionDashboard - Trips

![TripsPrediction.png](https://bitbucket.org/repo/LpbXRr/images/3962446731-TripsPrediction.png)

DemandPredictionDashboard - Availability

![BikeAvailabilityPrediction.png](https://bitbucket.org/repo/LpbXRr/images/196978163-BikeAvailabilityPrediction.png)

Future prediction for number of trips based on month, type of day(weekday/weekend), temp, rain etc.

![FuturePredictionTrips.png](https://bitbucket.org/repo/LpbXRr/images/3403255491-FuturePredictionTrips.png)


Data Analytics Dashboard 

![Dashoboard.png](https://bitbucket.org/repo/LpbXRr/images/2119886499-Dashoboard.png)

![snapshotView.jpg](https://bitbucket.org/repo/LpbXRr/images/236357036-snapshotView.jpg)

Data Visualization Weekday

![dataVisualization.jpg](https://bitbucket.org/repo/LpbXRr/images/960626874-dataVisualization.jpg)

Data Visualization Weekend
![dataVisualizationWeekend.jpg](https://bitbucket.org/repo/LpbXRr/images/2669415847-dataVisualizationWeekend.jpg)

