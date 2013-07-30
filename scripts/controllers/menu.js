 angular.module('App').controller('MenuController', function(User, $scope, $rootScope, $navigate) {

    $scope.preferences = User.getPreferences();

    $rootScope.openMenu = function () {
      $scope.menuOpen = true;
    };

    $rootScope.closeMenu = function () {
      $scope.menuOpen = false;
    };

    $scope.updatePreferences = function() {
      User.updatePreferences({notify: $scope.preferences.notify});
    };

    $rootScope.optsMenu = {
      backdropFade: false,
      dialogFade:false,
      backdropClick: false
    };

    $scope.goToDesktopSite = function () {
      window.open('http://www.ridingsocial.net', '_system', 'location=yes');
    };

    $scope.logout = function() {logout();};

    function logout() {
        $scope.menuOpen = false;
        User.logout();
        $navigate.go('/start', 'fade');
    }

});