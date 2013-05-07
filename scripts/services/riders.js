angular.module('Services').factory('Riders', function ($rootScope, $http) {
    return {

        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id).success(successCallback).error(errorCallback);
        }
    };

})