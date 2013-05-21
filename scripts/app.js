'use strict';

angular.module('Services', []);

angular.module('App', ['Services', 'ui.bootstrap'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'MainController'
      })
      .when('/nearby', {
        templateUrl: 'views/spots/nearby.html',
        controller: 'Spots.nearby'
      })
      .when('/map', {
        templateUrl: 'views/spots/map.html',
        controller: 'Spots.map'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'Sessions.followed'
      })
      .when('/checkin', {
        templateUrl: 'views/checkins/new.html',
        controller: 'Checkin'
      })
      .when('/riders/:id', {
        templateUrl: 'views/riders/show.html',
        controller: 'RidersController'
      })
      .when('/spots/:id', {
        templateUrl: 'views/spot.html',
        controller: 'Spots.show'
      })
      .when('/sessions/:id', {
        templateUrl: 'views/session.html',
        controller: 'SessionsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

// Hiding splashscreen after Cordova fires deviceready. Timeout needed because of white flash
document.addEventListener('deviceready', function () {
  setTimeout(function() {
        navigator.splashscreen.hide();
    }, 600)
  document.addEventListener("backbutton", onBackKeyDown, false);
}, false)

function onBackKeyDown() {
  
}

//For external callbacks that need to access Angular app
var injector;
angular.element(document).ready(function() {
  injector = angular.bootstrap(document, ['App']);
});