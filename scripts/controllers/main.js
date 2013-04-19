'use strict';

angular.module('App')
  .controller('MainController', function(Geolocation, CordovaReady, localStorageService, Riders, $scope, $rootScope, $timeout) {
    
  
    $scope.$on('$destroy', function () {
        $timeout.cancel(watchPosition)
    });

    var watchPosition = $timeout(function() {
        Geolocation.getCurrentPosition(function (position) {
          $scope.position = position;
        });     
    }, 1000);

    var rider = JSON.parse(localStorageService.get('rider'));


    Riders.me(rider.token, function(response) {
        $scope.response = response
    })


})