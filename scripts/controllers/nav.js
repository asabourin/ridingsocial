angular.module('App')

.controller('HeaderController', function($scope, $rootScope, $location) {

  $scope.logout = function () {
      logout()
  };

    function logout() {
      $rootScope.fb_connected = false
      $rootScope.logged = false;
      localStorage.clear()
      $location.path('/');
      $scope.loading =false
      $scope.showFacebook = true
      clearInterval(watchPosition);
  }

})

.controller('NavController', function($scope, $rootScope, $location) {

  $scope.location = $location
  $scope.activeTab = 'nearby';

  $scope.goToTab = function(tab) {
    $scope.activeTab = tab;
    $location.path('/'+tab)
  }

})
