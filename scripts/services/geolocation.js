angular.module('Services').factory('Geolocation', function ($rootScope) {

  var lastPosition;

  function onPositionReceived(position) {
    if(hasPositionChanged(position.coords)) {
        lastPosition = position.coords;
        $rootScope.$broadcast('positionUpdated', {position:position.coords});
        $rootScope.$apply();
    } 
  }

  function hasPositionChanged(newPosition) {
    return (lastPosition === undefined || Math.abs(lastPosition.latitude - newPosition.latitude) > 0.001 || Math.abs(lastPosition.longitude - newPosition.longitude) > 0.001);
  }

  //

  return {

    getPosition: function() {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          onPositionReceived(position);
        }, 
        function(error) {
          $rootScope.$broadcast('locationTimeout');
        }, 
        {maximumAge: 1000, timeout: Settings.geoloc_timeout, enableHighAccuracy: true}
      );
       
    },

    resetPosition: function() {
      lastPosition = undefined;
      $rootScope.position = undefined;
    }

  };

});