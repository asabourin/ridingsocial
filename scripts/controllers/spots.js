angular.module('App')
  
  .controller('Spots.show', function(User, Spots, Riders, $scope, $routeParams, $window) {

    $scope.loading = true
    $scope.tab = 'sessions'

    Spots.show(User.token(), $routeParams.id, function(response) {
        $scope.spot = response;
        $scope.spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+$scope.spot.lat+"+"+$scope.spot.lng+"&zoom=16&size="+$window.innerWidth+"x220&maptype=satellite&sensor=false"
        $scope.loading = false
    })

    // Functions

    $scope.watch = function() {
        navigator.notification.confirm("", unwatch, "Watch "+$scope.spot.name+"?", ["Yes", "Cancel"]);
    }

    function watch(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.watch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.favorite = true
                $scope.loading = false
            })
        }
    }

    $scope.unwatch = function() {
        navigator.notification.confirm("Are you sure?", unwatch, "Stop watching "+$scope.spot.name+"", ["Yes", "Cancel"]);
    }

    function unwatch(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.unwatch(User.token(), $scope.spot.id, function(response) {
                $scope.spot.favorite = false
                $scope.loading = false
            })
            $scope.$apply()
        }
    }

  })
