angular.module('famicity')
  .controller('WizardTreeController',
  function($scope, $state, sessionManager, pubsub, PUBSUB, wizardService) {
    'use strict';
    $scope.canUploadFile = !isMobile.phone && !isMobile.apple.tablet;
    $scope.canUseTree = !isMobile.phone;
    $scope.userId = sessionManager.getUserId();

    function unlockUser() {
      pubsub.publish(PUBSUB.USER.ACTIVATED);
    }

    $scope.goToTree = function() {
      unlockUser();
      wizardService.end();
      $state.go('u.tree', {user_id: $scope.userId});
    };

    $scope.goToHome = function() {
      unlockUser();
      wizardService.end();
      $state.go('u.home');
    };
  });
