'use strict';

var Settings = {

  //host: 'http://www.ridingsocial.net/api/',
  host: 'http://freesab.local:3000/api/',
  coeff: 0.01,
  radius: 15,
  checkin_distance: 12

}

angular.module('Services', []);

angular.module('App', ['Services', 'LocalStorageModule', 'ui.bootstrap'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'MainController'
      })
      .when('/spots', {
        templateUrl: 'views/spots.html',
        controller: 'Spots.nearby'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'Sessions.followed'
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
            $element.bind('touchend', function () {
                $scope.$apply($attrs['ngTouch']);
            });
        };
    })


