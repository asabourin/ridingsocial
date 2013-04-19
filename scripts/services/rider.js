angular.module('Services').factory('Rider', function ($rootScope, $http) {
    return {

        login:function (accessToken) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(function(response) {
                $rootScope.$broadcast('rs_connected', {response:response});
            });
        },
        me:function (token, successCallback) {
            $http.get(Settings.host+'me?token='+token).success(successCallback);
        }
    };

})