angular.module('famicity').controller('PasswordController', function(
  $scope, $timeout, $http, $stateParams, $state,
  $rootScope, $location, PasswordRecovery, sessionManager, notification,
  locale) {
  'use strict';
  $scope.recover = {};

  if ($state.current.data && $state.current.data.auth) {
    $scope.$parent.menuDisabled = true;
  }
  $scope.locale = locale;
  // $scope.email = $stateParams.email || null;
  if ($state.current.name === 'reset_password') {
    PasswordRecovery.get_reset({
      user_id: $stateParams.user_id,
      token: $stateParams.token
    }).$promise.catch(function() {
        $state.go('public.base');
      });
  }
  if ($state.current.name === 'public.password_recoveries') {
    $scope.recover.userEmail = $stateParams.email || sessionManager.getEmail();
  }
  $rootScope.notifications = notification.list;
  $scope.submitted = false;
  $scope.resetFormSubmitted = false;
  $scope.passwordTooltip = 'PASSWORD_TOOLTIP';
  $scope.passwords = {
    userPassword: null,
    userPasswordConfirmation: null
  };
  $scope.formInProgress = false;

  $scope.recovery = function() {
    const promises = [];
    $scope.submitted = true;
    if ($scope.loginForm.$valid) {
      promises.push(PasswordRecovery.password_recovery({
        email: $scope.recover.userEmail
      }).$promise.then(function() {
          sessionManager.setEmail($scope.recover.userEmail);
          return $location.url('/forgotten-password-s2');
        }));
    } else {
      notification.add('INVALID_EMAIL', {warn: true});
    }
    return promises;
  };

  $scope.checkCaps = function(e) {
    const s = String.fromCharCode(e.which);
    if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
      $scope.passwordTooltip = 'CAPSLOCK_WARNING';
    } else {
      $scope.passwordTooltip = 'PASSWORD_TOOLTIP';
    }
  };

  $scope.reset = function() {
    const promises = [];
    const userId = $stateParams.user_id || sessionManager.getUserId();
    $scope.resetFormSubmitted = true;
    if ($scope.passwords.userPassword !== $scope.passwords.userPasswordConfirmation) {
      notification.add('DIFFERENT_PASSWORD_ERROR_MSG', {warn: true});
    } else if ($scope.loginForm.$invalid) {
      notification.add('INVALID_PASSWORDS', {warn: true});
    } else {
      promises.push(PasswordRecovery.put_reset({
        user_id: userId,
        token: $stateParams.token,
        user: {
          password: $scope.passwords.userPassword,
          password_confirmation: $scope.passwords.userPasswordConfirmation
        }
      }).$promise.then(function() {
          var _ref1;
          if (((_ref1 = $state.current.data) != null ? _ref1.auth : undefined) === true) {
            $scope.$parent.menuDisabled = false;
            $state.go('u.settings-providers');
          } else {
            $state.go('sign-in');
          }
          notification.add('PASSWORD_CHANGE_SUCCESS_MSG');
        }));
    }
    return promises;
  };

});
