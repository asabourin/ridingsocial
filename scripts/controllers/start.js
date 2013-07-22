angular.module('App')

.controller('StartController', function(Push, Facebook, User, $scope, $rootScope, $location, $navigate) {

  // Events

  $scope.$on("fb_connected", function (event, args) {

    $scope.loading =true
    $scope.showFacebook = false

    User.login(args.response.authResponse.accessToken, function(response) {
      $scope.$broadcast('rs_connected');
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
    Push.init()
    $navigate.go('/main', 'fade')
  });

  $scope.$on("pushRegistered", function (event, args) {
    User.registerDevice(args.settings, function(response){
    }, function(response) {
        console.log("Could not save Push Notification settings on backend: "+response, null, Lang.en.error)
      })
  })

  // Init

  if(User.isLogged()) {
    $scope.$broadcast('rs_connected');
  }
  else{
    $navigate.go('/start')
    Facebook.init()
    $scope.loading =false
    $scope.showFacebook = true
  }
  
  // Button functions

  $scope.login = function () {
      Facebook.login();
  };

})