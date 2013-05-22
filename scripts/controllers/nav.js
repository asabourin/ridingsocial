angular.module('App')

.controller('NavController', function($scope, $rootScope, $location) {

  $scope.goToTab = function(tab) {
    $rootScope.activeTab = tab;
  }

})
