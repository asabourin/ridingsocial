angular.module('App')
  
  .controller('RidersController', function(Riders, $scope, $routeParams) {

    Riders.show($routeParams.id, function(response) {
        $scope.rider = response;
    })

  })
