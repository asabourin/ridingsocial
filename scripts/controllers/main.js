'use strict';

angular.module('app')
  .controller('MainCtrl', function(facebook, geolocation, localStorageService, rider, $scope, $rootScope, $http, $location) {
    
    var intervalGeo = setInterval(function () {
        geolocation.getCurrentPosition(function (position) {
          $scope.position = position;
        });
    }, 5000);
  
    $scope.$on('$destroy', function () {
        clearInterval(intervalGeo);
    });

   $scope.rider_id = localStorageService.get('rider_id');

   facebook.init()

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

        rider.login(args.response.authResponse.accessToken)

     
    });

    $rootScope.$on("rs_connected", function (event, args) {
        
        $scope.rs_response = args.response;

    });




    $scope.login = function () {
        facebook.login();
    };

})