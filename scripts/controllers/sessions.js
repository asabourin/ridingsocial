angular.module('App')
  .controller('SessionController', function(Sessions, User, $scope, $rootScope) {

    $scope.showOthers = function (session_id) {
      $rootScope.this_session = _.find($scope.sessions, function(s) {return s.id == session_id})
      $rootScope.othersOpen = true;
    };
    $rootScope.hideOthers = function () {
      $rootScope.othersOpen = false;
    };

    $scope.showComments = function () {
	$rootScope.session = $scope.session
      Sessions.comments($scope.session.id, function(response) {
        $rootScope.comments = response
      })
      Sessions.likes($scope.session.id, function(response) {
        $rootScope.likes = response
      })
      $rootScope.commentsOpen = true;
    };
    $scope.hideComments = function () {
      $rootScope.comments = []
      $rootScope.session = null
      $rootScope.commentsOpen = false;
    };

    $scope.postComment = function(session_id) {
    	if($scope.reply && !$scope.post_comment_loading) {
    		$scope.post_comment_loading = true
    		Sessions.postComment(User.token(), session_id, $scope.reply, function(response){
    			$rootScope.comments.push(response)
    			$scope.post_comment_loading = false
    			$scope.reply = ''
    		})
    	}
    }

    $scope.toggleLikeSession = function() {
      if($scope.session.liked) {
        Sessions.unlike(User.token(), $scope.session.id, function(response) {
          $scope.session.liked = false
          $scope.session.nb_likes -= 1
        })
      }
      else {
        Sessions.like(User.token(), $scope.session.id, function(response) {
          $scope.session.liked = true
          $scope.session.nb_likes += 1
        })
      }
    }

})
