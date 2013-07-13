angular.module('App')
  
  .controller('Riders.show', function(User, Riders, $scope, $routeParams) {

    $scope.loading = true

    Riders.show(User.token(), $routeParams.id, function(response) {
        $scope.rider = response;
        $scope.loading = false
        $scope.tab = 'sessions'
    })

    Riders.sessions(User.token(), $routeParams.id, function(response) {
        $scope.sessions = response;
    })

    Riders.followers(User.token(), $routeParams.id, function(response) {
        $scope.followers = response;
    })

    // Functions

    $scope.showTab = function(tab) {
        $scope.tab = tab;
    }

    $scope.follow = function() {
        $scope.loading = true
        Riders.follow(User.token(), $scope.rider.id, function(response) {
            $scope.rider.following = true
            $scope.rider.nb_followers += 1
            $scope.loading = false
        })
    }

    $scope.unfollow = function() {
        navigator.notification.confirm("Are you sure?", stopFollowing, "Stop following "+$scope.rider.name, ["Yes", "Cancel"]);
    }

    function stopFollowing(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.unfollow(User.token(), $scope.rider.id, function(response) {
                $scope.rider.following = false
                $scope.rider.nb_followers -= 1
                $scope.loading = false
            })
            $scope.$apply()
        }
    }

  })
