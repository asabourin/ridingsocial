angular.module('Services').factory('Geolocation', function ($rootScope, $timeout, CordovaReady) {
  
  //

  var watcher, currentPosition;
  currentPosition = {latitude: 0, longitude:0}

  //

  var watchPosition = function() {
    getCurrentPosition( 
      function(position) {
        onPositionReceived(position)
        watcher = $timeout(watchPosition, Settings.geoloc_refresh)
      }, function(error) {
        navigator.notification.alert(Lang.en.error_location, function() {
          watcher = $timeout(watchPosition, Settings.geoloc_refresh)
        } , Lang.en.error)
        
      })
  }

  function getCurrentPosition(onSuccess, onError) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge: Settings.geoloc_timeout, timeout: Settings.geoloc_timeout, enableHighAccuracy: true});
  }

  function onPositionReceived(position) {

    var newPosition = {latitude:position.coords.latitude.toFixed(4), longitude:position.coords.longitude.toFixed(4)}
    var positionChanged =  (currentPosition == undefined || Math.abs(currentPosition.latitude - newPosition.latitude) > 0.001 || Math.abs(currentPosition.longitude - newPosition.longitude) > 0.001)

    if(positionChanged) {
        currentPosition = newPosition
        $rootScope.$broadcast('positionUpdated', {position:newPosition});
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
    watchPosition: watchPosition,
    stopWatching: stopWatching,
    resetPosition: resetPosition

  }

});