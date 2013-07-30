angular.module('App')
  
  .controller('Riders.show', function(User, Riders, Spots, $scope, $rootScope, $routeParams) {

    Riders.show(User.token(), $routeParams.id, function(response) {
        $scope.rider = response;
        $scope.tab = 'sessions';
    });

    Riders.sessions(User.token(), $routeParams.id, function(response) {
        $scope.sessions = response;
        _.each($scope.sessions, function(s) {
            s.distance = Spots.distance(s.spot, $rootScope.position);
        });
    });

    Riders.spots(User.token(), $routeParams.id, function(response) {
        $scope.rider_spots = _.sortBy(response, function(s){return -s.nb_sessions;});
    });

    // Functions

    $scope.follow = function() {
        navigator.notification.confirm("Follow "+$scope.rider.name+"?", follow, "", ["Yes", "Cancel"]);
    };

    function follow(index) {
        if(index == 1) {
            Riders.follow(User.token(), $scope.rider.id, function(response) {
                $scope.rider.following = true;
                $scope.rider.nb_followers += 1;
            });
            $scope.$apply();
        }
    }

    $scope.unfollow = function() {
        navigator.notification.confirm("Are you sure?", stopFollowing, "Stop following "+$scope.rider.name, ["Yes", "Cancel"]);
    };

    function stopFollowing(index) {
        if(index == 1) {
            Riders.unfollow(User.token(), $scope.rider.id, function(response) {
                $scope.rider.following = false;
                $scope.rider.nb_followers -= 1;
            });
            $scope.$apply();
        }
    }

});
