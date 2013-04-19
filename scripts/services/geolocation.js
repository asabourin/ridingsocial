angular.module('Services').factory('Geolocation', function ($rootScope, CordovaReady, localStorageService) {
  
  return {
    
    getCurrentPosition: CordovaReady(function (onSuccess, onError, options) {
      navigator.geolocation.getCurrentPosition(function () {
        var that = this,
          args = arguments;
          
        if (onSuccess) {
          $rootScope.$apply(function () {
            onSuccess.apply(that, args);
          });
        }
      }, function () {
        var that = this,
          args = arguments;
          
        if (onError) {
          $rootScope.$apply(function () {
            onError.apply(that, args);
          });
        }
      },
      options);
    }),

    onPosition: function(new_position) {

      var position = {latitude:new_position.coords.latitude.toFixed(4), longitude:new_position.coords.longitude.toFixed(4)}
      var lastPosition = JSON.parse(localStorageService.get('lastPosition'))

      if(lastPosition == undefined || Math.abs(lastPosition.latitude - position.latitude) > 0.001 || Math.abs(lastPosition.longitude - position.longitude) > 0.001) {
          localStorageService.add('lastPosition', JSON.stringify(position))
          $rootScope.$broadcast('positionUpdated', {position:position});
      } 

    }

  };

});