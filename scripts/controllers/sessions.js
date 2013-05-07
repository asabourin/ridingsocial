angular.module('App')
  .controller('Sessions.followed', function(localStorageService, Checkins, $scope, $rootScope) {

    $scope.loading = true

    var user = JSON.parse(localStorageService.get('user'));

    Checkins.followed(user.token, function(response) {
        $scope.loading = false
        $scope.checkins = response
    })


})
