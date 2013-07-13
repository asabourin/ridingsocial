angular.module('Services').factory('Riders', function ($rootScope, $http) {
    return {

        show: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'?token='+token).success(successCallback).error(errorCallback);
        },
        sessions: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/sessions?token='+token).success(successCallback).error(errorCallback);
        },
        followers: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/followers?token='+token).success(successCallback).error(errorCallback);
        },
        follow: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/follow?token='+token).success(successCallback).error(errorCallback);
        },
        unfollow: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/unfollow?token='+token).success(successCallback).error(errorCallback);
        },
        watch: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/watch?token='+token).success(successCallback).error(errorCallback);
        },
        unwatch: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/unwatch?token='+token).success(successCallback).error(errorCallback);
        }
    };

})