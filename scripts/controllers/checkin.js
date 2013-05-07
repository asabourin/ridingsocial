angular.module('App')

.controller('Checkin', function(localStorageService, Geolocation, Facebook, User, $scope, $rootScope, $location) {

    var user = JSON.parse(localStorageService.get('user'));
    $scope.spot = JSON.parse(localStorageService.get('nearestSpot'));

})