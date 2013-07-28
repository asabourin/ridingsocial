angular.module('Services').factory('User', function ($rootScope, $http) {

    // Init
    var id, token, lastCheckinAt, preferences, lastCheckAt;
    
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

    var savedLastCheckAt = JSON.parse(localStorage.getItem('lastCheckAt'));
    if(savedLastCheckAt != undefined) {
        lastCheckAt = savedLastCheckAt
    }
    else {lastCheckAt = new Object({'followed_riders': timestamp(), 'watched_spots': timestamp(), 'notifications': timestamp()})}

    //

    function savePreferences() {
        localStorage.setItem('preferences', JSON.stringify(preferences)) 
        var payload = "notify="+preferences.notify
        $http.post(Settings.host+'preferences?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}})
    }

    function saveLastCheckAt() {
        localStorage.setItem('lastCheckAt', JSON.stringify(lastCheckAt)) 
    }

    function persistUser() {
        var user = {id: id, token:token, lastCheckinAt:lastCheckinAt}
        localStorage.setItem('user', JSON.stringify(user)) 
    }

    var isLogged = function() {
        return (token != undefined && token != null)
    }

    function timestamp() {
        return Math.round(new Date().getTime() / 1000)
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
                $rootScope.$broadcast('rs_connected')
            }).error(function(response){
                $rootScope.$broadcast('rs_login_failed', {response:response})
            })
            var phase = $rootScope.$$phase;
              if(phase == '$apply' || phase == '$digest'){}
              else {$rootScope.$apply()}  
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

        updateLastCheckAt: function(what) {
            lastCheckAt[what] = timestamp()
            saveLastCheckAt()
        },

        lastCheckAt: function(what) {
            return lastCheckAt[what]
        },

        checkNewNotifications: function(successCallback) {
            var params ='last_check_notifications='+lastCheckAt['notifications']+'&last_check_riders='+lastCheckAt['followed_riders']+'&last_check_spots='+lastCheckAt['watched_spots']
            $http.get(Settings.host+'notifications/new_since?token='+token+'&'+params).success(successCallback).error(function(response) {
                console.log(response)
            })
        },

        updatePreferences: function(prefs) {
            preferences = prefs
            savePreferences()
        },

        getPreferences: function() {
            return preferences
        },

        notifications: function(successCallback) {
            $http.get(Settings.host+'notifications?token='+token).success(successCallback).error(function(response) {
                console.log(response)
            })
        },

        logout: function() {
            token = null;
            id = null;
            $rootScope.user = null;
            $rootScope.position = null;
            localStorage.clear()
        }

    }

})