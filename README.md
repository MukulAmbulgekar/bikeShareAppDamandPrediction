# README #

This is android app for bay area bike share analysis (Real Time and Historical).
Also we are going to implement demand prediction based on historical data.

### What is this repository for? ###

*  Find nearby bike stations (within 0.5 miles) and their avalability
*  Get real time status of available Bikes/Docks
*  Get weather information
*  Search places on google maps to get bike status status

### How do I get set up? ###

* Set up Cordova - https://cordova.apache.org/docs/en/latest/guide/cli/

* Install geolocation plugin (to get device location ) - **cordova plugin add cordova-plugin-geolocation**

* Install google maps plugin (to show bike stations on map) -** cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID='Your Google API Key'**

* After set up, clone this project directory and build  run - **cordova build
 cordova run --device**  (or emulator if you are running on android emulator)


**Team**

* Mukul Ambulgekar
* Akshay Jarandikar
* Swati Mittal