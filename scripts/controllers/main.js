angular.module('App')

.controller('MainController', function(Geolocation, CordovaReady, Facebook, User, $scope, $rootScope, $location) {

  // 
  $rootScope.showNav = false;

  // Warming up the GPS as early as possible
  Geolocation.getCurrentPosition(function (position) {
          Geolocation.onPosition(position)
        }, function(error) {}, {timeout: 10000})

  //Check if user data already in localStorage

  var localUser = JSON.parse(localStorage.getItem('user'));

  if(localUser == undefined) {
      logout()
  }
  else {
    User.me(localUser.token, 
      // Success
      function(response) {
        $rootScope.user = response;
        $location.path('/nearby');
      },
      // Failure
      function(response) {
          console.log(response.error)
          logout()
      })
  }

  // Event listeners

  $rootScope.$on("fb_connected", function (event, args) {
      User.login(args.response.authResponse.accessToken, function(response) {
        login(response.token)
      }),
      function(response) {
        console.log(response.error)
        logout()
      }
  });

  $rootScope.$on("fb_login_failed", function (event, args) {
      $scope.loading = false
      $scope.showFacebook = true
  });

  $rootScope.$on("rs_connected", function (event, args) {

      localStorage.setItem('user', JSON.stringify(args.response));

      User.me(args.response.token, function(response) {
        $rootScope.user = response;
      })

      $location.path('/nearby');
      $rootScope.logged = true;
      $scope.loading = false
  });

  $rootScope.$on("rs_login_failed", function (event, args) {
      $scope.loading = false
      $scope.showFacebook = true
  });

  // Push

  CordovaReady(setupPush())

  function setupPush() {

    var pushNotification = window.plugins.pushNotification;
      if (device.platform == 'android' || device.platform == 'Android') {
          pushNotification.register(pushSuccessHandler, pushErrorHandler,{"senderID":"535845696743","ecb":"onNotificationGCM"});
      } else {
          pushNotification.register(pushTokenHandler, pushErrorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
      }
    
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
    localStorage.clear()
    $location.path('/');
    $scope.showFacebook = true
    Facebook.init()
  }



})