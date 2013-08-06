angular.module('App')

.controller('Checkin', function($rootScope, $scope, $route, $navigate, User, Riders, Checkin, Spots) {

  // Init

  $scope.loading = true;
  $scope.checkin = {};
  $scope.selected_riders = [];
  $scope.spot = Spots.checkinAt();
  User.fetchFollowedRiders(function(response){
    $scope.followed_riders = response;
  });

  // Events

  var pageTransitionListener = $scope.$on('$pageTransitionSuccess', function() { //Delaying the clal to camera after CSS page transition is done
    takePicture();
  });

  $scope.$watch('activity', function() {  
    $scope.submitEnabled = validate();
  });

  $scope.$watch('rating', function() {  
    $scope.submitEnabled = validate();
  });

  // Scope functions

  $scope.addRider = function() {
    var rider = _.find($scope.followed_riders, function(r){ return (r.name == $scope.selected); });
    if(rider !== undefined) {
      $scope.selected_riders.push(rider);
      // Removing from list to choose from
      $scope.followed_riders = _.reject($scope.followed_riders, function(r) {return (r.id == rider.id);});
      $scope.selected = '';
    }
  };

  $scope.removeRider = function(id) {
    var rider = _.find($scope.selected_riders, function(r){ return (r.id == id); });
    $scope.followed_riders.push(rider); //Putting back rider in list of followed
    $scope.selected_riders = _.reject($scope.selected_riders, function(r) {return (r.id == id);});
  };

  $scope.submit = function() {

    $scope.loading = true;
    $scope.submitDisabled = true;
    
    var checkin = {
      spot_id: $scope.spot.id,
      activity: $scope.activity,
      rating: $scope.rating,
      comment: $scope.comment,
      riders_ids: _.map($scope.selected_riders, function(r) {return r.id;})
    };

    var options = new FileUploadOptions();
    options.params = checkin;

    Checkin.create(User.token(), $scope.picture_src, options, checkinSuccessful, errorCheckin);

  };

  // Functions
  
  function takePicture() {
    navigator.camera.getPicture(
      function(imageURI) {
        $scope.picture_src = imageURI;
        pageTransitionListener(); // Turn off event listener so it does not trigger camera later, see top of this file
        $scope.loading = false;
        $scope.$apply();
      }, 
      function(message) {
          console.log(message);
          pageTransitionListener(); // Turn off event listener
          $scope.loading = false;
          $scope.$apply();
      },
      { quality: 100, allow_edit:true, targetWidth: 1600, targetHeight: 1200, correctOrientation: true, destinationType: Camera.DestinationType.FILE_URI });
  }

  function checkinSuccessful(response) {
    User.setLastCheckinAt(Date.now());
    $scope.loading = false;
    navigator.notification.alert(response.message, goBack, Lang.en.checkin_successful);
  }

  function errorCheckin(response) {
    navigator.notification.alert(Lang.en.error_checkin, null, Lang.en.error);
    $scope.loading = false;
    $scope.$apply();
  }

  function validate() {
    return ($scope.spot !== undefined && $scope.rating !== undefined && $scope.activity !== undefined);
  }

  function goBack() {
    $navigate.back();
    $scope.$apply();
  }

});