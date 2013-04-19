'use strict';

angular.module('App')
  .controller('MainController', function(Geolocation, CordovaReady, localStorageService, Riders, Spots, $scope, $rootScope, $timeout) {

    var watchPosition = $timeout(function() {
        Geolocation.getCurrentPosition(function (position) {
          $scope.position = position;

          Spots.nearby(position.coords.latitude, position.coords.longitude, Settings.coeff, Settings.radius, function(response) {
            $scope.spots = response
          })

        });     
    }, 1000);

    $scope.$on('$destroy', function () {
        $timeout.cancel(watchPosition)
    });

    var rider = JSON.parse(localStorageService.get('rider'));

    Riders.me(rider.token, function(response) {
        $scope.rider = response
    })


})