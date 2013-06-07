angular.module('App')

.controller('Checkin', function($rootScope, $scope, $route, $navigate, $location, User, Riders, Checkin, Spots) {

  // Init

  $scope.loading = true

  $scope.checkin = new Object();
  $scope.selectedRiders = new Array();

  $scope.spot = Spots.getNearest()

  $scope.followed = User.getFollowedRiders()

  // Events

  var pageTransitionListener = $scope.$on('$pageTransitionSuccess', function() {
    takePicture()
  })

  $scope.$watch('activity', function() {  
    $scope.submitEnabled = validate()
  })

  $scope.$watch('rating', function() {  
    $scope.submitEnabled = validate()
  })

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

    Checkin.create(User.token(), $scope.picture_src, options, checkinSuccessful, function(result){
      navigator.notification.alert(JSON.stringify(result), errorCheckin, Lang.en.checkin_error)
    })

  }

  // Functions
  
  function takePicture() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        pageTransitionListener() // Turn off event listener
        $scope.loading = false
        $scope.$apply()
      }, 
      function(message) {
          console.log(message)
          pageTransitionListener() // Turn off event listener
          $scope.loading = false
          $scope.$apply()
      },
      { quality: 100, allow_edit:true, targetWidth: 1600, targetWidth: 1200, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });
  }

  function checkinSuccessful(response) {
    User.setLastCheckinAt(Date.now())
    $scope.loading = false;
    navigator.notification.alert(response.message, goBack, Lang.en.checkin_successful)
  }

  function validate() {
    return ($scope.spot != undefined && $scope.rating != undefined && $scope.activity != undefined)
  }

  function goBack() {
    $navigate.back()
    $scope.$apply()
  }

})