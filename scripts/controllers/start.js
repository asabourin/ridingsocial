'use strict';

angular.module('App')

.controller('StartController', function(Geolocation, localStorageService, Facebook, Riders, $scope, $rootScope, $location) {
    
    // Warming up the GPS as early as possible
    Geolocation.getCurrentPosition(function (position) {}, function(error) {}, {timeout: 5000})

    //Check if user data already in localStorage

    var user = JSON.parse(localStorageService.get('user'));

    if(user == undefined) {

        Facebook.init()
        $scope.showFacebook = true

    }

    $rootScope.$on("fb_connected", function (event, args) {
        Riders.login(args.response.authResponse.accessToken)
    });

    $rootScope.$on("fb_login_failed", function (event, args) {
        $scope.loading = false
        $scope.showFacebook = true
    });

    $rootScope.$on("rs_connected", function (event, args) {
        localStorageService.add('user', JSON.stringify(args.response));
        $location.path('/spots');
        $rootScope.logged = true
        $scope.loading = false
    });

    $rootScope.$on("rs_login_failed", function (event, args) {
        $scope.loading = false
        $scope.showFacebook = true
    });

    // Button functions
    $scope.login = function () {
        $scope.showFacebook = false
        $scope.loading = true
        Facebook.login();
    };

})