angular.module('Services').factory('Checkins', function ($rootScope, $http) {
    return {

        followed:function (token, successCallback) {
            $http.get(Settings.host+'checkins/followed?token='+token).success(successCallback)
        },

        create:function(token, pictureURI, options, successCallback, errorCallback) {
            if(pictureURI != undefined) {
                var ft = new FileTransfer();
                ft.upload(pictureURI, encodeURI(Settings.host+'checkins/create?token='+token), successCallback, errorCallback, options);
            }
            else {
                $http.post(Settings.host+'checkins/create?token'+token, options.params).success(successCallback).error(errorCallback)
            }
        },
        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id).success(successCallback).error(errorCallback);
        }
    };

})