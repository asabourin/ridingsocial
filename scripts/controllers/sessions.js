angular.module('App')
  .controller('Sessions.followed', function(Sessions, User, $scope, $rootScope, $location) {

    // Init

    $rootScope.showNav = true

    // Events

    $rootScope.$on("sessionsUpdated", function (event, args) {
        $scope.loading = false
        $scope.sessions = args.sessions
    })

})
  .controller('SessionController', function(Sessions, User, $scope, $rootScope) {

    $scope.showOthers = function (session_id) {
      $rootScope.this_session = _.find($scope.sessions, function(s) {return s.id == session_id})
      $rootScope.othersOpen = true;
    };
    $rootScope.hideOthers = function () {
      $rootScope.othersOpen = false;
    };

    $scope.showComments = function () {
      Sessions.comments($scope.session.id, function(response) {
        $rootScope.comments = response
      })
      $rootScope.commentsOpen = true;
    };
    $scope.hideComments = function () {
      $rootScope.comments = []
      $rootScope.commentsOpen = false;
    };

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
