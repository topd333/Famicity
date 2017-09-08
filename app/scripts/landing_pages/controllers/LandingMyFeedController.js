
angular.module('famicity').controller('LandingMyFeedController', function(
  $scope, $rootScope, $location, $stateParams, notification, sessionManager, $window) {
  'use strict';
  const resize = function() {
    if ($window.innerHeight > 800) {
      angular.element('#slide1').css('min-height', $window.innerHeight);
    } else {
      angular.element('#slide1').css('min-height', 800);
    }
  };
  $scope.init = function() {
    sessionManager.setReferral({
      landing: $location.path()
    });
    $scope.showSpamMsg = $stateParams.version && $stateParams.version === 'B';
    angular.element('#slide1').parallax('center', 0.1, true);
    angular.element('#image-slide2').parallax('center', 0.1, true);
    angular.element('#image-slide3').parallax('center', 0.1, true);
    angular.element('#image-slide4').parallax('center', 0.05, true);
    angular.element('#image-slide5').parallax('center', 0.03, true);
    resize();
    $window.onresize = function() {
      resize();
    };
  };
});
