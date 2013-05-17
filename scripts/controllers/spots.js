angular.module('App')
  .controller('Spots.nearby', function(Geolocation, Riders, Spots, Checkins, $scope, $rootScope, $timeout, $location) {

    // Init

    localStorage.removeItem('lastPosition')
    $scope.loading = true
    $rootScope.showNav = true
    $scope.location = $location

    // Geolocation

    function getPosition() {
        Geolocation.getCurrentPosition(function (position) {
            Geolocation.onPosition(position)
        }, function(error) {
            navigator.notification.alert('Could not get your location. Check you\'ve got GPS enabled and we\'ll try again!', null, 'Oops...')
        }, {timeout: 10000}
        )
    }
      
    var watchPosition = setInterval(getPosition(), 10000)
      
    $scope.$on('$destroy', function () {
        clearInterval(watchPosition);
    });

    $rootScope.$on("positionUpdated", function (event, args) {
        $scope.position = args.position
        getNearbySpots(args.position)
    });

    // Functions

    function wannaCheckin(index) {
        if(index == 1) {
            $location.path('/checkin')
        }
    }

    function checkNearest(spot) {
        if(spot['distance'] <= Settings.checkin_distance) {

            var previousNearestSpot = JSON.parse(localStorage.getItem('nearestSpot'))

            if((previousNearestSpot == undefined || previousNearestSpot.id != spot['id']) && $rootScope.logged) {
                localStorage.setItem('nearestSpot', JSON.stringify(spot))
                navigator.notification.vibrate(300);
                navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+spot.name+"!", ['Yeah!','Not now']);
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