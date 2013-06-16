angular.module('App')
  .controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
        Spots.computeDistanceFavorites(args.position)
        updateMap(args.position)
    });

    $rootScope.$on("favoritesSpotsUpdated", function (event, args) {
        $rootScope.spots = args.favorites
    });

    $rootScope.$on("nearbySpotsUpdated", function(event, args) {
      Spots.checkNearest()
    })

    $rootScope.$on("newNearestSpot", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", "Yeah!, Not now");
    })

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $rootScope.sessions = args.sessions
        $scope.loading = false
    });

    $scope.$on('$destroy', function () {
        Geolocation.stopWatching()
    });

    $scope.$watch('bounds', function(oldVal, newVal){ 
        if($scope.bounds.northeast != undefined) {
            Spots.fetchWithinBounds(bufferBounds($scope.bounds))
        }
    }, true)

    $rootScope.$on("spotsWithinBoundsUpdated", function (event, args) {
      $scope.markers = _.reject($scope.markers, function(m){ return m.id != 'me'; });
      markers = buildSpotsMarkers(args.withinBounds.spots)
    });

    // Init

    $scope.loading = true
    $rootScope.activeTab = $rootScope.activeTab || 'sessions'
    $navigate.eraseHistory()

    Geolocation.resetPosition()
    CordovaReady(Geolocation.watchPosition())

    Sessions.refreshFollowed(User.token())
    Spots.fetchFavorites(User.token())

    User.getFollowedRiders()

    // New look for Google Maps
    google.maps.visualRefresh = true;

    angular.extend($scope, {
      center: {
        latitude: 0, // initial map center latitude
        longitude: 0, // initial map center longitude
      },
      bounds: {},
      markers: [], // an array of markers,
      zoom: 12, // the zoom level
    });

    // Functions

    $scope.goToTab = function(tab) {
        $rootScope.activeTab = tab;
    }

    $scope.refresh = function() {
      $scope.loading =true
      Spots.fetchFavorites(User.token())
      Sessions.refreshFollowed(User.token())
      Spots.refreshNearby(Geolocation.currentPosition())
      updateMap(Geolocation.currentPosition())
    }

    function wannaCheckin(index) {
        if(index == 1) {
            $navigate.go('/checkin', 'pop')
        }
    }

    function updateMap(position) {
      $scope.markers = _.reject($scope.markers, function(m){ return m.id == 'me'; });
      $scope.markers.push({
        id: 'me',
        latitude: parseFloat(position.latitude),
        longitude: parseFloat(position.longitude)
      });
      $scope.center.latitude = position.latitude
      $scope.center.longitude = position.longitude
    }

    function buildSpotsMarkers(spots) {
       markers = _.each(spots, function(spot) {
        $scope.markers.push( {
          id: spot.id,
          latitude: parseFloat(spot.lat),
          longitude: parseFloat(spot.lng),
          icon: 'images/flags/'+spot.color+'_32.png',
          infoWindow: formatMarkerInfo(spot)
        })
      })
       return markers
    }

    function formatMarkerInfo(spot) {
        return '<p><b>'+spot.name+'</b><br>'+spot.checkins+' recent checkins</p>'
    }

    function bufferBounds(bounds) {
        var min_lat = ( bounds.southwest.latitude-Math.abs(bounds.southwest.latitude)*0.01 ).toFixed(6)
        var min_lng = ( bounds.southwest.longitude-Math.abs(bounds.southwest.longitude)*0.01 ).toFixed(6)
        var max_lat = ( bounds.northeast.latitude+Math.abs(bounds.northeast.latitude)*0.01 ).toFixed(6)
        var max_lng = ( bounds.northeast.longitude+Math.abs(bounds.northeast.longitude)*0.01 ).toFixed(6)
        return {min_lat: min_lat, max_lat: max_lat, min_lng: min_lng, max_lng: max_lng}
    }

    // Debug

    $scope.logout = function() {logout()}
    $scope.checkin = function() {
      $navigate.go('/checkin', 'pop')
    }

    function logout() {
        User.logout()
        $navigate.go('/', 'fade')
    }

    
})