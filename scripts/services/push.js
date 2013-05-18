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
        }),

        onNotificationIOS: function(event) {
            if (event.alert) {
                navigator.notification.alert(event.alert);
            }
            if (event.sound) {
            }
            if (event.badge) {
                pushNotification.setApplicationIconBadgeNumber(successHandler, event.badge);
            }
        },

        onNotificationAndroid: function(e) {
            switch( e.event )
            {
                case 'registered':
                if ( e.regid.length > 0 )
                {
                    var settings = {platform: 'android', token: e.regid}
                    $rootScope.$broadcast('pushRegistered', {settings: settings})
                }
                break;

                case 'message':
                    if (e.foreground)
                    {
                        console.log('Android Notification: INLINE NOTIFICATION');
                    }
                    else
                    {  
                        if (e.coldstart)
                            console.log('Android Notification: COLDSTART');
                        else
                        console.log('Android Notification: BACKGROUND');
                    }

                    alert('MESSAGE -> MSG: ' + e.payload.message);
                    alert('MESSAGE -> MSGCNT: ' + e.payload.msgcnt);

                break;

                case 'error':
                    console.log('Android Notification: ERROR -> MSG:' + e.msg);
                break;

                default:
                    console.log('Android Notification: EVENT -> Unknown, an event was received and we do not know what it is');
                break;
            }
        }
    }

    function onSuccessAndroid(result) {
        console.log("Android device registered for push notifications "+result)
    }
    function onError(error) {
        alert("Registration for push notifications failed: "+error)
    }
    function onSuccessIOS(result) {
        // Your iOS push server needs to know the token before it can push to this device
        // here is where you might want to send it the token for later use.
        var settings = {platform: 'ios', token: result.token}  
        $rootScope.$broadcast('pushRegistered', {settings: settings}) 
    }

})

function onNotificationGCM(e) {
    injector.invoke(['Push', function(Push){
        Push.onNotificationAndroid(e)
    }]);
}

function onNotificationAPN(event) {
    injector.invoke(['Push', function(Push){
        Push.onNotificationIOS(event)
    }]);
}



 