angular.module('Services').factory('Notifications', function ($rootScope, $http) {

    "use strict";

    return {

    	liked: function(token, like_id, successCallback) {
            $http.post(Settings.host+'notifications/liked?token='+token, "like_id="+like_id, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(function(response) {
                console.log(response);
            });
        },

        commented: function(token, comment_id, successCallback) {
            $http.post(Settings.host+'notifications/commented?token='+token, "comment_id="+comment_id, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(successCallback).error(function(response) {
                console.log(response);
            });
        }

    }

});