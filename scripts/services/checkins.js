angular.module('Services').factory('Checkins', function ($rootScope, $http) {
    return {

        followed:function (token, successCallback) {
            $http.get(Settings.host+'checkins/followed?token='+token).success(successCallback)
        },

        create:function(spot, action, rating, howisit, riders, token, successCallback) {
          $http.post(Settings.host+'checkins/create', {}).success(successCallback)
        },
        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id).success(successCallback).error(errorCallback);
        }
    };

})