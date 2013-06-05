angular.module('Services').factory('Spots', function ($rootScope, $http) {

    var nearby, currentNearest, withinBounds;

    return {

        getNearby:function() {
            return nearby;
        },

        getNearest: function() {
            return currentNearest
        },

        refreshNearby:function (position) {
            $http.get(Settings.host+'spots/nearby?lat='+position.latitude+'&lng='+position.longitude+'&coeff='+Settings.coeff+'&max_dist='+Settings.radius).success(function(response){
                nearby = response;
                $rootScope.$broadcast('nearbySpotsUpdated', {nearby:nearby})
            }, function(error) {

            });
        },

        bufferBounds: function(bounds) {
            var min_lat = ( bounds.southwest.latitude-Math.abs(bounds.southwest.latitude)*0.01 ).toFixed(6)
            var min_lng = ( bounds.southwest.longitude-Math.abs(bounds.southwest.longitude)*0.01 ).toFixed(6)
            var max_lat = ( bounds.northeast.latitude+Math.abs(bounds.northeast.latitude)*0.01 ).toFixed(6)
            var max_lng = ( bounds.northeast.longitude+Math.abs(bounds.northeast.longitude)*0.01 ).toFixed(6)
            return {min_lat: min_lat, max_lat: max_lat, min_lng: min_lng, max_lng: max_lng}
        },

        fetchWithinBounds:function (bounds) {
            $http.get(Settings.host+'spots/within?min_lat='+bounds.min_lat+'&min_lng='+bounds.min_lng+'&max_lat='+bounds.max_lat+'&max_lng='+bounds.max_lng+'&limit=100' ).success(function(response){
                withinBounds = response;
                $rootScope.$broadcast('spotsWithinBoundsUpdated', {withinBounds:withinBounds})
            }, function(error) {

            });
        },

        checkNearest: function() {

            if(nearby[0]['distance'] <= Settings.checkin_distance && (currentNearest == undefined || currentNearest.id != nearby[0]['id'])) {
                currentNearest = nearby[0];
                $rootScope.$broadcast('newNearestSpot', {spot:currentNearest})
            }

        },

        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/spots/'+id).success(successCallback).error(errorCallback);
        }
    };

})