# Angular 1.x, ProPublica API and Heroku - <a href="https://senators-votes.herokuapp.com/">Demo</a> <a href="https://codeclimate.com/github/iposton/angular-senators-votes"><img src="https://codeclimate.com/github/iposton/angular-senators-votes/badges/gpa.svg" /></a>
This is a single page app which uses the propublica-congress-api to get up to date voting results of all the state senators. 

### Description
This [application](https://senators-votes.herokuapp.com/) is made with angular.js (version 1.5.8) and the most current version of angular-material. This SPA app is hosted for free on Heroku (cloud application platform). The data is sourced through the [propublica-congress-api](https://www.propublica.org/datastore/api/propublica-congress-api).

This app can help explain how to fetch data using [Angular's $http](https://docs.angularjs.org/api/ng/service/$http) service from a robust api and then use data-visualization libraries (angular-chart.js) to present the the returned results.  

### You can learn this
* Use the $http service to connect to an api and get data returned in milliseconds. 
* Use ng-repeat with ng-init to make several calls for results for items happening on the same date.
* Make css alterations according to dynamic data properties using a custom filter.    
* How to setup [angular-material's md-datepicker](https://material.angularjs.org/latest/api/directive/mdDatepicker) and use it to fetch data according to the date selected.
* Plug data into an angular-chart.js directive to create beautiful animated data-visualization.    

### Software used for this application
* Angular.js (version 1.5.8) 
* Node.js (version 6.0.0)     
* [angular-material](https://github.com/angular/material/tree/v1.1.4) (version master)
* [angular-chart.js](https://jtblin.github.io/angular-chart.js/) (1.1.1)
* chart.js (2.5.0)
* Heroku [Set up a free account ](https://www.heroku.com/)
* [ProPublica Congress API](https://www.propublica.org/datastore/api/propublica-congress-api)

### Clone and serve this app
* First you will need a ProPublica Congress Api Key in order to hit the ProPublica endpoint to get it to return data.
* REQUEST AN API KEY at this link [https://www.propublica.org/datastore/api/propublica-congress-api](https://www.propublica.org/datastore/api/propublica-congress-api). You have to submit your name and email to get a key sent to your email. I intend to use this for a... choose the personal option.
* It might take 24 hours to get an api key. The api key is used in two places in this code base. `maincontainer-directive.js` and in `content-directive.js`. See <b>Get data from api with $http</b> below. 
* When the api keys are in place clone this repo and run <code>npm install</code> and <code>bower install</code> then run <code>npm start</code> to serve the app on `localhost:8082`.

### Get data from api with $http
The first thing I want to do in this app is get a list of all the state senators in congress that vote on bills. I used the [ProPublica api docs](https://propublica.github.io/congress-api-docs/#members) to find the correct endpoint to get all senators and their special id to get their voting history. I am able to use Angular's $http service to get send a GET request for data using this endpoint `https://api.propublica.org/congress/v1/115/senate/members.json` found in the api document. The $http service is a great service provided by Angular the alternative to this is using a node.js server to send a get request which I found very complicated and a much harder way to get and render data from an api. 

```js

function mainContainerCtrl($http) {

    var self = this;

    $http({
        method: 'get',
        url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
        headers: { 'X-API-KEY': 'fakekey123xcvbnm123456999' }
    }).then(function(response) {
        //Get data from the response and print it to the console.
        console.log(response.data.results[0].members, ' members');
        //Define the array of data for ng-repeat in the html
        self.senators = response.data.results[0].members;
    }).catch(function(error) {
        //If error throw error
        console.error("Error with GET request", error);
    })

}

``` 
This is a breakdown of the above code. The $http service requires me to define what kind of http method this is in this case it's a GET request. Then I must define the endpoint (url) in where to send this get request to. ProPublica requires the api key to be sent with the headers option and it must be exactly like this `'X-API-KEY': 'fakekey123xcvbnm123456999'` in order to get data sent back to my app. When the $http options get the data then the data comes back as a param called response. I had to dig into the response to get the data I was looking for which is an array of all the 100 state senators. The array is then defined so it can be rendered in the html with ng-repeat. 

```html

<!-- main-container.html -->

<ul ng-repeat="s in vm.senators">
  <!-- comstruct a string to show some of the values from the keys found in vm.senators -->
  <li>{{s.first_name + ' ' + s.last_name + "("+s.party+"-"+s.state+")"}}</li>
</ul>

```