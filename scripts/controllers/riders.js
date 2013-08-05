angular.module('App')
  
  .controller('Riders.show', function(User, Riders, Spots, $scope, $rootScope, $routeParams) {

    // Init

    if($rootScope.rider === undefined || $rootScope.rider.id !== parseInt($routeParams.id, 10)) { 

        $rootScope.rider = null;
        $rootScope.rider_sessions = null;
        $rootScope.rider_spots = null;

        Riders.show(User.token(), $routeParams.id, function(response) {
            $rootScope.rider = response;
            $rootScope.rider_tab = 'sessions';
        });

        Riders.sessions(User.token(), $routeParams.id, function(response) {
           if($rootScope.position !== undefined) {
                _.each(response, function(session) {
                    session.distance = Spots.distance(session.spot, $rootScope.position);
                });
            }
            $rootScope.rider_sessions = response; 
        });

        Riders.spots(User.token(), $routeParams.id, function(response) {
            $rootScope.rider_spots = _.sortBy(response, function(s){return -s.nb_sessions;});
        });

    }

    // Functions

    $scope.follow = function() {
        navigator.notification.confirm("Follow "+$rootScope.rider.name+"?", follow, "", ["Yes", "Cancel"]);
    };

    function follow(index) {
        if(index == 1) {
            Riders.follow(User.token(), $scope.rider.id, function(response) {
                $rootScope.rider.following = true;
                $rootScope.rider.nb_followers += 1;
            });
            $scope.$apply();
        }
    }

    $scope.unfollow = function() {
        navigator.notification.confirm("Are you sure?", stopFollowing, "Stop following "+$rootScope.rider.name, ["Yes", "Cancel"]);
    };

    function stopFollowing(index) {
        if(index == 1) {
            Riders.unfollow(User.token(), $scope.rider.id, function(response) {
                $rootScope.rider.following = false;
                $rootScope.rider.nb_followers -= 1;
            });
            $scope.$apply();
        }
    }

});
