angular.module('App')

.controller('NavController', function($scope, $rootScope, $location) {

  $scope.location = $location
  $scope.activeTab = 'nearby';

  $scope.goToTab = function(tab) {
    $scope.activeTab = tab;
    $location.path('/'+tab)
  }

})
