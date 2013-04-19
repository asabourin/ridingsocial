'use strict';

angular.module('App')

.controller('StartController', function(localStorageService, Facebook, Riders, $scope, $rootScope, $location) {
    
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
        $location.path('/main');
    });

    // Button functions
    $scope.login = function () {
        Facebook.login();
    };

})