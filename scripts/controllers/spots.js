angular.module('App')
  
.controller('Spots.show', function(User, Spots, Riders, $scope, $rootScope, $routeParams, $navigate) {

    $scope.tab = 'sessions';
    $scope.checkinAllowed = false;

    Spots.show(User.token(), $routeParams.id, function(response) {
        $scope.spot = response;
        $scope.spot.distance = Spots.distance(response, $rootScope.position);
        $scope.checkinAllowed = $scope.spot.distance <= Settings.radius;
        $scope.spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+$scope.spot.lat+","+$scope.spot.lng+"&zoom=16&size=100x120&maptype=satellite&sensor=true&markers=icon:http://ridingsocial.net/images/flags/"+$scope.spot.color+"_32.png%7C"+$scope.spot.lat+","+$scope.spot.lng+"";
    });

    Spots.sessions(User.token(), $routeParams.id, function(response) {
        $scope.sessions = response;
    });

    Spots.riders(User.token(), $routeParams.id, function(response) {
        $scope.riders = response;
    });

    // Functions

    $scope.showSpotOnMap = function() {
        $rootScope.map.center.latitude = $scope.spot.lat;
        $rootScope.map.center.longitude = $scope.spot.lng;
        $rootScope.activeTab = 'map';
        $rootScope.map.zoom = 17;
        $navigate.go('/main');
    };

    $scope.checkinHere = function() {
        if($scope.spot.distance < Settings.radius) {
            Spots.setCheckinAt($scope.spot);
            $navigate.go('/checkin', 'pop');
        }
    };

    $scope.watch = function() {
        navigator.notification.confirm("Watch "+$scope.spot.name+"?", watch, "", ["Yes", "Cancel"]);
    };

    function watch(index) {
        if(index == 1) {
            Riders.watch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.watched = true;
            });
            $scope.$apply();
        }
    }

    $scope.unwatch = function() {
        navigator.notification.confirm("Are you sure?", unwatch, "Stop watching "+$scope.spot.name+"", ["Yes", "Cancel"]);
    };

    function unwatch(index) {
        if(index == 1) {
            Riders.unwatch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.watched = false;
            });
            $scope.$apply();
        }
    }

  });
