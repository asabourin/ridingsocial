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
        if(index == 1) {
            $location.path('/checkin')
        }
    }

    function checkNearest(spot) {
        if(spot['distance'] <= Settings.checkin_distance) {

            var previousNearestSpot = JSON.parse(localStorageService.get('nearestSpot'))

            if(previousNearestSpot == undefined || previousNearestSpot.id != spot['id']) {
                localStorageService.add('nearestSpot', JSON.stringify(spot))
                navigator.notification.vibrate(300);
                navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+spot.name+"!", "Yeah!,Not now");
            }
        }
    }

    function getNearbySpots(position) {

        Spots.nearby(position.latitude, position.longitude, Settings.coeff, Settings.radius, function(response) {
            $scope.loading = false
            $scope.spots = response

            checkNearest(response[0])

        })
    }

})

.controller('Spots.show', function(Spots, $routeParams, $scope) {

    Spots.show($routeParams.id, function(response) {
        $scope.spot = response;
    })

})