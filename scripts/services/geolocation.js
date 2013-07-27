angular.module('Services').factory('Geolocation', function ($rootScope, $timeout, CordovaReady) {
  
  //

  var watcher, currentPosition;
  currentPosition = {latitude: 0, longitude:0}

  //

  var getPosition = function() {
    watcher = navigator.geolocation.getCurrentPosition(
      function(position) {
        onPositionReceived(position)
      }
      , function(error) {
        $rootScope.$broadcast('locationTimeout');
      }
      , {maximumAge: 1000, timeout: Settings.geoloc_timeout, enableHighAccuracy: true}
    );
     
  }

  function onPositionReceived(position) {

    var newPosition = {latitude:position.coords.latitude.toFixed(4), longitude:position.coords.longitude.toFixed(4)}
    var positionChanged =  (currentPosition == undefined || Math.abs(currentPosition.latitude - newPosition.latitude) > 0.001 || Math.abs(currentPosition.longitude - newPosition.longitude) > 0.001)

    if(positionChanged) {
        currentPosition = newPosition
        $rootScope.$broadcast('positionUpdated', {position:newPosition});
        $rootScope.$apply()
    } 

  }

  var resetPosition = function() {
    currentPosition = undefined
  }

  var stopWatching = function() {
    $timeout.cancel(watcher);
  }

  //

  return {

    currentPosition: function() {
      return currentPosition
    },
    getPosition: getPosition,
    stopWatching: stopWatching,
    resetPosition: resetPosition

  }

});