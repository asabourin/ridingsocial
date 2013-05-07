angular.module('App')

.controller('MainController', function(localStorageService, Geolocation, Facebook, User, $scope, $rootScope, $location) {

  // Warming up the GPS as early as possible
    Geolocation.getCurrentPosition(function (position) {}, function(error) {}, {timeout: 5000})

  //Check if user data already in localStorage

  var user = JSON.parse(localStorageService.get('user'));

  if(user == undefined) {
      logout()
  }
  else {
    User.me(token, 
      // Success
      function(response) {
        $rootScope.logged = true;
        $rootScope.me = response;
        $location.path('/spots');
      },
      // Failure
      function(response) {
          alert(response.error)
          logout()
      })
  }

  // Event listeners

  $rootScope.$on("fb_connected", function (event, args) {
      User.login(args.response.authResponse.accessToken, function(response) {
        login(response.token)
      }),
      function(response) {
        alert(response.error)
        logout()
      }
  });

  $rootScope.$on("fb_login_failed", function (event, args) {
      $scope.loading = false
      $scope.showFacebook = true
  });

  $rootScope.$on("rs_connected", function (event, args) {

      localStorageService.add('user', JSON.stringify(args.response));

      User.me(args.response.token, function(response) {
        $rootScope.me = response;
      })

      $location.path('/spots');
      $rootScope.logged = true
      $scope.showFacebook = true
      $scope.loading = false
  });

  $rootScope.$on("rs_login_failed", function (event, args) {
      $scope.loading = false
      $scope.showFacebook = true
  });

  // RidingSocial

  function getUser(token) {
    
  }

  // Button functions

  $scope.login = function () {
      $scope.showFacebook = false
      $scope.loading = true
      Facebook.login();
  };

  $scope.logout = function () {
      logout()
  };

  function logout() {
    $rootScope.logged = false;
    localStorageService.clearAll()
    $location.path('/');
    $scope.showFacebook = true
    Facebook.init()
  }



})