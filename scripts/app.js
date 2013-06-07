'use strict';

angular.module('Services', []);

angular.module('App', ['Services', 'ui.bootstrap', 'google-maps', 'ajoslin.mobile-navigate'])

  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartController'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/checkin', {
        templateUrl: 'views/checkin.html',
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
      })
  })
  .run(function($templateCache,$http){
      $http.get('views/main.html', {cache:$templateCache});
      $http.get('views/checkin.html', {cache:$templateCache});
});



// Hiding splashscreen after Cordova fires deviceready. Timeout needed because of white flash
document.addEventListener('deviceready', function () {
  setTimeout(function() {
        navigator.splashscreen.hide();
    }, 500)
}, false)

//For external callbacks that need to access Angular app
var injector;
angular.element(document).ready(function() {
  injector = angular.bootstrap(document, ['App']);
});