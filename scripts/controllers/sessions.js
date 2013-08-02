angular.module('App')
  .controller('SessionController', function(Sessions, User, Spots, $scope, $rootScope, $navigate) {

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

    $scope.goToComments = function() {
      $navigate.go('/sessions/'+$scope.session.id+'/comments');
    };

})

 .controller('CommentsController', function(Sessions, User, Spots, $scope, $rootScope, $routeParams) {

    var session_id = $routeParams.id;

    $scope.commentsLoading = true;
    Sessions.comments(session_id, function(response) {
      $scope.comments = response;
      $scope.commentsLoading = false;
    });
    Sessions.likes(session_id, function(response) {
      $scope.likes = response;
      $scope.commentsLoading = false;
    });

    $scope.postComment = function() {
      if($scope.reply && !$scope.posting_comment) {
        $scope.posting_comment = true;
        Sessions.postComment(User.token(), session_id, $scope.reply, function(response){
          $scope.comments.push(response);
          $scope.posting_comment = false;
          $scope.reply = '';
        }, function(error) {
          navigator.notification.alert(Lang.en.error_comment, null, Lang.en.error);
          $scope.posting_comment = false;
        });
      }
    };

});
