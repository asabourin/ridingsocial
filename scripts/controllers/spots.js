angular.module('App')
  .controller('Spots.nearby', function(User, Geolocation, Spots, Checkins, CordovaReady, $scope, $rootScope) {

    // Init

    $rootScope.showNav = true

    CordovaReady(Geolocation.watchPosition())

    var nearby = JSON.parse(localStorage.getItem('nearbySpots'))
    if (nearby != undefined) {
        $scope.spots = nearby //Spots already there
    }
    else {
        localStorage.removeItem('lastPosition') // Force position update
        $scope.loading = true
    }

    $scope.$on('$destroy', function () {
        Geolocation.stopWatching()
    });

    $rootScope.$on("positionUpdated", function (event, args) {
        getNearbySpots(args.position)
    });

    // Functions

    function getNearbySpots(position) {

        Spots.nearby(position.latitude, position.longitude, Settings.coeff, Settings.radius, function(response) {
            $scope.loading = false
            $scope.spots = response
            localStorage.setItem('nearbySpots', JSON.stringify(response))
            
            checkNearest(response[0])

        })
    }

    function checkNearest(spot) {
        if(spot['distance'] <= Settings.checkin_distance) {

            var previousNearestSpot = JSON.parse(localStorage.getItem('nearestSpot'))

            if((previousNearestSpot == undefined || previousNearestSpot.id != spot['id'])) {
                localStorage.setItem('nearestSpot', JSON.stringify(spot))
                navigator.notification.vibrate(300);
                navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+spot.name+"!", "Yeah!,Not now");
            }
        }
    }

    function wannaCheckin(index) {
        if(index == 1) {
            $location.path('/checkin')
            $scope.$apply()
        }
    }

    
})

.controller('Spots.show', function(Spots, $routeParams, $scope) {

    Spots.show($routeParams.id, function(response) {
        $scope.spot = response;
    })

})