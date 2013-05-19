angular.module('Services').factory('User', function ($rootScope, $http) {
    return {
        login:function (accessToken, successCallback, errorCallback) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(successCallback).error(errorCallback);
        },
        me:function (token, successCallback, errorCallback) {
            $http.get(Settings.host+'me?token='+token).success(successCallback).error(errorCallback);
        },
        registerDevice:function (settings, successCallback, errorCallback) {
            var token = $rootScope.user.token
            if(token != undefined) {
                var payload = "platform="+settings.platform+"&device_token="+settings.token
                $http.post(Settings.host+'register?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
            }
            else {
                errorCallback('No user token')
            }
        }

    }

})