angular.module('Services').factory('Checkins', function ($rootScope, $http) {
    return {

        followed:function (token, successCallback) {
            $http.get(Settings.host+'checkins/followed?token='+token).success(successCallback)
        },

        create:function(token, pictureURI, options, successCallback, errorCallback) {
            if(pictureURI != undefined) {
                var ft = new FileTransfer();
                ft.upload(pictureURI, encodeURI(Settings.host+'checkins/create?token='+token), function(result) {
                    response = JSON.parse(result.response) // Cause server response is stringified inside result
                    successCallback(response)
                }, errorCallback, options);
            }
            else {
                // Ugly fix cause angular sends POST data as JSON in the body instead of params payload
                var payload = "spot_id="+options.params.spot_id+"&rating="+options.params.rating
                if(options.params.comment != undefined) {payload += "&comment="+options.params.comment}
                if(options.params.riders_ids != undefined) {
                    payload += "&riders_ids=["+options.params.riders_ids+"]"
                }
                $http.post(Settings.host+'checkins/create?token='+token,  payload, {headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}, transformRequest: transform}).success(successCallback).error(errorCallback)
            }
        },
        show: function(id, successCallback, errorCallback) {
            $http.get(Settings.host+'/checkins/'+id).success(successCallback).error(errorCallback);
        }
    };

    var transform = function(data){
        return $.param(data);
    }

})