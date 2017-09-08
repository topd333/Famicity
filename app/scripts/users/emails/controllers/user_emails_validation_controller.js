angular.module('famicity').controller('UserEmailsValidationController', function(
  $scope, $rootScope, $stateParams, $state, UserEmail, LoadingAnimationUtilService, notification) {
  'use strict';
  $scope.init = function() {
    var userId;
    LoadingAnimationUtilService.resetPromises();
    $scope.success = false;
    userId = $stateParams['user_id'];
    UserEmail.validation({
      user_id: userId,
      token: $stateParams['token']
    }).$promise
      .then(function() {
        $scope.success = true;
      })
      .catch(function() {
        notification.add('ERROR_PLEASE_RETRY', {warn: true});
        $state.go('public.base');
      });
  };
});
