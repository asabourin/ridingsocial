angular.module('App')

.controller('Checkin', function($rootScope, $scope, $location, Riders, localStorageService) {

  // Init

  takePicture()

  var user = JSON.parse(localStorageService.get('user'));
  $rootScope.showNav = false
  $scope.location = $location

  $scope.spot = JSON.parse(localStorageService.get('nearestSpot'));

  Riders.followed(user.token, function(response) {
      $scope.riders = response
  })

  //

  $scope.selectedRiders = new Array();

  $scope.addRider = function() {
    var rider = _.find($scope.riders, function(r){ return r.name == $scope.selected; });
    if(rider != undefined) {
      $scope.selectedRiders.push(rider)
      _.reject($scope.riders, function(r){ return r.id == rider.id; });
      $scope.selected = ''
    }
  }
  
  function takePicture() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        $scope.$apply()
      }, 
      function(message) {
          console.log(message)
      },
      { quality: 50, allow_edit:true, targetWidth: 1600, targetWidth: 1200, destinationType: Camera.DestinationType.FILE_URI });
  }

})