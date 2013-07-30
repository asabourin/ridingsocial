//Fastclick
angular.module('App').directive("ngTap", function() {
  return function($scope, $element, $attributes) {
    var tapped = false;
    $element.bind("touchstart", function(event) {
      tapped = true;
      return true;
    });
    $element.bind("touchmove", function(event) {
      tapped = false;
      return event.stopImmediatePropagation();
    });
    return $element.bind("touchend", function() {
      if (tapped) {
        return $scope.$apply($attributes.ngTap);
      }
    });
  };
});

// Timeago filter using Moment.js
angular.module('App').filter('fromNow', function() {
  return function(date) {
    return moment(date).fromNow();
  };
});