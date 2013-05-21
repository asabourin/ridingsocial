angular.module('App')

.controller('MainController', function(Geolocation, CordovaReady, Push, Facebook, User, $scope, $rootScope, $location) {

  // Init
  Facebook.init()
  $rootScope.showNav = false;

  //Check if user previously authenticated
  if(User.is_logged()) {
     User.me() 
     Push.init()
  }
  else {
    $scope.loading =false
    $scope.showFacebook = true
  }

  // Event listeners

  $rootScope.$on("fb_connected", function (event, args) {
    
    if($rootScope.fb_connected == true) { } //Prevent multiple events firing 
    else {

      $rootScope.fb_connected = true
      
      User.login(args.response.authResponse.accessToken, function(response) {
        $rootScope.$broadcast('rs_connected', {response:response});
      }),
      function(response) {
        console.log(response)
        $scope.loading =false
        $scope.showFacebook = true
      }

    }
  });

  $rootScope.$on("fb_login_failed", function (event, args) {
    console.log(args.response)
    $scope.loading =false
    $scope.showFacebook = true
  });

  $rootScope.$on("rs_connected", function (event, args) {
      User.me()
      Push.init()
  });

  $rootScope.$on('gotMe', function(event, args) {
    $scope.loading = false
    $location.path('/nearby');
  });

  $rootScope.$on('gotMe_failed', function(event, args) {
    console.log(args.response.error)
    User.logout()
    $scope.loading =false
    $scope.showFacebook = true
  });

  $rootScope.$on("rs_login_failed", function(event, args) {
    console.log(args.response.error)
    User.logout()
    $scope.loading =false
    $scope.showFacebook = true
  })

  $rootScope.$on("pushRegistered", function (event, args) {

    User.registerDevice(args.settings, function(response){
      localStorage.setItem('pushSettings', JSON.stringify(args.settings))
    }, 
      function(response) {
        navigator.notification.alert("Could not save Push Notification settings on backend: "+response, null, Lang.en.error)
      })
  })

  // Button functions

  $scope.login = function () {
      $scope.showFacebook = false
      $scope.loading = true
      Facebook.login();
  };


})