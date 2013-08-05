angular.module('App')
  
.controller('Spots.show', function(User, Spots, Riders, $scope, $rootScope, $routeParams, $navigate) {

    if($rootScope.spot === undefined || $rootScope.spot.id !== parseInt($routeParams.id, 10)) { 

        $rootScope.spot = null;
        $rootScope.spot_sessions = null;
        $rootScope.spot_riders = null;
        
        $rootScope.spot_tab = 'sessions';
        $rootScope.checkinAllowed = false;

        Spots.show(User.token(), $routeParams.id, function(response) {
            $rootScope.spot = response;
            if($rootScope.position !== undefined) {
                $rootScope.spot.distance = Spots.distance(response, $rootScope.position);
                $rootScope.checkinAllowed = $rootScope.spot.distance <= Settings.radius;
            }
            $rootScope.spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+$rootScope.spot.lat+","+$rootScope.spot.lng+"&zoom=16&size=100x120&maptype=satellite&sensor=true&markers=icon:http://ridingsocial.net/images/flags/"+$rootScope.spot.color+"_32.png%7C"+$rootScope.spot.lat+","+$rootScope.spot.lng+"";
        });

        Spots.sessions(User.token(), $routeParams.id, function(response) {
            $rootScope.spot_sessions = response;
        });

        Spots.riders(User.token(), $routeParams.id, function(response) {
            $rootScope.spot_riders = response;
        });

    }

    // Functions

    $scope.showSpotOnMap = function() {
        $rootScope.map.center.latitude = $rootScope.spot.lat;
        $rootScope.map.center.longitude = $rootScope.spot.lng;
        $rootScope.activeTab = 'map';
        $rootScope.map.zoom = 17;
        $navigate.go('/main');
    };

    $scope.checkinHere = function() {
        if($rootScope.spot.distance < Settings.radius) {
            Spots.setCheckinAt($scope.spot);
            $navigate.go('/checkin', 'pop');
        }
    };

    $scope.watch = function() {
        navigator.notification.confirm("Watch "+$rootScope.spot.name+"?", watch, "", ["Yes", "Cancel"]);
    };

    function watch(index) {
        if(index == 1) {
            Riders.watch(User.token(), $rootScope.spot.id, function(response) {
                $rootScope.spot.watched = true;
            });
            $scope.$apply();
        }
    }

    $scope.unwatch = function() {
        navigator.notification.confirm("Are you sure?", unwatch, "Stop watching "+$rootScope.spot.name+"", ["Yes", "Cancel"]);
    };

    function unwatch(index) {
        if(index == 1) {
            Riders.unwatch(User.token(), $scope.spot.id, function(response) {
                $rootScope.spot.watched = false;
            });
            $scope.$apply();
        }
    }

  });
