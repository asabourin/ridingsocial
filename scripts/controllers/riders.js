angular.module('App')
  
  .controller('Riders.show', function(User, Riders, $scope, $routeParams) {

    Riders.show(User.token(), $routeParams.id, function(response) {
        $scope.rider = response;
        $scope.tab = 'sessions'
    })

    Riders.sessions(User.token(), $routeParams.id, function(response) {
        $scope.rider_sessions = response;
    })

    Riders.spots(User.token(), $routeParams.id, function(response) {
        $scope.rider_spots = _.sortBy(response, function(s){return -s.nb_sessions});
    })

    Riders.followers(User.token(), $routeParams.id, function(response) {
        $scope.followers = response;
    })

    // Functions

    $scope.showOthers = function (session_id) {
      $scope.this_session = _.find($scope.rider_sessions, function(s) {return s.id == session_id})
      $scope.othersOpen = true;
    };
    $scope.hideOthers = function () {
      $scope.othersOpen = false;
    };

    $scope.follow = function() {
        Riders.follow(User.token(), $scope.rider.id, function(response) {
            $scope.rider.following = true
            $scope.rider.nb_followers += 1
        })
    }

    $scope.unfollow = function() {
        navigator.notification.confirm("Are you sure?", stopFollowing, "Stop following "+$scope.rider.name, ["Yes", "Cancel"]);
    }

    function stopFollowing(index) {
        if(index == 1) {
            Riders.unfollow(User.token(), $scope.rider.id, function(response) {
                $scope.rider.following = false
                $scope.rider.nb_followers -= 1
            })
            $scope.$apply()
        }
    }

  })
