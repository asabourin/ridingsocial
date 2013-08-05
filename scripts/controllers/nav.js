angular.module('App')

// This one is just to enable mobile-navigate
.controller('NavController', function($scope, $rootScope, $location, $navigate) {
  
    $rootScope.navigate = $navigate;

    $rootScope.$on('backButton', function(event, args) {
        if(anyModalOpen()) {
          closeAllModals();
        }
        else if($rootScope.main_tab !== 'map') {
          $rootScope.main_tab = 'map';
        }
        else {
          navigator.app.exitApp();
        }
    });

    function anyModalOpen() {
      return ($rootScope.menuOpen === true || $rootScope.othersOpen === true || $rootScope.commentsOpen === true);
    }

    function closeAllModals() {
        if($rootScope.othersOpen){
            $rootScope.hideOthers(); // Defined in Sessions controller
        }
        if($rootScope.menuOpen) {
            $rootScope.closeMenu(); // Defined in Menu controller
        }
        if($rootScope.commentsOpen) {
            $rootScope.closeComments(); //Defined in Sessions controller
        }
    }

});
