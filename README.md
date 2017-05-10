# Angular 1.x, ProPublica API and Heroku - <a href="https://senators-votes.herokuapp.com/">Demo</a> <a href="https://codeclimate.com/github/iposton/angular-senators-votes"><img src="https://codeclimate.com/github/iposton/angular-senators-votes/badges/gpa.svg" /></a>
This is a single page app which uses the [ProPublica Congress API](https://www.propublica.org/datastore/api/propublica-congress-api) to get up to date voting results of all the state senators. 

### Description
This [application](https://senators-votes.herokuapp.com/) is made with angular.js (version 1.5.8) and the most current version of angular-material. This SPA app is hosted for free on Heroku (cloud application platform). The data is sourced through the [propublica-congress-api](https://www.propublica.org/datastore/api/propublica-congress-api).

This app can help explain how to fetch data using [Angular's $http](https://docs.angularjs.org/api/ng/service/$http) service from a robust api and then use data-visualization libraries (angular-chart.js) to present the returned results.  

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
The first thing I want to do in this app is get a list of all the state senators in congress. I used the [ProPublica api docs](https://propublica.github.io/congress-api-docs/#members) to find the correct endpoint to get all senators. I am able to use Angular's $http service to send a GET request for data using this endpoint `https://api.propublica.org/congress/v1/115/senate/members.json` found in the api's documentation. The $http service is a great service provided by Angular. The alternative to $http is using a node.js server to send a get request which I found to be a difficult way to get and render data on the front end. 

```js

//You will need to submit a request for an 
//api key at https://www.propublica.org/datastore/api/propublica-congress-api 
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
This is a breakdown of the above code. The $http service requires me to define what kind of http method this is in this case it's a GET request. Then I must define the endpoint (url) in where to send this get request to. ProPublica requires the api key to be sent with the headers option and it must be exactly like this `'X-API-KEY': 'fakekey123xcvbnm123456999'` in order to get data sent back to my app. If the $http service gets the data successfully from the api `then()`  is called and the promise is fulfilled and the data is past in as a response (response = data object). If the $http service can not get the data back from the api the code will throw an error. To access the senator property inside the response object that came back from the api I logged the object to the js console in chrome. This console log helped me find the array of senators `console.log(response.data.results[0].members)`, now I can see the array of senators in the js console of the chrome browser. This code means `response.data.results[0].members` in the response object there is a data object in the data object there is a results object in the results object there is an array with a key of members which is the array of senator objects and that is what I want ng-repeat to iterate over in the html. This array is then defined to a varibale called `self.senators` so it can be rendered in the html with ng-repeat as `vm.senators`. 

```html

<!-- main-container.html -->

<ul ng-repeat="s in vm.senators">
  <!-- construct a string to show some of the values from the keys found in vm.senators -->
  <li>{{s.first_name + ' ' + s.last_name + "("+s.party+"-"+s.state+")"}}</li>
</ul>

```

To have a better look of the data object in this case `vm.senators` use the `<pre>` tag in the html file. 

```html

 <pre>
    {{vm.senators | json}}
 </pre>

```

### Use ng-init with ng-repeat to run multiple functions
In this app I need to get all the bills voted on and the voting results of each bill that each state senator has voted on since the start of 2017. With this api first I get a senator by id and pass that into the endpoint that will return all the bills that this senator voted on. 

```js

//mainContainerCtrl

var self = this;

// Set global
self.selected = null;

// Define functions
self.selectSenator = selectSenator;
self.getVotes = getVotes;

//Attach ng-click to the html list of senators and pass a selected senator
//into the function to get a specific id from a senator
//Then call the getVotes function
function selectSenator(senator) {
    self.selected = senator;
    self.getVotes();
}

function getVotes() {
    $http({
        method: 'get',
        url: 'https://api.propublica.org/congress/v1/members/' + self.selected.id + '/votes.json',
        headers: { 'X-API-KEY': 'fakekey123xcvbnm123456999' }
    }).then(function(response) {
        console.log(response.data.results[0].votes, ' votes');
        self.votes = response.data.results[0].votes;

    }).catch(function(error) {
        console.error("Error with GET request", error);
    })
}

```

```html

<!-- main-container.html -->

<ul ng-repeat="s in vm.senators">
  <!-- construct a string to show some of the values from the keys found in vm.senators -->
  <li><a ng-click="vm.selectSenator(s)">{{s.first_name + ' ' + s.last_name + "("+s.party+"-"+s.state+")"}}</a></li>
</ul>

```
Now that I defined selected I can access the selected id with `self.selected.id`. To get votes the ProPublica endpoint requires the id of the senator. I can use the variable `self.selected.id` and concatenate it into the endpoint when the getVotes function is called. The endpoint will look like this `'https://api.propublica.org/congress/v1/members/' + self.selected.id + '/votes.json'`. The response will have the bills voted on here `response.data.results[0].votes`. This array is then defined to a variable called `self.votes` so it can be rendered in the html with ng-repeat as `vm.votes`.

When ng-repeat parses the vote array you can use ng-init to run a function as many times as the length of the vote array. Passing in a single vote to the function so that you can get the results for that function from the api. The function `voteResults(v)` takes the vote and gets voting results with `v.vote_uri` as the endpoint. The results are pushed to a custom array called `self.resultsArray` which is then rendered with another ng-repeat. Keep the results inline with the votes array by checking the have the same roll_call number which is the vote id essentially `ng-if="r.roll_call === v.roll_call"`.

```html

<div ng-repeat="v in votes" ng-init="vm.voteResults(v)">
<div ng-repeat="r in vm.resultsArr">
  <p ng-if="r.roll_call === v.roll_call">
      {{r.description}}<br>
      {{selected.first_name + " " + selected.last_name}} Voted {{v.position}} {{v.question}}<br>
      <b>{{r.result}}</b>
      <br> Total Vote: Yes = <span class="y">{{r.total.yes}}</span> No = <span class="n">{{r.total.no}}</span> 
      <br> Democrat Vote: No = {{r.democratic.no}} Yes = {{r.democratic.yes}}
      <br> Republican Vote: No = {{r.republican.no}} Yes = {{r.republican.yes}}
  </p>
</div>
</div>

```

```js

//THIS FUNCTION GETS CALLED AS MANY TIMES
//AS THE LENGTH OF THE SELF.VOTES ARRAY
//WITH NG-REPEAT AND NG-INIT
function voteResults(v) {
  self.resultsArr = [];
  //DEFINE VOTE URI WITH ENDPOINT FOR RESULTS
  var voteUri = v.vote_uri;
  $http({
      method: 'get',
      url: voteUri,
      headers: { 'X-API-KEY': API_KEY }
  }).then(function(response) {
      self.results = response.data.results.votes.vote;
      //AS NG-REPEAT ITTERATES OVER THE VOTE ARRAY 
      //PUSH RESULTS TO RESULTS ARRAY
      self.resultsArr.push(self.results);
      console.log(self.resultsArr, "results array");

  }).catch(function(error) {
      console.error("Error with GET request", error);

  })

}

``` 


