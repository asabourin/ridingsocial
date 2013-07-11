angular.module('App')
  .controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate, $compile) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
        Spots.updateDistanceFavorites(args.position)
        updateMap(args.position)
        $rootScope.position = args.position
    });

    $rootScope.$on("favoritesSpotsUpdated", function (event, args) {
        $rootScope.spots = args.favorites
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

    $scope.$watch('map.center', function(oldVal, newVal){ 
        if($scope.map.bounds.northeast !=undefined) {
          Spots.fetchWithinBounds(bufferBounds($scope.map.bounds))
        }
    }, true)

    $rootScope.$on("spotsWithinBoundsUpdated", function (event, args) {
      $scope.map.markers = buildSpotsMarkers(args.withinBounds.spots)
    });

    // Init

    $scope.loading = true
    $rootScope.activeTab = $rootScope.activeTab || 'sessions'
    $navigate.eraseHistory()

    Geolocation.resetPosition()
    CordovaReady(Geolocation.getPosition())

    Sessions.refreshFollowed(User.token())
    Spots.fetchFavorites(User.token())

    User.getFollowedRiders()

    // New look for Google Maps
    google.maps.visualRefresh = true;

    angular.extend($scope, {
      map: {
        center: {
          latitude: 0,
          longitude: 0
        },
        bounds: {},
        markers: [],
        zoom: 12
      }
    })

    // Functions

    $scope.goToTab = function(tab) {
        $rootScope.activeTab = tab;
    }

    $scope.refresh = function() {
      $scope.loading =true
      Spots.fetchFavorites(User.token())
      Sessions.refreshFollowed(User.token())
      Geolocation.resetPosition()
      CordovaReady(Geolocation.getPosition())
      $scope.map.zoom = 12
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
      $scope.map.center.latitude = position.latitude
      $scope.map.center.longitude = position.longitude
    }

    function buildSpotsMarkers(spots) {
       var markers = []
       _.each(spots, function(spot) {
        markers.push( {
          id: spot.id,
          name: spot.name,
          distance: Spots.distance(spot, $rootScope.position),
          checkins: spot.checkins,
          latitude: parseFloat(spot.lat),
          longitude: parseFloat(spot.lng),
          icon: 'images/flags/'+spot.color+'_32.png',
        })
      })
       return markers
    }

    function formatMarkerInfo(spot) {
        content=  '<p><a ng-click="$navigate.go(\'/spots/'+spot.id+'\')">'+spot.name+'</a><br>'+spot.checkins+' recent checkins</p>'
        var templateScope = $scope.$new();
        var compiled = $compile(content.data)(templateScope);
        return compiled
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