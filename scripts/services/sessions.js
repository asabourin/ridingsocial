angular.module('Services').factory('Sessions', function ($rootScope, $http) {

    var followed;

    return {

        getFollowed: function() {
            return followed
        },

        refreshFollowed:function (token) {
            $http.get(Settings.host+'checkins/followed?token='+token).success(function(response) {
                followed = response
                $rootScope.$broadcast('sessionsUpdated', {sessions:response})
            })
        },

        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id).success(successCallback).error(errorCallback);
        },
        like: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'checkins/'+id+'/like?token='+token).success(successCallback).error(errorCallback);
        },
        unlike: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'checkins/'+id+'/unlike?token='+token).success(successCallback).error(errorCallback);
        },
        comments: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id+'/comments').success(successCallback).error(errorCallback);
        },
        likes: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id+'/likes').success(successCallback).error(errorCallback);
        },
        postComment: function(token, id, text, successCallback, errorCallback) {
            $http.post(Settings.host+'checkins/'+id+'/comments?token='+token, "text="+text, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
        }
    }

})