angular.module('App')

//
.controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
        updateMap(args.position)
        $rootScope.position = args.position
        
        if($rootScope.activeTab == 'loading') {
          $rootScope.activeTab = 'map'
        }
        $rootScope.loading = false
    });

    $rootScope.$on("locationTimeout", function (event, args) {
      navigator.notification.alert(Lang.en.error_location, null, Lang.en.error)
      $rootScope.loading = false
    })

    $rootScope.$on("nearbySpotsUpdated", function(event, args) {
      $rootScope.loading = false
      Spots.checkNearest()
    })

    $rootScope.$on("newNearestSpot", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", "Yeah!, Not now");
    })

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

    $rootScope.$on('receivedPushNotification', function(event, args) {
      User.checkNewNotifications(function(response) {
        $rootScope.newNotifications = response
      })
    }) 

    $rootScope.$on('appResumed', function(event, args) {
      refresh()
    }) 

    // Init

    $rootScope.activeTab = $rootScope.activeTab || 'loading'
    $navigate.eraseHistory()
    google.maps.visualRefresh = true;

    if($rootScope.position == undefined) { // On app start
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
      $rootScope.newNotifications = new Object()
      refresh()
    }

    // Functions

    $scope.toggleTab = function(tab) {
        if($rootScope.activeTab == tab) {
          $rootScope.activeTab = 'map'
        }
        else {
          $rootScope.activeTab = tab
        }
    }

    $scope.refresh = function() { refresh() }

    function refresh() {
      $rootScope.loading =true
      User.checkNewNotifications(function(response) {
        $rootScope.newNotifications = response
      })
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
          showWindow: false,
          alert: function() {alert('hello'); $scope.$apply()},
          closeClick: function() {this.showWindow = false; $scope.$apply()},
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
    
})

//
.controller('FollowedRiders', function(User, Sessions, Spots, $scope, $rootScope, $navigate) {

  $rootScope.loading = true

  User.updateLastCheckAt('followed_riders')
  $rootScope.newNotifications.followed_riders = 0

  Sessions.followed(User.token(), function(response) {
      $rootScope.followed_sessions = response
      if($rootScope.position != undefined) {
        computeSessionsDistances($rootScope.followed_sessions)
      }
      $rootScope.loading = false
  })

  //

  function computeSessionsDistances(sessions) {
    _.each(sessions, function(s) {
          s.distance = Spots.distance(s.spot, $rootScope.position)
      })
  }

})

//
.controller('WatchedSpots', function(User, Sessions, Spots, $scope, $rootScope, $navigate) {

  $rootScope.loading = true

  User.updateLastCheckAt('watched_spots')
  $rootScope.newNotifications.watched_spots = 0
  
  Spots.watched(User.token(), function(response) {
      $rootScope.watched_spots = response
      if($rootScope.position != undefined) {
        computeWatchedDistances($rootScope.watched_spots)
      }
      $rootScope.loading = false
  })


  function computeWatchedDistances(spots) {
    _.each(spots, function(s) {
          s.distance = Spots.distance(s, $rootScope.position)
      })
  }
    
})

//
.controller('Notifications', function(User, $scope, $rootScope, $navigate) {

  $rootScope.loading = true

  User.updateLastCheckAt('notifications')
  $rootScope.newNotifications.notifications = 0

  User.notifications(function(response) {
        $rootScope.notifications = response
        $rootScope.loading = false
    })

})