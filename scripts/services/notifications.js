angular.module('Services').factory('Notifications', function ($rootScope, $http) {

    "use strict";

    return {

		liked: function(token, like_id) {
            $http.post(Settings.host+'notifications/liked?token='+token, "like_id="+like_id, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
        },

        commented: function(token, comment_id) {
            $http.post(Settings.host+'notifications/commented?token='+token, "comment_id="+comment_id, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
        },

        checkedin: function(token, session_id) {
            $http.post(Settings.host+'notifications/checkedin?token='+token, "session_id="+session_id, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});
        }

	};

});