angular.module('famicity').controller('WizardInviteMenuController', function($scope, $state, $analytics) {
  'use strict';
  $scope.invite = () => {
    $state.go('wizard-invite-emails');
    $analytics.trackEvent('wizard-invitation', 'invite');
  };
  $scope.sync = () => {
    $state.go('wizard-find-friends');
    $analytics.trackEvent('wizard-invitation', 'sync');
  };
  $scope.nextStep = () => {
    $scope.goToNextStep();
    $analytics.trackEvent('wizard-invitation', 'skip');
  };
});
