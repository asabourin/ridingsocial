angular.module('Services').factory('Geolocation', function ($rootScope, CordovaReady) {

  var watcher, currentPosition;

  var getPosition = function() {
    watcher = navigator.geolocation.getCurrentPosition(
      function(position) {
        onPositionReceived(position);
      }, 
      function(error) {
        $rootScope.$broadcast('locationTimeout');
      }, 
      {maximumAge: 1000, timeout: Settings.geoloc_timeout, enableHighAccuracy: true}
    );
     
  };

  function onPositionReceived(position) {
    var newPosition = {latitude:position.coords.latitude.toFixed(4), longitude:position.coords.longitude.toFixed(4)};
    if(hasPositionChanged(newPosition)) {
        currentPosition = newPosition;
        $rootScope.$broadcast('positionUpdated', {position:newPosition});
        $rootScope.$apply();
    } 
  }

  function hasPositionChanged(newPosition) {
    return (currentPosition === undefined || Math.abs(currentPosition.latitude - newPosition.latitude) > 0.001 || Math.abs(currentPosition.longitude - newPosition.longitude) > 0.001);
  }

  var resetPosition = function() {
    currentPosition = undefined;
  };

  //

  return {

    currentPosition: function() {
      return currentPosition;
    },

    getPosition: getPosition,

    resetPosition: resetPosition

  };

});