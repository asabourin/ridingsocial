angular.module('App')
  .controller('Spots.nearby', function(User, Geolocation, Spots, CordovaReady, $scope, $rootScope, $location, $browser) {

    // Init

    $rootScope.showNav = true

    CordovaReady(Geolocation.watchPosition())

    var nearby = Spots.getNearby()
    if (nearby != undefined) {
        $scope.spots = nearby
    }
    else {
        Geolocation.resetPosition()
        $scope.loading = true
    }

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
    });

    $rootScope.$on("nearbyUpdated", function (event, args) {
        $scope.loading = false
        $scope.spots = args.nearby
        Spots.checkNearest()
    });

    $rootScope.$on("newNearest", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", ["Yeah!","Not now"]);
    })

    $scope.$on('$destroy', function () {
        Geolocation.stopWatching()
    });

    // Functions

    function wannaCheckin(index) {
        if(index == 1) {
            $location.path('/checkin')
        }
    }

    
})

.controller('Spots.show', function(Spots, $routeParams, $scope) {

    Spots.show($routeParams.id, function(response) {
        $scope.spot = response;
    })

})