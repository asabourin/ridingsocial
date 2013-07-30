angular.module('Services').factory('Spots', function ($rootScope, $http) {

    var nearby, checkinAt, withinBounds;

    function distance(spot, location) {
      var r = 6371; //km
      var rad = 3.1416 / 180;
      lat1 = spot.lat * rad;
      lon1 = spot.lng * rad;
      lat2 = location.latitude * rad;
      lon2= location.longitude * rad;
      d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2) * Math.cos(lon2-lon1)) * r;
      return d.toFixed(1);
    }

    return {

        getNearby:function() {
            return nearby;
        },

        checkinAt: function() {
            return checkinAt;
        },

        setCheckinAt: function(spot) {
            checkinAt = spot;
        },

        distance: function(spot, location) {
            return distance(spot, location);
        },

        refreshNearby:function (position) {
            $http.get(Settings.host+'spots/nearby?lat='+position.latitude+'&lng='+position.longitude+'&coeff='+Settings.coeff+'&max_dist='+Settings.radius).success(function(response){
                nearby = response;
                $rootScope.$broadcast('nearbySpotsUpdated', {nearby:nearby});
            });
        },

        fetchWithinBounds:function (bounds) {
            $http.get(Settings.host+'spots/within?min_lat='+bounds.min_lat+'&min_lng='+bounds.min_lng+'&max_lat='+bounds.max_lat+'&max_lng='+bounds.max_lng+'&limit=100' ).success(function(response){
                withinBounds = response;
                $rootScope.$broadcast('spotsWithinBoundsUpdated', {withinBounds:withinBounds});
            });
        },

        checkNearest: function() {
            if(nearby[0] !== undefined && nearby[0].distance <= Settings.checkin_distance) {
                if (checkinAt === undefined || checkinAt.id !== nearby[0].id) {
                    checkinAt = nearby[0];
                    $rootScope.$broadcast('newNearestSpot', {spot:checkinAt});
                }
            }
        },

        watched: function(token, successCallback) {
            $http.get(Settings.host+'spots/watched?token='+token).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        show: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'?token='+token).success(successCallback).error(errorCallback);
        },
        sessions: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/sessions?token='+token).success(successCallback).error(errorCallback);
        },
        riders: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/riders?token='+token).success(successCallback).error(errorCallback);
        }
    };

});