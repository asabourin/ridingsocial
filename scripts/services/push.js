angular.module('Services').factory('Push', function ($rootScope, $http) {
    return {

        successHandler: function(result) {
            console.log("result "+result)
        },
        errorHandler: function (error) {
            console.log(error)
        },
        tokenHandler: function(result) {
            // Your iOS push server needs to know the token before it can push to this device
            // here is where you might want to send it the token for later use.
            console.log(result)
        },
        // iOS
        onNotificationIOS: function(event) {
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
        },
        // Android
        onNotificationAndroid: function(e) {

            switch( e.event )
            {
                case 'registered':
                if ( e.regid.length > 0 )
                {
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    alert("regID = " + e.regid);
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

    };

})

function onNotificationGCM(e) {
    var injector = angular.injector(['ng', 'App']);
    injector.invoke(['Push', function(Push){
        Push.onNotificationAndroid(e)
    }]);
}

function onNotificationAPN(event) {
    var injector = angular.injector(['ng', 'App']);
    injector.invoke(['Push', function(Push){
        Push.onNotificationIOS(event)
    }]);
}


 