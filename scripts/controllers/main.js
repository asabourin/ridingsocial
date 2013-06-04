angular.module('App')
  .controller('MainController', function(User, Geolocation, Spots, Sessions, CordovaReady, $scope, $rootScope, $location, $navigate) {

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
        navigator.notification.confirm("Wanna check-in?", wannaCheckin, "You're at "+args.spot.name+"!", "Yeah!, Not now");
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
    $scope.activeTab = 'nearby'
    $scope.navigate = $navigate

    CordovaReady(Geolocation.watchPosition())

    var nearby = Spots.getNearby()
    if (nearby != undefined) {
        $scope.spots = nearby
        $scope.loading = false
    }

    var followedSessions = Sessions.getFollowed()
    if (followedSessions != undefined) {
        $scope.sessions = followedSessions
    }
    else {
        Sessions.refreshFollowed(User.getToken())
    }

    User.getFollowedRiders()

    // Functions

    $scope.goToTab = function(tab) {
        $scope.activeTab = tab;
    }

    function wannaCheckin(index) {
        if(index == 1) {
            $scope.loading = true
            $navigate.go('/checkin', 'fade')
        }
    }

    // Debug

    $scope.logout = function() {logout()}
    $scope.checkin = function() {
      $navigate.go('/checkin', 'fade')
    }

    function logout() {
        User.logout()
        $navigate.go('/', 'fade')
    }

    
})