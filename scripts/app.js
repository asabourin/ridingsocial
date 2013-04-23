'use strict';

var Settings = {

  host: 'http://freesab.local:3000/api/',
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
  })
  .directive('ngTouch', function () {

        return function ($scope, $element, $attrs) {
            $element.bind('click', function () {
                $scope.$apply($attrs['ngTouch']);
            });
        };
    })
