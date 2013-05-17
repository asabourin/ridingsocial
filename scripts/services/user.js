angular.module('Services').factory('User', function ($rootScope, $http) {
    return {
        login:function (accessToken, successCallback, errorCallback) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(successCallback).error(errorCallback);
        },
        me:function (token, successCallback, errorCallback) {
            $http.get(Settings.host+'me?token='+token).success(successCallback).error(errorCallback);
        },
        registerDevice:function (settings, successCallback, errorCallback) {
            var login = JSON.parse(localStorage.getItem('login'));
            var token = login.token
            if(token != undefined) {
                $http.post(Settings.host+'register?token='+token, settings).success(successCallback).error(errorCallback);
            }
            else {
                errorCallback('No user token')
            }
        }

    }

})