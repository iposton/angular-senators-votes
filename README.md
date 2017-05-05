# Angular 1.x, ProPublica API and Heroku - <a href="https://senators-votes.herokuapp.com/">Demo</a> <a href="https://codeclimate.com/github/iposton/angular-senators-votes"><img src="https://codeclimate.com/github/iposton/angular-senators-votes/badges/gpa.svg" /></a>
This is a single page app which uses the propublica-congress-api to get up to date voting results of all the state senators. 

### Description
This [application](https://senators-votes.herokuapp.com/) is made with angular.js (version 1.5.8) and the most current version of angular-material. This SPA app is hosted for free on Heroku (cloud application platform). The data is sourced through the [propublica-congress-api](https://www.propublica.org/datastore/api/propublica-congress-api).

This app can help explain how to fetch data using [Angular's $http](https://docs.angularjs.org/api/ng/service/$http) service from a robust api and then use data-visiualization libraries (angular-chart.js) to present the the returned results.  

### You can learn this
* Use the $http service to connect to an api and get data returned in miliseconds. 
* Use ng-repeat with ng-init to make several calls for results for items happening on the same date.
* Make css alterations according to dynamic data properties using a custom filter.    
* How to setup [angular-material's md-datepicker](https://material.angularjs.org/latest/api/directive/mdDatepicker) and use it to fetch data according to the date selected.
* Plug data into an angular-chart.js directive to create beautiful animated data visulization.    

This app is for beginners to make an app and host it for free so that the app is able to be shared with the world. It's fun! 

### Software used for this application
* Angular.js (version 1.5.8) 
* Node.js (version 6.0.0)     
* [angular-material](version master)
* [angular-chart.js](https://jtblin.github.io/angular-chart.js/) (1.1.1)
* chart.js (2.5.0)
* Heroku [Set up a free account ](https://www.heroku.com/)
* [ProPublica Congress API](https://www.propublica.org/datastore/api/propublica-congress-api)