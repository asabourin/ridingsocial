angular.module('Services').factory('Spots', function ($rootScope, $http) {

    var nearby, favorites, currentNearest, withinBounds;

    function distance(spot, location) {
        return "0"
    }

    return {

        getNearby:function() {
            return nearby;
        },

        getNearest: function() {
            return currentNearest
        },

        favorites: function() {
            return favorites
        },

        computeDistanceFavorites: function(location) {
            favorites = _.map(favorites, function(spot) {
                spot.distance = distance(spot, location);
                return spot
            })
            $rootScope.$broadcast('favoritesSpotsUpdated', {favorites:favorites})
        },

        refreshNearby:function (position) {
            $http.get(Settings.host+'spots/nearby?lat='+position.latitude+'&lng='+position.longitude+'&coeff='+Settings.coeff+'&max_dist='+Settings.radius).success(function(response){
                nearby = response;
                $rootScope.$broadcast('nearbySpotsUpdated', {nearby:nearby})
            }, function(error) {

            });
        },

        fetchWithinBounds:function (bounds) {
            $http.get(Settings.host+'spots/within?min_lat='+bounds.min_lat+'&min_lng='+bounds.min_lng+'&max_lat='+bounds.max_lat+'&max_lng='+bounds.max_lng+'&limit=100' ).success(function(response){
                withinBounds = response;
                $rootScope.$broadcast('spotsWithinBoundsUpdated', {withinBounds:withinBounds})
            }, function(error) {

            });
        },

        fetchFavorites: function(token) {
            $http.get(Settings.host+'spots/favorites?&token='+token).success(function(response){
                favorites = response;
                $rootScope.$broadcast('favoritesSpotsUpdated', {favorites:favorites})
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