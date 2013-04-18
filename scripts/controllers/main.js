'use strict';

angular.module('app')
  .controller('MainCtrl', function(facebook, geolocation, $scope, $rootScope, $http, $location) {
    
    var intervalGeo = setInterval(function () {
        geolocation.getCurrentPosition(function (position) {
          $scope.position = position;
        });
    }, 5000);
  
    $scope.$on('$destroy', function () {
        clearInterval(intervalGeo);
    });

   facebook.init()


    $scope.response = "unknown";

    $rootScope.$on("fb_statusChange", function (event, args) {
        $rootScope.fb_status = args.status;
        $rootScope.$apply();
    });
    $rootScope.$on("fb_get_login_status", function () {
        facebook.getLoginStatus();
    });
    $rootScope.$on("fb_login_failed", function () {
        console.log("fb_login_failed");
    });


    $rootScope.$on("fb_connected", function (event, args) {
        
        $scope.response = args.response;
        $scope.$apply();
    });


    $scope.login = function () {
        facebook.login();
    };

})