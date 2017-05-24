 angular.module('MyApp', ['ngMaterial', 'main', 'drop-ng', 'ngMessages', 'chart.js'])
     .config(function($mdIconProvider, $mdThemingProvider) {

         $mdIconProvider.icon('share', '../assets/svg/share.svg', 24)
             .icon("menu", "../assets/svg/menu.svg", 24)
             .icon("google_plus", "../assets/svg/google-plus-box.svg", 24)
             .icon("twitter", "../assets/svg/twitter-box.svg", 24)
             .icon("facebook", "../assets/svg/facebook-box.svg", 24)
             .icon("thumbsup", "../assets/svg/thumb-up.svg", 24)
             .icon("thumbsdown", "../assets/svg/thumb-down.svg", 24)
             .icon("close", "../assets/svg/close.svg", 24)
             .icon("comment", "../assets/svg/comment-text.svg", 24);

         $mdThemingProvider.theme('default')
             .primaryPalette('blue')
             .accentPalette('red');


     }).filter('num', function() {
         return function(input) {
             return parseInt(input, 10);
         };
     }) // Optional configuration
     .config(['ChartJsProvider', function(ChartJsProvider) {
         // Configure all charts
         // ChartJsProvider.setOptions({
         //   chartColors: ['#85c1e9', '#eb6f62', '#447393', '#aa4940', '#DCDCDC']
         // });



     }]);
