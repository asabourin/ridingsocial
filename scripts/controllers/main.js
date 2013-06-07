angular.module('App')
  .controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
        updateMap(args.position.latitude, args.position.longitude)
    });

    $rootScope.$on("nearbySpotsUpdated", function (event, args) {
        $scope.spots = args.nearby
        $scope.loading = false
        Spots.checkNearest()
    });

    $rootScope.$on("newNearestSpot", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", "Yeah!, Not now");
    })

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $scope.loading = false
        $scope.sessions = args.sessions
    });

    $scope.$on('$destroy', function () {
        Geolocation.stopWatching()
    });

    $scope.$watch('bounds', function(oldVal, newVal){ 
        if($scope.bounds.northeast != undefined) {
            buffered_bounds = Spots.bufferBounds($scope.bounds)
            Spots.fetchWithinBounds(buffered_bounds)
        }
    }, true)

    $rootScope.$on("spotsWithinBoundsUpdated", function (event, args) {
      $scope.markers = _.reject($scope.markers, function(m){ return m.id != 'me'; });
      markers = buildSpotsMarkers(args.withinBounds.spots)
    });

    // Init

    $scope.loading = true
    $scope.activeTab = 'nearby'
    $scope.navigate = $navigate

    Geolocation.resetPosition()
    CordovaReady(Geolocation.watchPosition())

    var nearby = Spots.getNearby()
    if (nearby != undefined) {
        $scope.spots = nearby
        $scope.loading = false
    }

    var followedSessions = Sessions.getFollowed()
    if (followedSessions != undefined) {
        $scope.sessions = followedSessions
    }
    else {
        Sessions.refreshFollowed(User.getToken())
    }

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
        $scope.activeTab = tab;
    }

    function wannaCheckin(index) {
        if(index == 1) {
            $navigate.go('/checkin', 'pop')
        }
    }

    function updateMap(latitude, longitude) {
      $scope.markers = _.reject($scope.markers, function(m){ return m.id == 'me'; });
      $scope.markers.push({
        id: 'me',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
      $scope.center.latitude = latitude
      $scope.center.longitude = longitude
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