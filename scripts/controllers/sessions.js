angular.module('App')
  .controller('Sessions.followed', function(Sessions, User, $scope, $rootScope, $location) {

    // Init

    $rootScope.showNav = true

    

    // Events

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $scope.loading = false
        $scope.sessions = args.sessions
    });

})
