angular.module('App')

.controller('MainController', function(localStorageService, Riders, $scope, $rootScope, $location) {

  var user = JSON.parse(localStorageService.get('user'));

  if(user != undefined) {

    Riders.me(user.token, function(response) {
        $rootScope.logged = true;
        $rootScope.me = response
        $rootScope.user = user
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



