'use strict';

var Settings = {

  host: 'http://localhost:3000/api/',
  coeff: 0.01,
  radius: 15

}

angular.module('Services', []);

angular.module('App', ['Services', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartController'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
