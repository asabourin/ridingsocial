angular.module('App')

.controller('HeaderController', function($scope, $rootScope, $location) {

  $rootScope.$on('gotMe', function(event, args) {
    $scope.me = args.user
    console.log(args.user.picture)
  })

  $scope.logout = function () {
      logout()
  };

    function logout() {
      localStorage.clear()
      $rootScope.fb_connected = false
      $rootScope.logged = false;
      $location.path('/');
      $scope.loading =false
      $scope.showFacebook = true
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
