'use strict';

angular.module('App')

  .controller('StartController', function(localStorageService, Facebook, Rider, $scope, $rootScope, $location) {
    
   var rider = JSON.parse(localStorageService.get('rider'));

   Facebook.init()

    $rootScope.$on("fb_statusChange", function (event, args) {
        $scope.fb_status = args.status;
        $scope.$apply();
    });
    $rootScope.$on("fb_get_login_status", function () {
        facebook.getLoginStatus();
    });
    $rootScope.$on("fb_login_failed", function () {
        console.log("fb_login_failed");
    });


    $rootScope.$on("fb_connected", function (event, args) {
        
        $scope.fb_response = args.response;

        Rider.login(args.response.authResponse.accessToken)

     
    });

    $rootScope.$on("rs_connected", function (event, args) {
        
        $scope.rs_response = args.response;
        localStorageService.add('rider', JSON.stringify(args.response));
        $location.path('/main');
    });


    // Button functions

    $scope.login = function () {
        Facebook.login();
    };

})