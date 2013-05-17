angular.module('Services').factory('Push', function ($rootScope, User, CordovaReady) {
    return {
        init: CordovaReady(function () {
            
            var pushSettings = JSON.parse(localStorage.getItem('pushSettings'));
            
            if(pushSettings == undefined) {
            var pushNotification = window.plugins.pushNotification;

                  if (device.platform == 'android' || device.platform == 'Android') {
                      pushNotification.register(onSuccessAndroid, onError, {"senderID":Settings.android_gcm_senderID,"ecb":"onNotificationGCM"});
                  } else {
                      pushNotification.register(onSuccessIOS, onError, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
                  }
            }
            else {
                console.log("push settings: "+pushSettings)
                User.registerDevice(pushSettings, function(response){console.log('Device registered on backend')}, function(response) {console.log(response)})
            }
            


        }),

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
                    var push = {}
                    push.platform = 'android'
                    push.token = e.regid
                    localStorage.setItem('pushSettings', JSON.stringify(push))
                    User.registerDevice(push, function(response){console.log('Device registered on backend')}, function(response) {console.log(response)})
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
    }

        function onSuccessAndroid(result) {
            console.log("result "+result)
        }
        function onError(error) {
            console.log(error)
        }
        function onSuccessIOS(result) {
            // Your iOS push server needs to know the token before it can push to this device
            // here is where you might want to send it the token for later use.
            var push = {}
            push.platform = 'ios'
            push.token = result.token       
            localStorage.setItem('pushSettings', JSON.stringify(push))
            User.registerDevice(push, function(response){console.log('Device registered on backend')}, function(response) {alert(response)})
        }

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



 