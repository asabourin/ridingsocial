angular.module('Services').factory('Spots', function ($rootScope, $http) {

    var nearby, favorites, currentNearest, withinBounds;

    function distance(spot, location) {
      var r = 6371 //km
      var rad = 3.1416 / 180
      lat1 = spot.lat * rad
      lon1 = spot.lng * rad
      lat2 = location.latitude * rad
      lon2= location.longitude * rad
      d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2) * Math.cos(lon2-lon1)) * r;
      return d.toFixed(1)
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
            spots = _.map(favorites, function(spot) {
                spot.distance = distance(spot, location);
                return spot
            })
            favorites = _.sortBy(spots, function(spot){spot.distance})
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

        show: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'?token='+token).success(successCallback).error(errorCallback);
        }
    };

})