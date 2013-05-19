angular.module('App')
  .controller('Sessions.followed', function(Checkins, $scope, $rootScope) {

    var user = JSON.parse(localStorage.getItem('user'))

    var checkins = JSON.parse(localStorage.getItem('lastFollowedCheckins'))
    if (checkins != undefined) {
        $scope.checkins = checkins //Checkins already there
    }
    else {
        $scope.loading = true
        Checkins.followed(user.token, function(response) {
          $scope.loading = false
          $scope.checkins = response
          localStorage.setItem('lastFollowedCheckins', JSON.stringify(response))
      })
    }

    


})
