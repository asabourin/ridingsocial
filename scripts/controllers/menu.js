 angular.module('App').controller('MenuController', function(User, Geolocation, $scope, $rootScope, $navigate) {

    $scope.preferences = User.getPreferences();

    $rootScope.openMenu = function () {
      $rootScope.menuOpen = true;
    };

    $rootScope.closeMenu = function () {
      $rootScope.menuOpen = false;
    };

    $scope.updatePreferences = function() {
      User.updatePreferences({notify: $scope.preferences.notify});
    };

    $rootScope.optsMenu = {
      backdropFade: false,
      dialogFade:false,
      backdropClick: true
    };

    $scope.goToDesktopSite = function () {
      window.open('http://www.ridingsocial.net', '_system', 'location=yes');
    };

    $scope.goToMyProfile = function() {
      $rootScope.menuOpen = false;
      $navigate.go('/riders/'+User.id());
    };

    $scope.logout = function() {logout();};

    function logout() {
        $rootScope.menuOpen = false;
        Geolocation.resetPosition();
        User.logout();
        $navigate.go('/start', 'fade');
    }

});