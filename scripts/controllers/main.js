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

    $scope.$watch('map.bounds', function(oldVal, newVal){ 
      if(angular.isDefined($scope.map.bounds.getNorthEast)) {
        Spots.fetchWithinBounds(bufferBounds($scope.map.bounds))
      }
    }, true)

    $rootScope.$on("spotsWithinBoundsUpdated", function (event, args) {
      $scope.map.spots = args.withinBounds.spots
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

    $rootScope.map = {
        center: new google.maps.LatLng(0, 0),
        bounds: {},
        markers: [],
        zoom: 12
      }

      $scope.$watch('map.zoom', function() {
        console.log($rootScope.map.zoom)
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
      $rootScope.map.zoom = 12
    }

    function wannaCheckin(index) {
        if(index == 1) {
            $navigate.go('/checkin', 'pop')
        }
        $scope.$apply()
    }

    function updateMap(position) {
      $rootScope.map.me = [{
        id: 'me',
        lat: parseFloat(position.latitude),
        lng: parseFloat(position.longitude)
      }]
      $rootScope.map.center = new google.maps.LatLng(position.latitude, position.longitude);
    }

    $scope.getSpotOpts = function(spot) {
     return angular.extend(
       { title: spot.name,
         icon: 'images/flags/'+spot.color+'_32.png',
        },
       $scope.map.spots
      );
    };

    function bufferBounds(bounds) {
        var ne = bounds.getNorthEast()
        var sw = bounds.getSouthWest()
        var min_lat = ( sw.lat()-Math.abs(sw.lat())*0.01 ).toFixed(6)
        var min_lng = ( sw.lng()-Math.abs(sw.lng())*0.01 ).toFixed(6)
        var max_lat = ( ne.lat()+Math.abs(ne.lat())*0.01 ).toFixed(6)
        var max_lng = ( ne.lng()+Math.abs(ne.lng())*0.01 ).toFixed(6)
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