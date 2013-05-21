angular.module('App')

.controller('StartController', function(Push, Facebook, User, $scope, $rootScope, $location) {


  // Init

  $rootScope.showNav = false;


  if(User.isLogged()) {
     $rootScope.$broadcast('rs_connected', {response:User.getUser()});
  }
  else{
    Facebook.init()
    $scope.loading =false
    $scope.showFacebook = true
  }

  // Events

  $rootScope.$on("fb_connected", function (event, args) {

    User.login(args.response.authResponse.accessToken, function(response) {
      $rootScope.$broadcast('rs_connected', {response:response});
    }),
    function(response) {
      console.log(response)
      $scope.loading =false
      $scope.showFacebook = true
    }

  });

  $rootScope.$on("fb_login_failed", function (event, args) {
    console.log(args.response)
    $scope.loading =false
    $scope.showFacebook = true
  });

  $rootScope.$on("rs_login_failed", function(event, args) {
    console.log(args.response.error)
    User.logout()
    $scope.loading =false
    $scope.showFacebook = true
  })
  
  // Button functions

  $scope.login = function () {
      $scope.showFacebook = false
      $scope.loading = true
      Facebook.login();
  };

})