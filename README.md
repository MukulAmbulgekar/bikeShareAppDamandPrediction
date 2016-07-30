# README #

This is android app for bay area bike share analysis (Real Time and Historical).
We are also providing dashboard analytics for bike vendors.
Also we are going to implement demand prediction based on historical data.

### Things that are done ###

*  Find nearby bike stations (within 0.5 miles) and their avalability
*  Get real time status of available Bikes/Docks at a particular bike station
*  Get weather information
*  Search places on google maps to get bike status.
*  Suggest new Bike Stations
* K-Means Clustering for stations based on number of trips
* Added demand prediction for number of trips on hourly basis using Gradient Boosting. 
* Added demand prediction for number of trips on hourly basis using Random Forest. 

** Features to be implemented **
* Demand prediction Algorithm
* Big data analysis  - web dashboard
* Android Mobile Application for real time analysis and status of bike stations 


### How do I get set up? ###

* Set up Cordova - https://cordova.apache.org/docs/en/latest/guide/cli/

* Install geolocation plugin (to get device location ) - **cordova plugin add cordova-plugin-geolocation**

* Install google maps plugin (to show bike stations on map) -** cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID='Your Google API Key'**

* After set up, clone this project directory and build  run - **cordova build**

*  **cordova run --device**  (or emulator if you are running on android emulator)

**Sample screenshots of Application**

![Screenshot_20160626-180638.jpg](https://bitbucket.org/repo/LpbXRr/images/513438713-Screenshot_20160626-180638.jpg)

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

Gradient Boosting
![DemandPredictionGB.jpeg](https://bitbucket.org/repo/LpbXRr/images/4085174765-DemandPredictionGB.jpeg)

Random Forest

![DemandPredictionRandomForest.png](https://bitbucket.org/repo/LpbXRr/images/2741760046-DemandPredictionRandomForest.png)

DemandPredictionDashboard - Trips

![TripsPredictionDashboard.png](https://bitbucket.org/repo/LpbXRr/images/809193236-TripsPredictionDashboard.png)

DemandPredictionDashboard - Availability

![AvalabilityPrediction.png](https://bitbucket.org/repo/LpbXRr/images/2109473631-AvalabilityPrediction.png)

Future prediction for number of trips based on month, type of day(weekday/weekend), temp, rain etc.

![FutureDemandPrediction.png](https://bitbucket.org/repo/LpbXRr/images/999112961-FutureDemandPrediction.png)


Dashboard 

![Dashoboard.png](https://bitbucket.org/repo/LpbXRr/images/2119886499-Dashoboard.png)

Data Visualization Weekday

![dataVisualization.jpg](https://bitbucket.org/repo/LpbXRr/images/960626874-dataVisualization.jpg)

Data Visualization Weekend
![dataVisualizationWeekend.jpg](https://bitbucket.org/repo/LpbXRr/images/2669415847-dataVisualizationWeekend.jpg)


**Team**

* Mukul Ambulgekar
* Akshay Jarandikar
* Swati Mittal