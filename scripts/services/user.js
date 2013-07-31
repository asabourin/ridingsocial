angular.module('Services').factory('User', function ($rootScope, $http) {

    "use strict";

    // Init
    var id, token, lastCheckinAt, preferences, checkedAt;

    loadSavedUser();
    loadSavedPreferences();
    loadSavedCheckedAt();

    //

    function loadSavedUser() {
      var persistedUser = JSON.parse(localStorage.getItem('user'));
      if(persistedUser !== null) {
        id = persistedUser.id;
        token = persistedUser.token;
      }
    }

    function loadSavedPreferences() {
      var savedPreferences = JSON.parse(localStorage.getItem('preferences'));
      if(savedPreferences !== null) {
          preferences = savedPreferences;
      }
      else {
        preferences = new Object({notify: true});
      }
    }

    function loadSavedCheckedAt() {
      var savedCheckedAt = JSON.parse(localStorage.getItem('checkedAt'));
      if(savedCheckedAt !== null) {
          checkedAt = savedCheckedAt;
      }
      else {
        checkedAt = new Object({'followed_riders': timestamp(), 'watched_spots': timestamp(), 'notifications': timestamp()});
      }
    }

    function savePreferences() {
        localStorage.setItem('preferences', JSON.stringify(preferences));
        var payload = "notify="+preferences.notify;
        $http.post(Settings.host+'preferences?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
    }

    function saveCheckedAt() {
        localStorage.setItem('checkedAt', JSON.stringify(checkedAt));
    }

    function persistUser() {
        var user = {id: id, token:token, lastCheckinAt:lastCheckinAt};
        localStorage.setItem('user', JSON.stringify(user));
    }

    function timestamp() {
        return Math.round(new Date().getTime() / 1000);
    }

    //

    return {

        token: function() {
            return token;
        },

        get: function() {
            return {id: id, token:token, lastCheckinAt:lastCheckinAt};
        },

        fetchFollowedRiders: function(successCallback) {
            $http.get(Settings.host+'riders/followed?token='+token).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        login:function (accessToken) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(function(response) {
                id = response.id;
                token = response.token;
                persistUser();
                $rootScope.$broadcast('rs_connected');
            }).error(function(response){
                $rootScope.$broadcast('rs_login_failed', {response:response});
            });
            var phase = $rootScope.$$phase;
            if(phase === '$apply' || phase === '$digest'){}
            else {$rootScope.$apply();}
        },

        registerDevice:function (settings, successCallback, errorCallback) {

            if(token !== undefined) {
                var payload = "platform="+settings.platform+"&device_token="+settings.token;
                $http.post(Settings.host+'register?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
            }
            else {
                errorCallback('No user token');
            }
        },

        setLastCheckinAt: function(time) {
            lastCheckinAt = time;
        },

        updateCheckedAt: function(what) {
            checkedAt[what] = timestamp();
            saveCheckedAt();
        },

        checkedAt: function(what) {
            return checkedAt[what];
        },

        checkNewNotifications: function(successCallback) {
            var params ='last_check_notifications='+checkedAt.notifications+'&last_check_riders='+checkedAt.followed_riders+'&last_check_spots='+checkedAt.watched_spots;
            $http.get(Settings.host+'notifications/new_since?token='+token+'&'+params).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        updatePreferences: function(prefs) {
            preferences = prefs;
            savePreferences();
        },

        getPreferences: function() {
            return preferences;
        },

        notifications: function(successCallback) {
            $http.get(Settings.host+'notifications?token='+token).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        logout: function() {
            token = undefined;
            id = undefined;
            $rootScope.user = undefined;
            $rootScope.position = null;
            localStorage.clear();
        }

    };

});