'use strict';

var Settings = {

  host: 'http://freesab.local:3000/api/',
  coeff: 0.01,
  radius: 15,
  checkin_distance: 12

}

var Lang = {
  en: {
    'checkin_successful': 'Check-in successful!',
    'error_checkin': 'Oops...'
  }
}

angular.module('Services', []);

angular.module('App', ['Services', 'ui.bootstrap'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html',
        controller: 'MainController'
      })
      .when('/nearby', {
        templateUrl: 'views/spots/nearby.html',
        controller: 'Spots.nearby'
      })
      .when('/map', {
        templateUrl: 'views/spots/map.html',
        controller: 'Spots.map'
      })
      .when('/sessions', {
        templateUrl: 'views/sessions.html',
        controller: 'Sessions.followed'
      })
      .when('/checkin', {
        templateUrl: 'views/checkins/new.html',
        controller: 'Checkin'
      })
      .when('/riders/:id', {
        templateUrl: 'views/riders/show.html',
        controller: 'RidersController'
      })
      .when('/spots/:id', {
        templateUrl: 'views/spot.html',
        controller: 'Spots.show'
      })
      .when('/checkins/:id', {
        templateUrl: 'views/checkin.html',
        controller: 'CheckinsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  

  // Hide splash screen on CordovaReady event
  document.addEventListener("deviceready", onDeviceReady, false);

  // Cordova is ready
  //
  function onDeviceReady() {

      setTimeout(function() {
          navigator.splashscreen.hide();
      }, 600);

      

  }

  // result contains any message sent from the plugin call
function pushSuccessHandler (result) {
    console.log("result "+result)
}

// result contains any error description text returned from the plugin call
function pushErrorHandler (error) {
    console.log(error)
}

function pushTokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    console.log(result)
}

// iOS
function onNotificationAPN(event) {
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }

    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, event.badge);
    }
}


// Android
        function onNotificationGCM(e) {
            alert('EVENT -> RECEIVED:' + e.event);

            switch( e.event )
            {
                case 'registered':
                if ( e.regid.length > 0 )
                {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    console.log("regID = " + e.regID);
                }
                break;

                case 'message':
                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    if (e.foreground)
                    {
                        console.log('INLINE NOTIFICATION--' + e.soundname);
                    }
                    else
                    {   // otherwise we were launched because the user touched a notification in the notification tray.
                        if (e.coldstart)
                            console.log('COLDSTART NOTIFICATION--');
                        else
                        console.log('BACKGROUND NOTIFICATION--');
                    }

                    console.log('MESSAGE -> MSG: ' + e.payload.message);
                    console.log('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);
                break;

                case 'error':
                    console.log('ERROR -> MSG:' + e.msg);
                break;

                default:
                    console.log('EVENT -> Unknown, an event was received and we do not know what it is');
                break;
            }
        }