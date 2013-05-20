angular.module('App')

.controller('HeaderController', function($scope, $rootScope, $location, User) {

  $rootScope.$on('gotMe', function(event, args) {
    $scope.picture = User.picture()
  })

  $scope.logout = function () {
      logout()
  };

    function logout() {
      User.logout()
      $rootScope.fb_connected = false
      $location.path('/');
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
