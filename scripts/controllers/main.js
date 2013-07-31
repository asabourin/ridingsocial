angular.module('App')

/* Main */
.controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
      $rootScope.position = args.position;
      Spots.refreshNearby(args.position);
      updateMap(args.position);
      if($rootScope.activeTab == 'loading') {
        $rootScope.activeTab = 'map';
      }
    });

    $rootScope.$on("locationTimeout", function (event, args) {
      navigator.notification.alert(Lang.en.error_location, null, Lang.en.error);
      $rootScope.loading = false;
    });

    $rootScope.$on("nearbySpotsUpdated", function(event, args) {
      $rootScope.loading = false;
      Spots.checkNearest();
    });

    $rootScope.$on("newNearestSpot", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", "Yeah!, Not now");
    });
    
    $scope.$watch('map.bounds', function(oldVal, newVal){ 
        if($scope.map.bounds.northeast !== undefined) {
          Spots.fetchWithinBounds(bufferBounds($scope.map.bounds));
        }
    }, true);

    $rootScope.$on("spotsWithinBoundsUpdated", function (event, args) {
      $scope.map.markers = buildSpotsMarkers(args.withinBounds.spots);
    });

    $rootScope.$on('receivedPushNotification', function(event, args) {
      User.checkNewNotifications(function(response) {
        $rootScope.newNotifications = response;
      });
    });

    $rootScope.$on('appResumed', function(event, args) {
      refresh();
    }) ;

    // Init

    $navigate.eraseHistory();
    google.maps.visualRefresh = true;

    if($rootScope.position === undefined) { // On app start
      $rootScope.activeTab = 'loading';
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
      });
      $rootScope.newNotifications = {};
      refresh();
    }

    // Functions

    $scope.toggleTab = function(tab) {
        if($rootScope.activeTab === tab) {
          $rootScope.activeTab = 'map';
        }
        else {
          $rootScope.activeTab = tab;
        }
    };

    $scope.goToSpot = function(id) {
      $navigate.go('/spots/'+id, 'none');
    };

    $scope.refresh = function() { refresh(); };

    function refresh() {
      $rootScope.loading =true;
      User.checkNewNotifications(function(response) {
        $rootScope.newNotifications = response;
      });
      CordovaReady(Geolocation.getPosition());
      $rootScope.map.zoom = 13;
    }

    function wannaCheckin(index) {
        if(index === 1) {
            $navigate.go('/checkin', 'pop');
        }
        $scope.$apply();
    }

    function updateMap(position) {
      $rootScope.myPosition = {
        id: 'me',
        latitude: parseFloat(position.latitude),
        longitude: parseFloat(position.longitude)
      };
      $rootScope.map.center.latitude = position.latitude;
      $rootScope.map.center.longitude = position.longitude;
    }

    function buildSpotsMarkers(spots) {
       var markers = [];
       _.each(spots, function(spot) {
        markers.push( {
          id: spot.id,
          latitude: parseFloat(spot.lat),
          longitude: parseFloat(spot.lng),
          icon: 'images/flags/'+spot.color+'_32.png'
        });
      });
       return markers;
    }
    
    function bufferBounds(bounds) {
        var min_lat = ( bounds.southwest.latitude - Math.abs(bounds.southwest.latitude) * 0.01 ).toFixed(6);
        var min_lng = ( bounds.southwest.longitude - Math.abs(bounds.southwest.longitude) * 0.01 ).toFixed(6);
        var max_lat = ( bounds.northeast.latitude + Math.abs(bounds.northeast.latitude) * 0.01 ).toFixed(6);
        var max_lng = ( bounds.northeast.longitude + Math.abs(bounds.northeast.longitude) * 0.01 ).toFixed(6);
        return {min_lat: min_lat, max_lat: max_lat, min_lng: min_lng, max_lng: max_lng};
    }
    
})

/* Followed Riders */
.controller('FollowedRiders', function(User, Sessions, Spots, $scope, $rootScope, $navigate) {

  // Init

  $rootScope.loading = true;
  User.updateCheckedAt('followed_riders');
  $rootScope.newNotifications.followed_riders = 0;

  Sessions.followed(User.token(), function(response) {
    $rootScope.followed_sessions = response;
    $rootScope.loading = false;
    if($rootScope.position !== undefined) {
      computeSessionsDistances($rootScope.followed_sessions);
    }
  });

  // Functions

  function computeSessionsDistances(sessions) {
    _.each(sessions, function(s) {
        s.distance = Spots.distance(s.spot, $rootScope.position);
    });
  }

})

/* Watched Spots */
.controller('WatchedSpots', function(User, Sessions, Spots, $scope, $rootScope, $navigate) {

  // Init

  $rootScope.loading = true;
  User.updateCheckedAt('watched_spots');
  $rootScope.newNotifications.watched_spots = 0;
  
  Spots.watched(User.token(), function(response) {
    $rootScope.watched_spots = response;
    $rootScope.loading = false;
    if($rootScope.position !== undefined) {
      computeWatchedDistances($rootScope.watched_spots);
    }
  });

  // Functions

  function computeWatchedDistances(spots) {
    _.each(spots, function(s) {
        s.distance = Spots.distance(s, $rootScope.position);
    });
  }
    
})

/* Notifications */
.controller('Notifications', function(User, $scope, $rootScope, $navigate) {

  // Init

  $rootScope.loading = true;
  User.updateCheckedAt('notifications');
  $rootScope.newNotifications.notifications = 0;

  User.notifications(function(response) {
    $rootScope.notifications = response;
    $rootScope.loading = false;
  });

});