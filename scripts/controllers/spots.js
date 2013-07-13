angular.module('App')
  
  .controller('Spots.show', function(User, Spots, Riders, $scope, $routeParams, $window) {

    $scope.loading = true
    $scope.tab = 'sessions'

    Spots.show(User.token(), $routeParams.id, function(response) {
        $scope.spot = response;
        $scope.spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+$scope.spot.lat+","+$scope.spot.lng+"&zoom=16&size="+$window.innerWidth+"x220&maptype=satellite&sensor=true&markers=icon:http://ridingsocial.net/images/flags/"+$scope.spot.color+"_48.png%7C"+$scope.spot.lat+","+$scope.spot.lng+""
        $scope.loading = false
    })

    Spots.sessions(User.token(), $routeParams.id, function(response) {
        $scope.sessions = response;
    })

    Spots.riders(User.token(), $routeParams.id, function(response) {
        $scope.riders = response;
    })

    // Functions

    $scope.watch = function() {
        navigator.notification.confirm("Watch "+$scope.spot.name+"?", watch, "", ["Yes", "Cancel"]);
    }

    function watch(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.watch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.watched = true
                $scope.loading = false
            })
            $scope.$apply()
        }
    }

    $scope.unwatch = function() {
        navigator.notification.confirm("Are you sure?", unwatch, "Stop watching "+$scope.spot.name+"", ["Yes", "Cancel"]);
    }

    function unwatch(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.unwatch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.watched = false
                $scope.loading = false
            })
            $scope.$apply()
        }
    }

  })
