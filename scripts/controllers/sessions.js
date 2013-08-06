angular.module('App')
  .controller('SessionController', function(Sessions, User, Notifications, $scope, $rootScope, $navigate) {

    $scope.showOthers = function (session_id) {
      $rootScope.this_session = $scope.session;
      $rootScope.othersOpen = true;
    };

    $rootScope.hideOthers = function () {
      $rootScope.othersOpen = false;
    };

    $scope.toggleLikeSession = function() {
      if($scope.session.liked) {
        $scope.session.liked = false;
        $scope.session.nb_likes -= 1; // Outside the success function of below to make it feels faster
        Sessions.unlike(User.token(), $scope.session.id, function(response) {
        });
      }
      else {
        $scope.session.liked = true;
        $scope.session.nb_likes += 1; // Outside the success function of below to make it feels faster
        Sessions.like(User.token(), $scope.session.id, function(response) {
          Notifications.liked(User.token(), response.id)
        });
      }
    };

})

 .controller('CommentsController', function(Sessions, User, Notifications, $scope, $rootScope, $routeParams) {

    $rootScope.showComments = function (session_id) { // Called from the session partial

      $scope.comments = undefined;
      $scope.likes = undefined;
      $scope.commentsLoading = true;
      $scope.session_id = session_id;

      Sessions.comments(session_id, function(response) {
        $scope.comments = response;
        $scope.commentsLoading = false;
      });
      
      Sessions.likes(session_id, function(response) {
        $scope.likes = response;
        $scope.commentsLoading = false;
      });
      
      $rootScope.commentsOpen = true;
    };

    $rootScope.hideComments = function () {
      $scope.comments = undefined;
      $scope.likes = undefined;
      $scope.commentsOpen = false;
    };

    $scope.postComment = function() {
      if($scope.reply && !$scope.posting_comment) {
        $scope.posting_comment = true;
        Sessions.postComment(User.token(), $scope.session_id, $scope.reply, function(response){
          $scope.comments.push(response);
          $scope.posting_comment = false;
          $scope.reply = '';
          Notifications.commented(User.token(), response.id)
        }, function(error) {
          navigator.notification.alert(Lang.en.error_comment, null, Lang.en.error);
          $scope.posting_comment = false;
        });
      }
    };

    $rootScope.closeComments = function () {
      $rootScope.commentsOpen = false;
    };

});
