angular.module('Services', []);

angular.module('App', ['Services', 'ui.bootstrap', 'google-maps', 'ajoslin.mobile-navigate'])

  .config(function ($routeProvider) {

    "use strict";

    $routeProvider
      .when('/', {
        controller: 'StartController'
      })
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartController'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/checkin', {
        templateUrl: 'views/checkin.html',
        controller: 'Checkin'
      })
      .when('/riders/:id', {
        templateUrl: 'views/rider.html',
        controller: 'Riders.show'
      })
      .when('/spots/:id', {
        templateUrl: 'views/spot.html',
        controller: 'Spots.show'
      })
      .when('/sessions/:id', {
        templateUrl: 'views/session.html',
        controller: 'SessionsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($templateCache,$http){
      $http.get('views/main.html', {cache:$templateCache});
      $http.get('views/checkin.html', {cache:$templateCache});
      $http.get('views/rider.html', {cache:$templateCache});
});

//For external callbacks that need to access Angular app
var injector;
angular.element(document).ready(function() {
  injector = angular.bootstrap(document, ['App']);
});

// Forward app resumed event to angular
document.addEventListener("resume", function() {
  var scope = angular.element(document).scope();
  scope.$apply(scope.$broadcast('appResumed'));
}, false);;angular.module('App')

.controller('Checkin', function($rootScope, $scope, $route, $navigate, User, Riders, Checkin, Spots) {

  // Init

  $scope.loading = true;
  $scope.checkin = {};
  $scope.selected_riders = [];
  $scope.spot = Spots.checkinAt();
  User.fetchFollowedRiders(function(response){
    $scope.followed_riders = response;
  });

  // Events

  var pageTransitionListener = $scope.$on('$pageTransitionSuccess', function() { //Delaying the clal to camera after CSS page transition is done
    takePicture();
  });

  $scope.$watch('activity', function() {  
    $scope.submitEnabled = validate();
  });

  $scope.$watch('rating', function() {  
    $scope.submitEnabled = validate();
  });

  // Scope functions

  $scope.addRider = function() {
    var rider = _.find($scope.followed_riders, function(r){ return (r.name == $scope.selected); });
    if(rider !== undefined) {
      $scope.selected_riders.push(rider);
      // Removing from list to choose from
      $scope.followed_riders = _.reject($scope.followed_riders, function(r) {return (r.id == rider.id);});
      $scope.selected = '';
    }
  };

  $scope.removeRider = function(id) {
    var rider = _.find($scope.selected_riders, function(r){ return (r.id == id); });
    $scope.followed_riders.push(rider); //Putting back rider in list of followed
    $scope.selected_riders = _.reject($scope.selected_riders, function(r) {return (r.id == id);});
  };

  $scope.submit = function() {

    $scope.loading = true;
    $scope.submitDisabled = true;
    
    var checkin = {
      spot_id: $scope.spot.id,
      activity: $scope.activity,
      rating: $scope.rating,
      comment: $scope.comment,
      riders_ids: _.map($scope.selected_riders, function(r) {return r.id;})
    };

    var options = new FileUploadOptions();
    options.params = checkin;

    Checkin.create(User.token(), $scope.picture_src, options, checkinSuccessful, function(result){
      navigator.notification.alert(JSON.stringify(result), errorCheckin, Lang.en.checkin_error);
    });

  };

  // Functions
  
  function takePicture() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        pageTransitionListener(); // Turn off event listener so it does not trigger camera later, see top of this file
        $scope.loading = false;
        $scope.$apply();
      }, 
      function(message) {
          console.log(message);
          pageTransitionListener(); // Turn off event listener
          $scope.loading = false;
          $scope.$apply();
      },
      { quality: 100, allow_edit:true, targetWidth: 1600, targetHeight: 1200, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });
  }

  function checkinSuccessful(response) {
    User.setLastCheckinAt(Date.now());
    $scope.loading = false;
    navigator.notification.alert(response.message, goBack, Lang.en.checkin_successful);
  }

  function validate() {
    return ($scope.spot !== undefined && $scope.rating !== undefined && $scope.activity !== undefined);
  }

  function goBack() {
    $navigate.back();
    $scope.$apply();
  }

});;angular.module('App')

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
      Geolocation.resetPosition();
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

});; angular.module('App').controller('MenuController', function(User, Geolocation, $scope, $rootScope, $navigate) {

    $scope.preferences = User.getPreferences();

    $rootScope.openMenu = function () {
      $scope.menuOpen = true;
    };

    $rootScope.closeMenu = function () {
      $scope.menuOpen = false;
    };

    $scope.updatePreferences = function() {
      User.updatePreferences({notify: $scope.preferences.notify});
    };

    $rootScope.optsMenu = {
      backdropFade: false,
      dialogFade:false,
      backdropClick: false
    };

    $scope.goToDesktopSite = function () {
      window.open('http://www.ridingsocial.net', '_system', 'location=yes');
    };

    $scope.logout = function() {logout();};

    function logout() {
        $scope.menuOpen = false;
        Geolocation.resetPosition();
        User.logout();
        $navigate.go('/start', 'fade');
    }

});;angular.module('App')
// This one is just to enable mobile-navigate
.controller('NavController', function($scope, $rootScope, $location, $navigate) {
  $rootScope.navigate = $navigate;
});
;angular.module('App')
  
  .controller('Riders.show', function(User, Riders, Spots, $scope, $rootScope, $routeParams) {

    Riders.show(User.token(), $routeParams.id, function(response) {
        $scope.rider = response;
        $scope.tab = 'sessions';
    });

    Riders.sessions(User.token(), $routeParams.id, function(response) {
        $scope.sessions = response;
        _.each($scope.sessions, function(s) {
            s.distance = Spots.distance(s.spot, $rootScope.position);
        });
    });

    Riders.spots(User.token(), $routeParams.id, function(response) {
        $scope.rider_spots = _.sortBy(response, function(s){return -s.nb_sessions;});
    });

    // Functions

    $scope.follow = function() {
        navigator.notification.confirm("Follow "+$scope.rider.name+"?", follow, "", ["Yes", "Cancel"]);
    };

    function follow(index) {
        if(index == 1) {
            Riders.follow(User.token(), $scope.rider.id, function(response) {
                $scope.rider.following = true;
                $scope.rider.nb_followers += 1;
            });
            $scope.$apply();
        }
    }

    $scope.unfollow = function() {
        navigator.notification.confirm("Are you sure?", stopFollowing, "Stop following "+$scope.rider.name, ["Yes", "Cancel"]);
    };

    function stopFollowing(index) {
        if(index == 1) {
            Riders.unfollow(User.token(), $scope.rider.id, function(response) {
                $scope.rider.following = false;
                $scope.rider.nb_followers -= 1;
            });
            $scope.$apply();
        }
    }

});
;angular.module('App')
  .controller('SessionController', function(Sessions, User, Spots, $scope, $rootScope) {

    $scope.showOthers = function (session_id) {
      $rootScope.this_session = $scope.session;
      $rootScope.othersOpen = true;
    };

    $rootScope.hideOthers = function () {
      $rootScope.othersOpen = false;
    };

    $scope.toggleLikeSession = function() {
      if($scope.session.liked) {
        Sessions.unlike(User.token(), $scope.session.id, function(response) {
          $scope.session.liked = false;
          $scope.session.nb_likes -= 1;
        });
      }
      else {
        Sessions.like(User.token(), $scope.session.id, function(response) {
          $scope.session.liked = true;
          $scope.session.nb_likes += 1;
        });
      }
    };

    $scope.showComments = function () {
      $rootScope.session = $scope.session;
      Sessions.comments($scope.session.id, function(response) {
        $rootScope.comments = response;
      });
      Sessions.likes($scope.session.id, function(response) {
        $rootScope.likes = response;
      });
      $rootScope.commentsOpen = true;
    };

    $scope.hideComments = function () {
      $rootScope.comments = [];
      $rootScope.session = null;
      $rootScope.commentsOpen = false;
    };

    $scope.postComment = function(session_id) {
      if($scope.reply && !$scope.posting_comment) {
        $scope.post_comment_loading = true;
        Sessions.postComment(User.token(), session_id, $scope.reply, function(response){
          $rootScope.comments.push(response);
          $scope.posting_comment = false;
          $scope.reply = '';
        });
      }
    };

});
;angular.module('App')
  
.controller('Spots.show', function(User, Spots, Riders, $scope, $rootScope, $routeParams, $navigate) {

    $scope.tab = 'sessions';
    $scope.checkinAllowed = false;

    Spots.show(User.token(), $routeParams.id, function(response) {
        $scope.spot = response;
        $scope.spot.distance = Spots.distance(response, $rootScope.position);
        $scope.checkinAllowed = $scope.spot.distance <= Settings.radius;
        $scope.spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+$scope.spot.lat+","+$scope.spot.lng+"&zoom=16&size=100x120&maptype=satellite&sensor=true&markers=icon:http://ridingsocial.net/images/flags/"+$scope.spot.color+"_32.png%7C"+$scope.spot.lat+","+$scope.spot.lng+"";
    });

    Spots.sessions(User.token(), $routeParams.id, function(response) {
        $scope.sessions = response;
    });

    Spots.riders(User.token(), $routeParams.id, function(response) {
        $scope.riders = response;
    });

    // Functions

    $scope.showSpotOnMap = function() {
        $rootScope.map.center.latitude = $scope.spot.lat;
        $rootScope.map.center.longitude = $scope.spot.lng;
        $rootScope.activeTab = 'map';
        $rootScope.map.zoom = 17;
        $navigate.go('/main');
    };

    $scope.checkinHere = function() {
        if($scope.spot.distance < Settings.radius) {
            Spots.setCheckinAt($scope.spot);
            $navigate.go('/checkin', 'pop');
        }
    };

    $scope.watch = function() {
        navigator.notification.confirm("Watch "+$scope.spot.name+"?", watch, "", ["Yes", "Cancel"]);
    };

    function watch(index) {
        if(index == 1) {
            Riders.watch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.watched = true;
            });
            $scope.$apply();
        }
    }

    $scope.unwatch = function() {
        navigator.notification.confirm("Are you sure?", unwatch, "Stop watching "+$scope.spot.name+"", ["Yes", "Cancel"]);
    };

    function unwatch(index) {
        if(index == 1) {
            Riders.unwatch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.watched = false;
            });
            $scope.$apply();
        }
    }

  });
;angular.module('App')

.controller('StartController', function(Push, Facebook, User, $scope, $rootScope, $location, $navigate) {

  // Events

  $scope.$on("fb_connected", function (event, args) {

    $scope.loading = true;
    $scope.showFacebook = false;

    User.login(args.response.authResponse.accessToken, function(response) {$scope.$broadcast('rs_connected');}, function(response) {
      console.log(response);
      $scope.loading = false;
      $scope.showFacebook = true;
    });

  });

  $scope.$on("fb_login_failed", function (event, args) {
    console.log(args.response);
    $scope.loading = false;
    $scope.showFacebook = true;
  });

  $scope.$on("rs_login_failed", function(event, args) {
    console.log(args.response);
    User.logout();
    $scope.loading =false;
    $scope.showFacebook = true;
  });

  $scope.$on("rs_connected", function (event, args) {
    $rootScope.user = User.get();
    Push.init();
    $navigate.go('/main', 'fade');
  });

  $scope.$on("pushRegistered", function (event, args) {
    User.registerDevice(args.settings, function(response){
    }, function(response) {
        console.log("Could not save Push Notification settings on backend: "+response, null, Lang.en.error);
      });
  });

  // Init

  if(User.token() !== undefined) {
    $scope.$broadcast('rs_connected');
  }
  else{
    $navigate.go('/start');
    Facebook.init();
    $scope.loading =false;
    $scope.showFacebook = true;
  }
  
  // Button functions

  $scope.login = function () {
      Facebook.login();
  };

});;//Fastclick
angular.module('App').directive("ngTap", function() {
  return function($scope, $element, $attributes) {
    var tapped = false;
    $element.bind("touchstart", function(event) {
      tapped = true;
      return true;
    });
    $element.bind("touchmove", function(event) {
      tapped = false;
      return event.stopImmediatePropagation();
    });
    return $element.bind("touchend", function() {
      if (tapped) {
        return $scope.$apply($attributes.ngTap);
      }
    });
  };
});

// Timeago filter using Moment.js
angular.module('App').filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  };
});;angular.module('Services').factory('Checkin', function ($rootScope, $http) {

    var transform = function(data){
        return $.param(data);
    };

    return {

        create:function(token, pictureURI, options, successCallback, errorCallback) {
            if(pictureURI !== undefined) {
                var ft = new FileTransfer();
                ft.upload(pictureURI, encodeURI(Settings.host+'checkins/create?token='+token), function(result) {
                    response = JSON.parse(result.response); // Cause server response is stringified inside result
                    successCallback(response);
                }, errorCallback, options);
            }
            else {
                // Ugly fix cause angular sends POST data as JSON in the body instead of params payload
                var payload = "spot_id="+options.params.spot_id+"&activity="+options.params.activity+"&rating="+options.params.rating;
                if(options.params.comment !== undefined) {payload += "&comment="+options.params.comment;}
                if(options.params.riders_ids !== undefined) {
                    payload += "&riders_ids=["+options.params.riders_ids+"]";
                }
                $http.post(Settings.host+'checkins/create?token='+token,  payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform}).success(successCallback).error(errorCallback);
            }
        }
    };

});;angular.module('Services').factory('CordovaReady', function() {
  return function (fn) {
  
    var queue = [];
    
    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };
    
    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);
    
    return function () {
      return impl.apply(this, arguments);
    };
  };
});;angular.module('Services').factory('Facebook', function ($rootScope, CordovaReady) {
    
    return {

        init: CordovaReady(function (onSuccess, onError, options) {
            FB.init({ appId: Settings.facebook_app_ID, nativeInterface: CDV.FB, useCachedDialogs: false });
        }),

        getLoginStatus:function () {
            FB.getLoginStatus(function (response) {
                $rootScope.$broadcast("fb_statusChange", {'status':response.status});
            }, true);
        },

        login:function () {
            FB.getLoginStatus(function (response) {
                switch (response.status) {
                    case 'connected':
                        
                        $rootScope.$broadcast('fb_connected', {response:response});
                        break;
                    default:
                        FB.login(function (response) {
                            if (response.authResponse) {
                                $rootScope.$broadcast('fb_connected', {response:response});
                            } else {
                                $rootScope.$broadcast('fb_login_failed');
                            }
                        }, {scope: Settings.facebook_permissions});
                        break;
                }
            }, true);
        },

        logout:function () {
            FB.logout(function (response) {
                if (response) {
                    $rootScope.$broadcast('fb_logout_succeded');
                } else {
                    $rootScope.$broadcast('fb_logout_failed');
                }
            });
        },

        unsubscribe:function () {
            FB.api("/me/permissions", "DELETE", function (response) {
                $rootScope.$broadcast('fb_get_login_status');
            });
        }
    };

});;angular.module('Services').factory('Geolocation', function ($rootScope) {

  var lastPosition;

  function onPositionReceived(position) {
    if(hasPositionChanged(position.coords)) {
        lastPosition = position.coords;
        $rootScope.$broadcast('positionUpdated', {position:position.coords});
        $rootScope.$apply();
    } 
  }

  function hasPositionChanged(newPosition) {
    return (lastPosition === undefined || Math.abs(lastPosition.latitude - newPosition.latitude) > 0.001 || Math.abs(lastPosition.longitude - newPosition.longitude) > 0.001);
  }

  //

  return {

    getPosition: function() {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          onPositionReceived(position);
        }, 
        function(error) {
          $rootScope.$broadcast('locationTimeout');
        }, 
        {maximumAge: 1000, timeout: Settings.geoloc_timeout, enableHighAccuracy: true}
      );
       
    },

    resetPosition: function() {
      lastPosition = undefined;
      $rootScope.position = undefined;
    }

  };

});;angular.module('Services').factory('Push', function ($rootScope, User, CordovaReady) {
    
    function onSuccessAndroid(result) {
        console.log("Android device registered for push notifications "+result);
    }
    function onSuccessIOS(result) {
        var settings = {platform: 'ios', token: result.token}  ;
        $rootScope.$broadcast('pushRegistered', {settings: settings}) ;
    }
    function onError(error) {
        console.log("Registration for push notifications failed: "+error);
    }

    return {
        init: CordovaReady(function () {
            var pushNotification = window.plugins.pushNotification;
            if (device.platform == 'android' || device.platform == 'Android') {
                pushNotification.register(onSuccessAndroid, onError, {"senderID":Settings.android_gcm_senderID,"ecb":"onNotificationGCM"});
            } else {
                pushNotification.register(onSuccessIOS, onError, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
            }

        }),

        onNotificationIOS: function(event) {
            if (event.alert) {
                $rootScope.$broadcast('receivedPushNotification', {message:event.alert});
            }
        },

        onNotificationAndroid: function(e) {
            switch( e.event )
            {
                case 'registered':
                if ( e.regid.length > 0 )
                {
                    var settings = {platform: 'android', token: e.regid};
                    $rootScope.$broadcast('pushRegistered', {settings: settings});
                }
                break;

                case 'message':
                    if (e.foreground)
                    {
                        $rootScope.$broadcast('receivedPushNotification', {message:e.payload.message});
                    }
                    else
                    {  
                        if (e.coldstart)
                            console.log('Android Notification: COLDSTART');
                        else
                        console.log('Android Notification: BACKGROUND');
                    }

                break;

                case 'error':
                    console.log('Android Notification: ERROR -> MSG:' + e.msg);
                break;

                default:
                    console.log('Android Notification: EVENT -> Unknown, an event was received and we do not know what it is');
                break;
            }
        }
    };

    

});

// Forwarding external calls to this Angular service when receiving a Push Notification

function onNotificationGCM(e) {
    injector.invoke(['Push', function(Push){
        Push.onNotificationAndroid(e);
    }]);
}

function onNotificationAPN(event) {
    injector.invoke(['Push', function(Push){
        Push.onNotificationIOS(event);
    }]);
};angular.module('Services').factory('Riders', function ($rootScope, $http) {
    return {

        show: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'?token='+token).success(successCallback).error(errorCallback);
        },
        sessions: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/sessions?token='+token).success(successCallback).error(errorCallback);
        },
        followers: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/followers?token='+token).success(successCallback).error(errorCallback);
        },
        spots: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/spots?token='+token).success(successCallback).error(errorCallback);
        },
        follow: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/follow?token='+token).success(successCallback).error(errorCallback);
        },
        unfollow: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'riders/'+id+'/unfollow?token='+token).success(successCallback).error(errorCallback);
        },
        watch: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/watch?token='+token).success(successCallback).error(errorCallback);
        },
        unwatch: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'spots/'+id+'/unwatch?token='+token).success(successCallback).error(errorCallback);
        }
    };

});;angular.module('Services').factory('Sessions', function ($rootScope, $http) {

    return {

        followed: function(token, successCallback) {
            $http.get(Settings.host+'checkins/followed?token='+token).success(successCallback).error(function(response){
                console.log(response);
             });
        },

        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id).success(successCallback).error(errorCallback);
        },
        like: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'checkins/'+id+'/like?token='+token).success(successCallback).error(errorCallback);
        },
        unlike: function(token, id, successCallback, errorCallback) {
            $http.get(Settings.host+'checkins/'+id+'/unlike?token='+token).success(successCallback).error(errorCallback);
        },
        comments: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id+'/comments').success(successCallback).error(errorCallback);
        },
        likes: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id+'/likes').success(successCallback).error(errorCallback);
        },
        postComment: function(token, id, text, successCallback, errorCallback) {
            $http.post(Settings.host+'checkins/'+id+'/comments?token='+token, "text="+text, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
        }
    };

});;angular.module('Services').factory('Spots', function ($rootScope, $http) {

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

});;angular.module('Services').factory('User', function ($rootScope, $http) {

    "use strict";

    // Init
    var id, token, lastCheckinAt, preferences, checkedAt;

    loadSavedUser();
    loadSavedPreferences();
    loadSavedCheckedAt();

    //

    function loadSavedUser() {
      var persistedUser = JSON.parse(localStorage.getItem('user'));
      if(persistedUser !== null) {
        id = persistedUser.id;
        token = persistedUser.token;
      }
    }

    function loadSavedPreferences() {
      var savedPreferences = JSON.parse(localStorage.getItem('preferences'));
      if(savedPreferences !== null) {
          preferences = savedPreferences;
      }
      else {
        preferences = new Object({notify: true});
      }
    }

    function loadSavedCheckedAt() {
      var savedCheckedAt = JSON.parse(localStorage.getItem('checkedAt'));
      if(savedCheckedAt !== null) {
          checkedAt = savedCheckedAt;
      }
      else {
        checkedAt = new Object({'followed_riders': timestamp(), 'watched_spots': timestamp(), 'notifications': timestamp()});
      }
    }

    function savePreferences() {
        localStorage.setItem('preferences', JSON.stringify(preferences));
        var payload = "notify="+preferences.notify;
        $http.post(Settings.host+'preferences?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
    }

    function saveCheckedAt() {
        localStorage.setItem('checkedAt', JSON.stringify(checkedAt));
    }

    function persistUser() {
        var user = {id: id, token:token, lastCheckinAt:lastCheckinAt};
        localStorage.setItem('user', JSON.stringify(user));
    }

    function timestamp() {
        return Math.round(new Date().getTime() / 1000);
    }

    //

    return {

        token: function() {
            return token;
        },

        get: function() {
            return {id: id, token:token, lastCheckinAt:lastCheckinAt};
        },

        fetchFollowedRiders: function(successCallback) {
            $http.get(Settings.host+'riders/followed?token='+token).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        login:function (accessToken) {
            $http.get(Settings.host+'login?facebook_token='+accessToken).success(function(response) {
                id = response.id;
                token = response.token;
                persistUser();
                $rootScope.$broadcast('rs_connected');
            }).error(function(response){
                $rootScope.$broadcast('rs_login_failed', {response:response});
            });
            var phase = $rootScope.$$phase;
            if(phase === '$apply' || phase === '$digest'){}
            else {$rootScope.$apply();}
        },

        registerDevice:function (settings, successCallback, errorCallback) {

            if(token !== undefined) {
                var payload = "platform="+settings.platform+"&device_token="+settings.token;
                $http.post(Settings.host+'register?token='+token, payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(errorCallback);
            }
            else {
                errorCallback('No user token');
            }
        },

        setLastCheckinAt: function(time) {
            lastCheckinAt = time;
        },

        updateCheckedAt: function(what) {
            checkedAt[what] = timestamp();
            saveCheckedAt();
        },

        checkedAt: function(what) {
            return checkedAt[what];
        },

        checkNewNotifications: function(successCallback) {
            var params ='last_check_notifications='+checkedAt.notifications+'&last_check_riders='+checkedAt.followed_riders+'&last_check_spots='+checkedAt.watched_spots;
            $http.get(Settings.host+'notifications/new_since?token='+token+'&'+params).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        updatePreferences: function(prefs) {
            preferences = prefs;
            savePreferences();
        },

        getPreferences: function() {
            return preferences;
        },

        notifications: function(successCallback) {
            $http.get(Settings.host+'notifications?token='+token).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        logout: function() {
            token = undefined;
            id = undefined;
            $rootScope.user = undefined;
            localStorage.clear();
        }

    };

});;/*exported Settings, Lang */

var Settings = {

  'host': 'http://www.ridingsocial.net/api/',
  //host: 'http://localhost:3000/api/',
  'coeff': 0.01,
  'radius': 3,
  'checkin_distance': 1,
  'android_gcm_senderID': '535845696743',
  'geoloc_timeout': 30000,
  'facebook_app_ID': '290983157607960',
  'facebook_permissions': 'email, user_location'
};

var Lang = {
  en: {
    'checkin_successful': 'Check-in successful!',
    'error_checkin': 'Oops...',
    'error_location': 'Could not get your location. Check you\'ve got GPS enabled and we\'ll try again!',
    'error': 'Oops...'
  }
};