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

![Mobile Application]  (https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app1.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app2.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app3.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app4.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app5.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app6.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app7.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app8.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app9.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app10.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app11.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app12.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app13.jpg)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app14.png)
![Mobile Application]
(https://raw.githubusercontent.com/MukulAmbulgekar/bikeShareAppDamandPrediction/master/bikeshareScreenshots/app15.png)


