angular.module('App')

.controller('CheckinModal', function($rootScope, $scope, Riders, localStorageService) {

  var user = JSON.parse(localStorageService.get('user'));

  Riders.followed(user.token, function(response) {
      $scope.riders = response
  })
  
  $rootScope.$on('showCheckin', function() {
      $scope.shouldBeOpen = true;
      $scope.spot = JSON.parse(localStorageService.get('nearestSpot'));
  });

  $scope.open = function () {
    $scope.shouldBeOpen = true;
  };

  $scope.close = function () {
    $scope.closeMsg = 'I was closed at: ' + new Date();
    $scope.shouldBeOpen = false;
  };

  $scope.opts = {
    backdropFade: true,
    dialogFade: false
  };
  
  $scope.takePicture = function() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        $scope.$apply()
      }, 
      function(message) {
          console.log(message)
      },
      { quality: 75, allow_edit:true, targetWidth: 1600, destinationType: Camera.DestinationType.FILE_URI });
  }

})