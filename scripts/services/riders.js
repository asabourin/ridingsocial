angular.module('Services').factory('Riders', function ($rootScope, $http) {
    return {

        show: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'?token='+token).success(successCallback).error(errorCallback);
        },
        sessions: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/sessions?token='+token).success(successCallback).error(errorCallback);
        },
        follow: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/follow?token='+token).success(successCallback).error(errorCallback);
        },
        unfollow: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/unfollow?token='+token).success(successCallback).error(errorCallback);
        },
        favorite: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/favorite?token='+token).success(successCallback).error(errorCallback);
        },
        unfavorite: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/unfavorite?token='+token).success(successCallback).error(errorCallback);
        }
    };

})