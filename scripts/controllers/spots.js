angular.module('App')
  
  .controller('Spots.show', function(User, Spots, Riders, $scope, $routeParams) {

    $scope.loading = true

    Spots.show(User.token(), $routeParams.id, function(response) {
        $scope.spot = response;
        $scope.spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+$scope.spot.lat+"+"+$scope.spot.lng+"&zoom=16&size=200x220&maptype=satellite&sensor=false"
        $scope.loading = false
    })

    // Functions

    $scope.favorite = function() {
        $scope.loading = true
        Riders.favorite(User.token(), $scope.spot.id, function(response) {
            $scope.spot.favorite = true
            $scope.loading = false
        })
    }

    $scope.unfavorite = function() {
        navigator.notification.confirm("Are you sure?", removeFavorite, "Remove "+$scope.spot.name+" from your favorites", ["Yes", "Cancel"]);
    }

    function removeFavorite(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.unfavorite(User.token(), $scope.spot.id, function(response) {
                $scope.spot.favorite = false
                $scope.loading = false
            })
            $scope.$apply()
        }
    }

  })
