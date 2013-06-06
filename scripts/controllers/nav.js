angular.module('App')

// This one is just to enable mobile-navigate
.controller('NavController', function($scope, $rootScope, $location, $navigate) {

$scope.navigate = $navigate


})
