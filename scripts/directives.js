angular.module('App')

.directive('ngTouch', function () {
        return function ($scope, $element, $attrs) {
            $element.bind('touchend', function () {
                if(!$scope.$$phase) {
                    $scope.$apply($attrs['ngTouch']);
                }
            });
        };
})