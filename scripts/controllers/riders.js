angular.module('App')
  
  .controller('Riders.show', function(User, Riders, $scope, $routeParams) {

    $scope.loading = true

    Riders.show(User.token(), $routeParams.id, function(response) {
        $scope.rider = response;
        $scope.loading = false
    })

    $scope.follow = function(rider_id) {
        $scope.loading = true
        Riders.follow(User.token(), rider_id, function(response) {
            $scope.rider.following = true
            $scope.loading = false
        })
    }

    $scope.unfollow = function(rider_id) {
        $scope.loading = true
        Riders.unfollow(User.token(), rider_id, function(response) {
            $scope.rider.following = false
            $scope.loading = false
        })
    }

  })
