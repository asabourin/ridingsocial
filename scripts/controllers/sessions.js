angular.module('App')
  .controller('Sessions.followed', function(localStorageService, Checkins, $scope, $rootScope) {

    var user = JSON.parse(localStorageService.get('user'));

    Checkins.followed(user.token, function(response) {
        $scope.checkins = response
    })


})
