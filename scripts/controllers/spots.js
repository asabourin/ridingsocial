angular.module('App')
  
  .controller('Spots.show', function(User, Spots, $scope, $routeParams) {

    $scope.loading = true

    Spots.show(User.token(), $routeParams.id, function(response) {
        var spot = response;
        spot.picture = "http://maps.googleapis.com/maps/api/staticmap?center="+spot.lat+"+"+spot.lng+"&zoom=16&size=200x220&maptype=satellite&sensor=false"
        $scope.spot = spot
        $scope.loading = false
    })

    // Functions

    $scope.favorite = function() {
        $scope.loading = true
        Riders.favorite(User.token(), $scope.rider.id, function(response) {
            $scope.rider.favoriteing = true
            $scope.rider.nb_favoriteers += 1
            $scope.loading = false
        })
    }

    $scope.unfavorite = function() {
        navigator.notification.confirm("Are you sure?", stopFollowing, "Remove "+$scope.spot.name+" from your favorites", ["Yes", "Cancel"]);
    }

    function stopFollowing(index) {
        if(index == 1) {
            $scope.loading = true
            Riders.unfavorite(User.token(), $scope.rider.id, function(response) {
                $scope.rider.favoriteing = false
                $scope.rider.nb_favoriteers -= 1
                $scope.loading = false
            })
            $scope.$apply()
        }
    }

  })
