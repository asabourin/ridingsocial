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
        Sessions.unlike(User.token(), $scope.session.id, function(response) {
          $scope.session.liked = false;
          $scope.session.nb_likes -= 1;
        });
      }
      else {
        Sessions.like(User.token(), $scope.session.id, function(response) {
          $scope.session.liked = true;
          $scope.session.nb_likes += 1;
        });
      }
    };

    $scope.showComments = function () {
      $rootScope.session = $scope.session;
      Sessions.comments($scope.session.id, function(response) {
        $rootScope.comments = response;
      });
      Sessions.likes($scope.session.id, function(response) {
        $rootScope.likes = response;
      });
      $rootScope.commentsOpen = true;
    };

    $scope.hideComments = function () {
      $rootScope.comments = [];
      $rootScope.likes = [];
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
        });
      }
    };

});
