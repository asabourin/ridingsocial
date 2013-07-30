angular.module('Services').factory('Push', function ($rootScope, User, CordovaReady) {
    
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
}