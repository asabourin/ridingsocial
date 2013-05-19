angular.module('App')

.controller('MainController', function(Geolocation, CordovaReady, Push, Facebook, User, $scope, $rootScope, $location) {

  // Init
  Facebook.init()
  $rootScope.showNav = false;

  //Check if user data already in localStorage

  var user = JSON.parse(localStorage.getItem('user'));

  if(user == undefined) {
      $rootScope.logged = false;
      $scope.loading =false
      $scope.showFacebook = true
  }
  else {
    User.me(user.token, 
      // Success
      function(response) {
        $rootScope.me = response;
        $rootScope.user = user;
        $rootScope.$broadcast('gotMe', {user:user});
        Push.init()
        $location.path('/nearby');
      },
      // Failure
      function(response) {
          console.log(response.error)
          $rootScope.logged = false;
          $scope.loading =false
          $scope.showFacebook = true
      })
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
        $rootScope.logged = false;
        $scope.loading =false
        $scope.showFacebook = true
      }

    }
  });

  $rootScope.$on("fb_login_failed", function (event, args) {
    console.log(args.response)
    $rootScope.logged = false;
    $scope.loading =false
    $scope.showFacebook = true
  });

  $rootScope.$on("rs_connected", function (event, args) {

      $rootScope.user = args.response
      localStorage.setItem('user', JSON.stringify(args.response));

      User.me(args.response.token, function(response) {
        $rootScope.$broadcast('gotMe', {user:response});
      })

      Push.init()

      $location.path('/nearby');
      $rootScope.logged = true;
      $scope.loading = false
  });

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