angular.module('app.services').factory('facebook', function ($rootScope, cordovaReady) {
    return {

        init: cordovaReady(function (onSuccess, onError, options) {
            FB.init({ appId: "290983157607960", nativeInterface: CDV.FB, useCachedDialogs: false });
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
                    case 'not_authorized' || 'unknown':
                        // 'not_authorized' || 'unknown': doesn't seem to work
                        FB.login(function (response) {
                            if (response.authResponse) {
                                $rootScope.$broadcast('fb_connected', {
                                    response:response,
                                    userNotAuthorized:true
                                });
                            } else {
                                $rootScope.$broadcast('fb_login_failed');
                            }
                        }, {scope:'email'});
                        break;
                    default:
                        FB.login(function (response) {
                            if (response.authResponse) {
                                $rootScope.$broadcast('fb_connected', {response:response});
                                $rootScope.$broadcast('fb_get_login_status');
                            } else {
                                $rootScope.$broadcast('fb_login_failed');
                            }
                        }, {scope:'email'});
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

})