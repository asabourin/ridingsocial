angular.module('Services').factory('Riders', function ($rootScope, $http) {
    return {

        login:function (accessToken) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(function(response) {
                $rootScope.$broadcast('rs_connected', {response:response});
            })
            .error(function(response) {
                $rootScope.$broadcast('rs_login_failed', {response:response});
                alert(response.error)
            });
        },
        me:function (token, successCallback, errorCallback) {
            $http.get(Settings.host+'me?token='+token).success(successCallback).error(errorCallback);
        },
        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/riders/'+id).success(successCallback).error(errorCallback);
        }
    };

})