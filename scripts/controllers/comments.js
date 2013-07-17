angular.module('App')
  .controller('CommentsController', function(Sessions, $scope, $rootScope) {

    $rootScope.showComments = function (session_id) {
      Sessions.comments(session_id, function(response) {
        $scope.comments = response
      })
      $scope.commentsOpen = true;
    };
    $rootScope.hideComments = function () {
      $scope.comments = []
      $scope.commentsOpen = false;
    };

})