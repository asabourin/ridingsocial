angular.module('App')
  
  .controller('RidersController', function(localStorageService, Riders, $scope, $routeParams, $rootScope, $timeout, $location) {

    Riders.show($routeParams.id, function(response) {
        $scope.rider = response;
      }
      )

  })
