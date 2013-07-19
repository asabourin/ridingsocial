angular.module('Services').factory('User', function ($rootScope, $http) {

    // Init
    var id, token, lastCheckinAt, preferences;
    
    var persistedUser = JSON.parse(localStorage.getItem('user'));

    if(persistedUser != undefined) {
        id = persistedUser.id
        token = persistedUser.token
    }

    var savedPreferences = JSON.parse(localStorage.getItem('preferences'));
    if(savedPreferences != undefined) {
        preferences = savedPreferences
    }
    else {preferences = new Object({notify: true})}

    //

    function savePreferences() {
        localStorage.setItem('preferences', JSON.stringify(preferences)) 
        var payload = "notify="+preferences.notify
        $http.post(Settings.host+'preferences?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
    }

    function persistUser() {
        var user = {id: id, token:token, lastCheckinAt:lastCheckinAt}
        localStorage.setItem('user', JSON.stringify(user)) 
    }

    var isLogged = function() {
        return (token != undefined && token != null)
    }

    //

    return {
        isLogged: isLogged,
        token: function() {
            return token
        },
        get: function() {
            return {id: id, token:token, lastCheckinAt:lastCheckinAt}
        },
        fetchFollowed: function(successCallback) {
        $http.get(Settings.host+'riders/followed?token='+token).success(successCallback).error(function(response) {
            console.log(response)
            })
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
            var phase = $rootScope.$$phase;
              if(phase == '$apply' || phase == '$digest'){}
              else {$rootScope.$apply()}
            
        },
        me:function () {
            $http.get(Settings.host+'me?token='+token).success(function(response){
                $rootScope.$broadcast('gotMe', {response:response});
            }).error(function(response){
                $rootScope.$broadcast('gotMe_failed', {response:response})
            })
        },
        
        registerDevice:function (settings, successCallback, errorCallback) {
            
            if(isLogged) {
                var payload = "platform="+settings.platform+"&device_token="+settings.token
                $http.post(Settings.host+'register?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
            }
            else {
                errorCallback('No user token')
            }
        },
        setLastCheckinAt: function(time) {
            lastCheckinAt = time
        },
        updatePreferences: function(prefs) {
            preferences = prefs
            savePreferences()
        },
        getPreferences: function() {
            return preferences
        },
        logout: function() {
            token = null;
            id = null;
            localStorage.clear()
        }

    }

})