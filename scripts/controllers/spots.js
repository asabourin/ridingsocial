angular.module('App')
  .controller('Spots.nearby', function(Geolocation, CordovaReady, localStorageService, Riders, Spots, Checkins, $scope, $rootScope, $timeout, $location) {

    // Init

    localStorageService.remove('lastPosition')
    $scope.loading = true

    //

    var watchPosition = setInterval(function () {
        Geolocation.getCurrentPosition(function (position) {
          Geolocation.onPosition(position)
        }, function(error) {
            alert('Oops, could not get your location. Check you\'ve got GPS enabled and we\'ll try again!')
        },
        {timeout: 5000})
      }, 1000);
      
      $scope.$on('$destroy', function () {
        clearInterval(watchPosition);
      });

    $rootScope.$on("positionUpdated", function (event, args) {
        $scope.position = args.position
        getNearbySpots(args.position)
    });

    //

    function wannaCheckin(index) {
        if(index == 0) {
            $location('/checkin')
        }
    }

    function getNearbySpots(position) {

        Spots.nearby(position.latitude, position.longitude, Settings.coeff, Settings.radius, function(response) {
            $scope.loading = false
            $scope.spots = response


            var nearest = response[0]
            if(nearest['distance'] <= Settings.checkin_distance) {

                var previousNearestSpot = JSON.parse(localStorageService.get('nearestSpot'))

                if(previousNearestSpot == undefined || previousNearestSpot.id != nearest['id']) {
                    localStorageService.add('nearestSpot', JSON.stringify(nearest))

                    navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+nearest.name, "Yeah!,Not now");
                }
            }

        })
    }

})

.controller('Spots.show', function(Spots, $routeParams, $scope) {

    Spots.show($routeParams.id, function(response) {
        $scope.spot = response;
    })

})