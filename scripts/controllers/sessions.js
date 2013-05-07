angular.module('App')
  .controller('Sessions.followed', function(Checkins, $scope, $rootScope) {


        Checkins.followed($rootScope.user.token, function(response) {

                $scope.checkins = response

            })


})
