angular.module('Services').factory('User', function ($rootScope, $http) {

    // Init
    var id, token;
    var persistedUser = JSON.parse(localStorage.getItem('user'));

    if(persistedUser != undefined) {
        id = persistedUser.id
        token = persistedUser.token
    }

    var picture;

    function persistUser() {
        var user = {id: id, token:token}
        localStorage.setItem('user', JSON.stringify(user)) 
    }

    //

    return {
        is_logged: function() {
            return token != undefined
        },
        picture: function() {
            return picture
        },
        login:function (accessToken) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(function(response) {
                id = response.id
                token = response.token
                persistUser()
                $rootScope.$broadcast('rs_connected', {response:response})
            }).error(function(response){
                $rootScope.$broadcast('rs_login_failed', {response:response})
            })
        },
        me:function () {
            $http.get(Settings.host+'me?token='+token).success(function(response){
                picture = response.picture
                $rootScope.$broadcast('gotMe', {response:response});
            }).error(function(response){
                $rootScope.$broadcast('gotMe_failed', {response:response})
            })
        },
        registerDevice:function (settings, successCallback, errorCallback) {
            
            if(logged) {
                var payload = "platform="+settings.platform+"&device_token="+settings.token
                $http.post(Settings.host+'register?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
            }
            else {
                errorCallback('No user token')
            }
        },
        logout: function() {
            token = null;
            id = null;
            localStorage.clear()
        }

    }

})