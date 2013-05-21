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
        }
    }

})