angular.module('App')

.controller('StartController', function(Push, Facebook, User, $scope, $rootScope, $location, $navigate) {

  // Events

  $scope.$on("fb_connected", function (event, args) {

    User.login(args.response.authResponse.accessToken, function(response) {
      $scope.$broadcast('rs_connected', {response:response});
    }),
    function(response) {
      console.log(response)
      $scope.loading =false
      $scope.showFacebook = true
    }

  });

  $scope.$on("fb_login_failed", function (event, args) {
    console.log(args.response)
    $scope.loading =false
    $scope.showFacebook = true
  });

  $scope.$on("rs_login_failed", function(event, args) {
    console.log(args.response)
    User.logout(null)
    $scope.loading =false
    $scope.showFacebook = true
  })

  $scope.$on("rs_connected", function (event, args) {
    $rootScope.user = User.get()
    User.me()
    Push.init()
  });

  $scope.$on('gotMe', function(event, args) {
    $navigate.go('/main', 'fade')
  });

  $scope.$on('gotMe_failed', function(event, args) {
    console.log(args.response.error)
    User.logout(null)
    $scope.loading =false
    $scope.showFacebook = true
  });

  $scope.$on("pushRegistered", function (event, args) {
    User.registerDevice(args.settings, function(response){
    }, function(response) {
        console.log("Could not save Push Notification settings on backend: "+response, null, Lang.en.error)
      })
  })

  // Init

  Facebook.init()

  if(User.isLogged()) {
     $scope.$broadcast('rs_connected', {response:User.get()});
  }
  else{
    $scope.loading =false
    $scope.showFacebook = true
  }
  
  // Button functions

  $scope.login = function () {
      $scope.showFacebook = false
      $scope.loading = true
      Facebook.login();
  };

})