angular.module('App')

.controller('MainController', function(Geolocation, CordovaReady, Push, Facebook, User, $scope, $rootScope, $location) {

  // Init
  Facebook.init()
  $rootScope.showNav = false;

  // Warming up the GPS as early as possible
  Geolocation.getCurrentPosition(function (position) {
          Geolocation.onPosition(position)
        }, function(error) {}, {timeout: 10000})

  //Check if user data already in localStorage

  var login = JSON.parse(localStorage.getItem('login'));

  if(login == undefined) {
      $rootScope.logged = false;
      $scope.loading =false
      $scope.showFacebook = true
  }
  else {
    User.me(login.token, 
      // Success
      function(response) {
        $rootScope.user = response;
        $rootScope.login = login
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

  $rootScope.$on("pushRegistered", function (event, args) {
    alert('pushRegistered')
    User.registerDevice(args.settings, function(response){
      localStorage.setItem('pushSettings', JSON.stringify(args.settings))
    }, 
      function(response) {
        navigator.notification.alert("Could not save Push Notification settings on backend: "+response, null, Lang.en.error)
      })
  })

  $rootScope.$on("rs_connected", function (event, args) {

      $rootScope.login = args.response
      localStorage.setItem('login', JSON.stringify(args.response));

      User.me(args.response.token, function(response) {
        $rootScope.user = response;
      })

      Push.init()

      $location.path('/nearby');
      $rootScope.logged = true;
      $scope.loading = false
  });

  // Button functions

  $scope.login = function () {
      $scope.showFacebook = false
      $scope.loading = true
      Facebook.login();
  };


})