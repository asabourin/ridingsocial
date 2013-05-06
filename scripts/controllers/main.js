angular.module('App')

.controller('MainController', function(Geolocation, CordovaReady, localStorageService, Riders, Spots, Checkins, $scope, $rootScope, $timeout, $location) {

  var user = JSON.parse(localStorageService.get('user'));

  if(user != undefined) {

    Riders.me(user.token, function(response) {
        $rootScope.logged = true;
        $rootScope.user = response
        $rootScope.user.token = user.token
        $location.path('/spots');
      },
      function(response) {
          alert(response.error)
          localStorageService.remove('user')
          $location.path('/');
      })

       // Button functions
      $scope.logout = function () {
            $rootScope.logged = false;
          localStorageService.clearAll()
          $location.path('/');
      };
  }

  //
})



