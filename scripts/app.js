'use strict';

var Settings = {

  host: 'http://freesab.local:3000/api/',
  coeff: 0.01,
  radius: 15,
  checkin_distance: 12,
  android_gcm_senderID: "535845696743"

}

var Lang = {
  en: {
    'checkin_successful': 'Check-in successful!',
    'error_checkin': 'Oops...'
  }
}

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
      .when('/checkins/:id', {
        templateUrl: 'views/checkin.html',
        controller: 'CheckinsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

document.addEventListener('deviceready', function () {
  setTimeout(function() {
        navigator.splashscreen.hide();
    }, 600)
}, false)