angular.module('App')

.controller('Checkin', function($rootScope, $scope, $location, Riders, Checkins, localStorageService) {

  // Init
  $scope.checkin = new Object();

  $rootScope.showNav = false
  $scope.location = $location

  $scope.spot = JSON.parse(localStorageService.get('nearestSpot'));

  Riders.followed($rootScope.user.token, function(response) {
      $scope.followed = response
  })

  takePicture()

  //

  $scope.selectedRiders = new Array();

  $scope.addRider = function() {
    var rider = _.find($scope.followed, function(r){ return r.name == $scope.selected; });
    if(rider != undefined) {
      $scope.selectedRiders.push(rider)
      $scope.selected = ''
    }
  }

  $scope.submit = function() {

    $scope.loading = true
    $scope.submitDisabled = true
    
    var checkin = new Object()

    checkin.spot_id = $scope.spot.id
    checkin.activity = $scope.activity
    checkin.rating = $scope.rating
    checkin.comment = $scope.comment
    checkin.riders_ids = _.map($scope.selectedRiders, function(r) {return r.id})

    var options = new FileUploadOptions();
    options.params = checkin;

    Checkins.create($rootScope.user.token, $scope.picture_src, options, checkinSuccessful, function(result){
      navigator.notification.alert(JSON.stringify(result), errorCheckin, Lang.en.checkin_error)
    })

  }

  //
  
  function takePicture() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        $scope.$apply()
      }, 
      function(message) {
          console.log(message)
      },
      { quality: 50, allow_edit:true, targetWidth: 1600, targetWidth: 1200, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });
  }

  function checkinSuccessful(result) {
    $rootScope.user.lastCheckinAt = Date.now()
    message = JSON.parse(result.response).message // Cause server response is stringified inside result
    navigator.notification.alert(message, goToSpots, Lang.en.checkin_successful)
    
  }

  function goToSpots() {
    $location.path('/nearby')
    $scope.$apply()
  }

  function errorCheckin() {

  }

  

})