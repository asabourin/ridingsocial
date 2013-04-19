'use strict';

angular.module('App')
  .controller('MainController', function(Geolocation, CordovaReady, localStorageService, Riders, Spots, $scope, $rootScope, $timeout, $location) {

    //

    var watchPosition = setInterval(function () {
        Geolocation.getCurrentPosition(function (position) {
          Geolocation.onPosition(position)
        }, function(error) {
            alert('Oops, could not get your location. Check you\'ve got GPS enabled and we\'ll try again!')
        },
        {timeout: 5000})
      }, 1000);
      
      $scope.$on('$destroy', function () {
        clearInterval(watchPosition);
      });

    $rootScope.$on("positionUpdated", function (event, args) {
        $scope.position = args.position
        getNearbySpots(args.position)
    });

    //

    var rider = JSON.parse(localStorageService.get('rider'));

    Riders.me(rider.token, function(response) {
        $scope.rider = response
    },
    function(response) {
        alert(response.error)
        localStorageService.remove('rider')
        $location.path('/');
    })

     // Button functions
    $scope.logout = function () {
        localStorageService.clearAll()
        $location.path('/');
    };

    //

    function getNearbySpots(position) {

        Spots.nearby(position.latitude, position.longitude, Settings.coeff, Settings.radius, function(response) {

                $scope.spots = response

                var nearest = response[0]
                if(nearest['distance'] <= 1) {

                    var previousNearestSpot = JSON.parse(localStorageService.get('nearestSpot'))

                    if(previousNearestSpot == undefined || previousNearestSpot.id != nearest['id']) {
                        localStorageService.add('nearestSpot', JSON.stringify(nearest))
                        alert('You\'re at '+nearest.name )
                    }
                }

            })

    }


})