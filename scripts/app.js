'use strict';

var Settings = {

  host: 'http://freesab.local:3000/api/',
  coeff: 0.01,
  radius: 15

}

angular.module('Services', []);

angular.module('App', ['Services', 'LocalStorageModule'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartController'
      })
      .when('/spots', {
        templateUrl: 'views/spots.html',
        controller: 'SpotsController'
      })
      .when('/riders/:id', {
        templateUrl: 'views/riders/show.html',
        controller: 'RidersController'
      })
      .when('/spots/:id', {
        templateUrl: 'views/spot.html',
        controller: 'SpotsController'
      })
      .when('/checkins/:id', {
        templateUrl: 'views/checkin.html',
        controller: 'CheckinsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .directive('ngTouch', function () {

        return function ($scope, $element, $attrs) {
            $element.bind('click', function () {
                $scope.$apply($attrs['ngTouch']);
            });
        };
    })


