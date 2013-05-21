angular.module('App')

.controller('MainController', function(Push, Facebook, User, $scope, $rootScope, $location) {

  // Init

  // Events

  $rootScope.$on("rs_connected", function (event, args) {
      User.me()
      Push.init()
  });

  $rootScope.$on('gotMe', function(event, args) {
    $scope.picture = User.picture()
    $location.path('/nearby')

  });

  $rootScope.$on('gotMe_failed', function(event, args) {
    console.log(args.response.error)
    logout()
  });

  $rootScope.$on("pushRegistered", function (event, args) {

    User.registerDevice(args.settings, function(response){
      localStorage.setItem('pushSettings', JSON.stringify(args.settings))
    }, 
      function(response) {
        console.log("Could not save Push Notification settings on backend: "+response, null, Lang.en.error)
      })
  })

  // Button functions

  $scope.logout = function() {logout()}

  function logout() {
    User.logout()
    $location.path('/')
  }


})