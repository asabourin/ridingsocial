angular.module('App')
  .controller('Sessions.followed', function(Checkins, $scope, $rootScope) {

    $scope.loading = true

    var user = JSON.parse(localStorage.getItem('user'));

    Checkins.followed(user.token, function(response) {
        $scope.loading = false
        $scope.checkins = response
    })


})
