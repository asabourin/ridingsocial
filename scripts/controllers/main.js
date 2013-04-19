'use strict';

angular.module('App')
  .controller('MainController', function(Geolocation, localStorageService, Rider, $scope, $rootScope) {
    
    var intervalGeo = setInterval(function () {
        Geolocation.getCurrentPosition(function (position) {
          $scope.position = position;
        });
    }, 5000);
  
    $scope.$on('$destroy', function () {
        clearInterval(intervalGeo);
    });

})