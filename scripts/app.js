'use strict';

var Settings = {

  host: 'http://freesab.local:3000/api/'

}

angular.module('app.services', []);

angular.module('app', ['app.services', 'LocalStorageModule'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
