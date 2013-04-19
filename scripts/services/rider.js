angular.module('app.services').factory('rider', function ($rootScope, $http) {
    return {

        login:function (accessToken) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(function(response) {
                $rootScope.$broadcast('rs_connected', {response:response});
            });
        }
    };

})