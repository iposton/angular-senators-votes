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

//mainContainerCtrl.js
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

When ng-repeat parses the vote array you can use ng-init to run a function as many times as the length of the vote array. Passing in a single vote to the function so that you can get the results for that function from the api. The function `voteResults(v)` takes the vote and gets voting results with `v.vote_uri` as the endpoint. The results are pushed to a custom array called `self.resultsArray` which is then rendered with another ng-repeat. Keep the results inline with the votes array by checking they have the same roll_call number which is the vote id essentially `ng-if="r.roll_call === v.roll_call"`.

```html

<!-- content.html -->
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

//contentCtrl.js
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
### Change css style dynamically 
I want to use a css style according to a property value of the senator data. I want to have a blue gradient over the image of a senator belonging to the democratic party and have a red gradient over a picture of a senator belonging to the republican party. I use `ng-class` to add a class depending on a senator's party. Then I to create an overlay over a background image which I need to render from the css style. The background image has a dynamic property concatenated inside the string of the url attribute. So I needed to find a way to get the `{{selected.id}}` value into a style tag to make sure the correct url got the correct overlay color according to the senator's party. I created a custom directive to parse the data inside style tags at the top of the html document.

```js

//A CUSTOM DIRECTIVE FOR USING INLINE CSS ACCORDING
//TO DYNAMIC {{data}} AND NG-CLASS
angular
 .module("app")
 .directive('parseStyle', function($interpolate) {
  return function(scope, elem) {
      var exp = $interpolate(elem.html()),
          watchFunc = function() {
              return exp(scope);
          };

      scope.$watch(watchFunc, function(html) {
          elem.html(html);
      });
  };
});

``` 

```html

<!-- content.html -->
<!-- NG-CLASS WILL APPLY A CLASS ACCORDING 
TO THE PARTY OF SELECTED SENATOR -->
<div ng-class="{'repub': vm.selected.party === 'R', 'demo': vm.selected.party === 'D'}">

  <!-- PARSE STYLE DIRECTIVE IS INSTERED IN THE STYLE TAG
  THEN THE CSS CAN PARSE ANGULAR STRING DATA {{selected.id}}
  THIS WILL GET THE CORRECT URL FOR THE BACKGROUND ATTRIBUTE ACCORDING TO NG-CLASS -->
  <style parse-style>
  md-content.repub .img-box {
      background: linear-gradient(rgba(231, 76, 60, 0.3), rgba(231, 76, 60, 0.3)),
      url(assets/img/senators/{{selected.id}}.jpg);
  }

  md-content.demo .img-box {
      background: linear-gradient(rgba(52, 152, 219, 0.3), rgba(52, 152, 219, 0.3)),
      url(assets/img/senators/{{selected.id}}.jpg);
  }
  </style>

  <!-- THE BACKGROUND STYLE WORKS INSIDE THIS DIV -->
  <div class="img-box"></div>

  <h2>{{selected.first_name + " " + selected.last_name + "("+selected.party+"-"+selected.state+")"}}</h2>

</div>

```

### Setup Angular-Material's md-datepicker
When I ask the congress api for a senator's vote history it returns 100 objects which is a lot of content to scroll through. Showing the votes by a selected date would be a better user experience. You can allow a user to select a date by using an amazing date-picker feature built into the angular-material library. 

In this project I am using the most up-to-date version of angular-material which is basically a library of css and javascript that works well with angular.js apps to help give them a clean look and responsive design. `bower install angular-material --save` and link the css library and js library in index.html and add `'ngMaterial'` to the app module. 

```html

<!-- index.html -->
<link rel="stylesheet" href="bower_components/angular-material/angular-material.css" />
<script src="bower_components/angular-material/angular-material.js"></script>

```

```js

//app.js
angular.module('app', ['ngMaterial']);

```

Setting up the date picker is easy to do. Just add the angular-material directive in the html file to activate the date picker feature. 

```html

<!-- content.html -->

<md-datepicker ng-model="dateObj.myDate" md-placeholder="Enter date" md-min-date="vm.minDate" md-max-date="vm.maxDate"></md-datepicker>

```

In this example I defined ng-model with a value and I set a minimum date and maximum date to avoid allowing a user to select a date outside that limit. This date picker directive is basically an input that takes a date value when I a user either selects it or types it in. I want my date picker to show todays date as soon as the page loads and I do this by attaching todays date to the ng-model of the date-picker.

```js

//contentCtrl.js
//DEFINE CURRENT DATE AND OBJECT FOR MD-DATEPICKER'S NG-MODEL
var nd = new Date();

$scope.dateObj = {
    myDate: nd
}

//DEFINE MIN DATE AND MAX DATE
self.minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 2,
    new Date().getDate()
);

self.maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
);

```

For this project I need the value of the selected date to be the same date attached to the vote object so that this app will show vote results that happened on the selected date. I attached a watch method to scope (`$scope.$watch`) to capture the value of the selected date then I format it to match the way the date is formatted in the vote object. I can use a ng-if condition to show results matching the selected date in the html. If `ng-if="v.date === vm.date"` is true then it will show the selected date vote results. 

```js

//contentCtrl.js

//WATCH THE MD-DATEPICKER SELECTED DATE
//BY PASSING IN THE dateObj 
//TO GET THE newVal,myDate WHEN IT CHANGES 
$scope.$watch('dateObj', function(newVal, oldVal) {
    if (!newVal.myDate) {
        return false;
    }
    //FORMAT SELECTED DATE FOR NG-IF CONDITION TO 
    //SHOW VOTING DATA WITH THE SAME DATE
    self.date = $filter('date')(new Date(newVal.myDate), "yyyy-MM-dd");
}, true);

```

```html

<!-- content.html -->
<md-card ng-repeat="v in votes" ng-init="vm.selectVotes(v); vm.voteResults(v)" ng-if="v.date === vm.date">            
  <div ng-repeat="r in vm.resultsArr">
    <p ng-if="r.roll_call === v.roll_call">{{r.description}}
    <br>{{selected.first_name + " " + selected.last_name}} Voted {{v.position}} {{v.question}}</p>
  <div class="results" ng-if="r.roll_call === v.roll_call">
    <p><b>{{r.result}}</b>
    <br> Total Vote: Yes = No = {{r.total.no}}
    <br> Democrat Vote: Yes = {{r.democratic.yes}} No = {{r.democratic.no}} 
    <br> Republican Vote: Yes = {{r.republican.yes}} No = {{r.republican.no}} 
    <br></p>
  </div>
</md-card>

```

### Use angular-chart.js for data visuals
In this project I want to show the congress data in a pie chart to show another way to display data to the public to make the ui more interesting or add something unique rather than showing text. [Angular-chart.js](https://jtblin.github.io/angular-chart.js/) has some cool options to choose from if you want to spice up your data in the form of beautiful data visuals. `bower install angular-chart.js chart.js --save` and add the script tags to index.html and add `'chart.js'` to the app module.

```html

<!-- index.html -->
<script src="bower_components/chart.js/dist/Chart.min.js"></script>
<script src="bower_components/angular-chart.js/dist/angular-chart.js"></script>

```

```js

//app.js
angular.module('app', ['chart.js']);

```

First I want to define the settings of the pie chart in the controller. In the pie chart I want to show the amount of No's and Yes's for each bill voted on depending on which party the senators belong to. I will have to setup the info in the labels, add some animation, and display a title that describes the pie chart. 

```js

//contentCtrl.js
var self = this;

// PIE CHART SETTINGS
self.labels = ["D (Yes)", "R (Yes)", "D (No)", "R (No)", "Not Voting"];
self.options = {
  rotation: 0.5 * Math.PI,
  title: {
      display: true,
      text: 'Vote Results By Party',
      fontColor: 'rgba(0,0,0,0.4)',
      fontSize: 16
  },
  legend: {
      display: true
  }
}

```

Angular-chart.js uses `<canvas></canvas>` to render the chart in the html. And then bind the data and settings to the canvas tag. 

```html

<!-- content.html -->
<md-card ng-repeat="v in votes" ng-init="vm.selectVotes(v); vm.voteResults(v)" ng-if="v.date === vm.date">            
  <div ng-repeat="r in vm.resultsArr">
    <p ng-if="r.roll_call === v.roll_call">{{r.description}}
    <br>{{selected.first_name + " " + selected.last_name}} Voted {{v.position}} {{v.question}}</p>
  <div class="results" ng-if="r.roll_call === v.roll_call">
    <p><b>{{r.result}}</b>
    <br> Total Vote: Yes = No = {{r.total.no}}
    <br></p>
    <div ng-if="r.roll_call === v.roll_call">
      <canvas id="pie" class="chart chart-pie" chart-data="[(r.democratic.yes | num),(r.republican.yes | num),(r.democratic.no | num),(r.republican.no | num),(r.total.not_voting | num)]" chart-labels="vm.labels" chart-options="vm.options" style="height:80px; width: 280px;"></canvas>
    </div> 
  </div>
</md-card>

```

The chart-data directive excepts data in number format and the congress data is a string so I use a custom filter called num (`(r.democratic.yes | num)`) to covert the string data to a number. 

```js

//app.js
//A CUSTOM FILTER FOR CONVERTING STRINGS TO NUMBERS
angular
 .module("app")
   .filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };

```

### Heroku Deploy 
After you <code>git push</code> to your repo follow the steps below. Assuming you have a heroku account and installed the heroku toolbelt. 
<ol>
  <li>run <code>heroku log in</code></li>
  <li>run <code>heroku create name-of-app</code></li>
  <li>run <code>git push heroku master</code></li>
  <li>If deploy successful run <code>heroku open</code></li>
  If there were problems during deploy and you are trying this from scratch here are some requirements heroku needs to deploy.
  <li>have all the client js modules in bower.json and in the json file have this line <code>"resolutions": {
    "angular": "^1.5.8"
  }</code> below dependencies.</li>
  <li>make a Procfile and have this line <code>web: node server.js</code></li>
  <li>make a server.js file in root and heroku needs this line <code>var port = process.env.PORT || 8082;</code> to set the port.</li>
</ol>

Adding the environment variable for the propublica-congress-api key. I didn't want to share my api key in my repo so I added env var for heroku to use. I stored the key in my heroku app by going to the app settings in my heroku dashboard. Click on Config Variables and add the key (name) and value (api key) there. It will be secured safely away from human view. You can call it to the client side by adding this code to the server.js file. I called my env var API_KEY and made the value the propublica congress api key. 


```js

//server.js 
// for heroku config vars
app.get('/config.js', function(req, res){
       res.write("var API_KEY='"+process.env.API_KEY+"'" + '\n');
       res.end();
});


```


