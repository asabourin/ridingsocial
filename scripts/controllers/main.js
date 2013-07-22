angular.module('App')
  .controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
        Spots.updateDistanceWatched(args.position)
        updateMap(args.position)
        $rootScope.position = args.position
    });

    $rootScope.$on("watchedSpotsUpdated", function (event, args) {
        $rootScope.spots = args.watched
    });

    $rootScope.$on("nearbySpotsUpdated", function(event, args) {
      $scope.loading = false
      Spots.checkNearest()
    })

    $rootScope.$on("newNearestSpot", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", "Yeah!, Not now");
    })

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $rootScope.sessions = args.sessions
    });

    $scope.$on('$destroy', function () {
        Geolocation.stopWatching()
    });

    $scope.$watch('map.bounds', function(oldVal, newVal){ 
        if($scope.map.bounds.northeast !=undefined) {
          Spots.fetchWithinBounds(bufferBounds($scope.map.bounds))
        }
    }, true)

    $rootScope.$on("spotsWithinBoundsUpdated", function (event, args) {
      $scope.map.markers = buildSpotsMarkers(args.withinBounds.spots)
    });

    // Init

    $rootScope.activeTab = $rootScope.activeTab || 'sessions'
    $navigate.eraseHistory()
    google.maps.visualRefresh = true;

    if($rootScope.position == undefined) {

      angular.extend($rootScope, {
        map: {
          center: {
            latitude: 0,
            longitude: 0
          },
          bounds: {},
          markers: [],
          zoom: 13
        }
      })

      refresh()

    }

    // Functions

    $scope.goToTab = function(tab) {
        $rootScope.activeTab = tab;
    }

    $scope.refresh = function() { refresh() }

    function refresh() {
      $scope.loading =true
      Spots.fetchWatched(User.token())
      Sessions.refreshFollowed(User.token())
      Geolocation.resetPosition()
      CordovaReady(Geolocation.getPosition())
      $rootScope.map.zoom = 13
    }

    function wannaCheckin(index) {
        if(index == 1) {
            $navigate.go('/checkin', 'pop')
        }
        $scope.$apply()
    }

    function updateMap(position) {
      $rootScope.myPosition = {
        id: 'me',
        latitude: parseFloat(position.latitude),
        longitude: parseFloat(position.longitude)
      }
      $rootScope.map.center.latitude = position.latitude
      $rootScope.map.center.longitude = position.longitude
    }

    function buildSpotsMarkers(spots) {
       var markers = []
       _.each(spots, function(spot) {
        markers.push( {
          id: spot.id,
          latitude: parseFloat(spot.lat),
          longitude: parseFloat(spot.lng),
          icon: 'images/flags/'+spot.color+'_32.png',
        })
      })
       return markers
    }
    
    function bufferBounds(bounds) {
        var min_lat = ( bounds.southwest.latitude-Math.abs(bounds.southwest.latitude)*0.01 ).toFixed(6)
        var min_lng = ( bounds.southwest.longitude-Math.abs(bounds.southwest.longitude)*0.01 ).toFixed(6)
        var max_lat = ( bounds.northeast.latitude+Math.abs(bounds.northeast.latitude)*0.01 ).toFixed(6)
        var max_lng = ( bounds.northeast.longitude+Math.abs(bounds.northeast.longitude)*0.01 ).toFixed(6)
        return {min_lat: min_lat, max_lat: max_lat, min_lng: min_lng, max_lng: max_lng}
    }

    // Modal for session others
    $scope.showOthers = function (session_id) {
      $scope.this_session = _.find($rootScope.sessions, function(s) {return s.id == session_id})
      $scope.othersOpen = true;
    };
    $scope.hideOthers = function () {
      $scope.othersOpen = false;
    };

    
})