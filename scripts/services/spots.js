angular.module('Services').factory('Spots', function ($rootScope, $http) {

    var nearby, currentNearest;

    return {

        getNearby:function() {
            return nearby;
        },

        refreshNearby:function (position) {
            $http.get(Settings.host+'spots/nearby?lat='+position.latitude+'&lng='+position.longitude+'&coeff='+Settings.coeff+'&max_dist='+Settings.radius).success(function(response){
                nearby = response;
                $rootScope.$broadcast('nearbyUpdated', {nearby:nearby})
            }, function(error) {

            });
        },

        checkNearest: function() {

            if(nearby[0]['distance'] <= Settings.checkin_distance && (currentNearest == undefined || currentNearest.id != nearby[0]['id'])) {
                currentNearest = nearby[0];
                $rootScope.$broadcast('newNearest', {spot:currentNearest})
            }

        },

        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/spots/'+id).success(successCallback).error(errorCallback);
        }
    };

})