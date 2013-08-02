angular.module('App')
  .controller('SessionController', function(Sessions, User, Spots, $scope, $rootScope, $window) {

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
        });
      }
    };

    $scope.showComments = function () {
      $rootScope.session = $scope.session;
      $rootScope.commentsLoading = true;
      Sessions.comments($scope.session.id, function(response) {
        $rootScope.comments = response;
        $rootScope.commentsLoading = false;
      });
      Sessions.likes($scope.session.id, function(response) {
        $rootScope.likes = response;
        $rootScope.commentsLoading = false;
      });
      $rootScope.commentsOpen = true;
    };

    $scope.hideComments = function () {
      $rootScope.comments = undefined;
      $rootScope.likes = undefined;
      $rootScope.session = null;
      $rootScope.commentsOpen = false;
    };

    $scope.postComment = function(session_id) {
      if($scope.reply && !$scope.posting_comment) {
        $scope.posting_comment = true;
        Sessions.postComment(User.token(), session_id, $scope.reply, function(response){
          $rootScope.comments.push(response);
          $scope.posting_comment = false;
          $scope.reply = '';
        }, function(error) {
          navigator.notification.alert(Lang.en.error, null, Lang.en.error_comment);
          $scope.posting_comment = false;
        });
      }
    };

});
