angular.module('App')
  .controller('Sessions.followed', function(Sessions, User, $scope, $rootScope) {

    // Init

    var followed = Sessions.getFollowed()
    if (followed != undefined) {
        $scope.sessions = followed
    }
    else {
        $scope.loading = true
        Sessions.refreshFollowed(User.getToken())
    }

    // Events

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $scope.loading = false
        $scope.sessions = args.sessions
    });

})
