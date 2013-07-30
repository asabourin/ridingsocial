angular.module('Services').factory('Facebook', function ($rootScope, CordovaReady) {
    
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

});