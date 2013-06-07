angular.module('App')

.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
})

.directive('ngTouch', function () {
        return function ($scope, $element, $attrs) {
            $element.bind('touchend', function () {
                if(!$scope.$$phase) {
                    $scope.$apply($attrs['ngTouch']);
                }
            });
        };
    })