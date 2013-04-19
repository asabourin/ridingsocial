'use strict';

angular.module('App')

.controller('StartController', function(Geolocation, localStorageService, Facebook, Riders, $scope, $rootScope, $location) {
    
    // Warming up the GPS as early as possible
    Geolocation.getCurrentPosition(function (position) {}, function(error) {}, {timeout: 5000})

    var rider = JSON.parse(localStorageService.get('rider'));

    if(rider == undefined) {
        Facebook.init()
        $scope.showFacebook = true
    } 
    else {
        $location.path('/main');
    }

    $rootScope.$on("fb_connected", function (event, args) {
        Riders.login(args.response.authResponse.accessToken)
    });

    $rootScope.$on("rs_connected", function (event, args) {
        localStorageService.add('rider', JSON.stringify(args.response));
        $scope.loading = false
        $location.path('/main');
    });

    // Button functions
    $scope.login = function () {
        $scope.showFacebook = false
        $scope.loading = true
        Facebook.login();
    };

})