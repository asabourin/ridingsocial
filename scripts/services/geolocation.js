angular.module('Services').factory('Geolocation', function ($rootScope, $timeout, CordovaReady) {
  
  //

  var watcher, currentPosition;

  //

  var watchPosition = function() {
    getCurrentPosition( 
      function(position) {
        onPositionReceived(position)
        watcher = $timeout(watchPosition, Settings.geoloc_timeout)
      }, function(error) {
        navigator.notification.alert('Could not get your location. Check you\'ve got GPS enabled and we\'ll try again!', null, 'Oops...')
        watcher = $timeout(watchPosition, Settings.geoloc_timeout)
      })
  }

  function getCurrentPosition(onSuccess, onError) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: Settings.geoloc_timeout});
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

    watchPosition: watchPosition,
    stopWatching: stopWatching,
    resetPosition: resetPosition

  }

});