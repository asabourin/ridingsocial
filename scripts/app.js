'use strict';

var Settings = {

  host: 'http://freesab.local:3000/api/'

}

angular.module('Services', []);

angular.module('App', ['Services', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
