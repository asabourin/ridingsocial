angular.module('App')

.controller('Checkin', function($rootScope, $scope, $timeout, $navigate, User, Riders, Checkin, Spots) {

  // Init

  $scope.checkin = new Object();
  $scope.selectedRiders = new Array();

  $scope.navigate = $navigate

  $scope.spot = Spots.getNearest()

  Riders.followed(User.getToken(), function(response) {
      $scope.followed = response
  })

  takePicture()

  // Scope functions

  $scope.addRider = function() {
    var rider = _.find($scope.followed, function(r){ return r.name == $scope.selected; });
    if(rider != undefined) {
      $scope.selectedRiders.push(rider)
      // Removing from list to choose from
      $scope.followed = _.reject($scope.followed, function(r) {return r.id == rider.id})
      $scope.selected = ''
    }
  }

  $scope.removeRider = function(id) {
    var rider = _.find($scope.selectedRiders, function(r){ return r.id == id; });
    $scope.followed.push(rider) //Putting back rider in list of followed
    $scope.selectedRiders = _.reject($scope.selectedRiders, function(r) {return r.id == id})
  }

  $scope.submit = function() {

    $scope.loading = true
    $scope.submitDisabled = true
    
    var checkin = {
        spot_id: $scope.spot.id,
        activity: $scope.activity,
        rating: $scope.rating,
        comment: $scope.comment,
        riders_ids: _.map($scope.selectedRiders, function(r) {return r.id})
      }

    var options = new FileUploadOptions();
    options.params = checkin;

    Checkin.create(User.getToken(), $scope.picture_src, options, checkinSuccessful, function(result){
      navigator.notification.alert(JSON.stringify(result), errorCheckin, Lang.en.checkin_error)
    })

  }

  // Functions
  
  function takePicture() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        $scope.loading = false
        $scope.$apply()
      }, 
      function(message) {
          console.log(message)
          $scope.loading = false
      },
      { quality: 100, allow_edit:true, targetWidth: 1600, targetWidth: 1200, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });
  }

  function checkinSuccessful(response) {
    User.setLastCheckinAt(Date.now())
    navigator.notification.alert(response.message, goToSpots, Lang.en.checkin_successful)
    
  }

  

})