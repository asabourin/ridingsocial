angular.module('App')
  .controller('Sessions.followed', function(Checkins, $scope, $rootScope) {

    $scope.loading = true

    Checkins.followed($rootScope.user.token, function(response) {
        $scope.loading = false
        $scope.checkins = response
    })


})
