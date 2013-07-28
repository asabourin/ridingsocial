'use strict';

angular.module('Services', []);

angular.module('App', ['Services', 'ui.bootstrap', 'google-maps', 'ajoslin.mobile-navigate'])

  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        controller: 'StartController'
      })
      .when('/start', {
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
        templateUrl: 'views/rider.html',
        controller: 'Riders.show'
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
      $http.get('views/rider.html', {cache:$templateCache});
});

//For external callbacks that need to access Angular app
var injector;
angular.element(document).ready(function() {
  injector = angular.bootstrap(document, ['App']);
});

//Fastclick
angular.module('App').directive("ngTap", function() {
  return function($scope, $element, $attributes) {
    var tapped = false;
    $element.bind("touchstart", function(event) {
      return tapped = true;
    });
    $element.bind("touchmove", function(event) {
      tapped = false;
      return event.stopImmediatePropagation();
    });
    return $element.bind("touchend", function() {
      if (tapped) {
        return $scope.$apply($attributes["ngTap"]);
      }
    })
  }
})

// Timeago filter using Moment.js
angular.module('App').filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  }
});

// Forward app resumed event to angular
document.addEventListener("resume", function() {
  var scope = angular.element(document).scope();
  scope.$apply(scope.$broadcast('appResumed'));
}, false);