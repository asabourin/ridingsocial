angular.module('App')
  .controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $browser) {

    // Events

    $rootScope.$on("positionUpdated", function (event, args) {
        Spots.refreshNearby(args.position)
    });

    $rootScope.$on("nearbyUpdated", function (event, args) {
        $scope.spots = args.nearby
        $scope.loading = false
        Spots.checkNearest()
    });

    $rootScope.$on("newNearest", function(event, args) {
        navigator.notification.vibrate(300);
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", ["Yeah!","Not now"]);
    })

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $scope.loading = false
        $scope.sessions = args.sessions
    });

    $scope.$on('$destroy', function () {
        Geolocation.stopWatching()
    });

    // Init

    $scope.loading = true
    $scope.picture = User.picture()
    $rootScope.activeTab = 'nearby'

    CordovaReady(Geolocation.watchPosition())

    var nearby = Spots.getNearby()
    if (nearby != undefined) {
        $scope.spots = nearby
        $scope.loading = false
    }

    var followed = Sessions.getFollowed()
    if (followed != undefined) {
        $scope.sessions = followed
    }
    else {
        Sessions.refreshFollowed(User.getToken())
    }

    $scope.logout = function() {logout()}

    // Functions

    function wannaCheckin(index) {
        if(index == 1) {
            $location.path('/checkin')
        }
    }

    function logout() {
        User.logout(function() {$location.path('/')})
    }

    
})