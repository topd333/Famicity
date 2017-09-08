angular.module('famicity')
  .controller('SettingsAccountController', function(
    $scope, ModalManager, $state, $location, $stateParams,
    profileService, UserEmail, LoadingAnimationUtilService, me) {
    'use strict';
    $scope.userId = $scope.viewedUserId = me.id;
    $scope.settingsId = me.settings.id;
    $scope.refreshIndex = function() {
      return UserEmail.query({
        user_id: $scope.userId
      }).$promise.then(function(response) {
          $scope.emailsList = response.user_emails;
          angular.forEach($scope.emailsList, function(subList) {
            return angular.forEach(subList, function(val) {
              if (val.user_email.is_used_for_authenticate) {
                $scope.currentEmail = val.user_email;
              }
            });
          });
        });
    };
    LoadingAnimationUtilService.resetPromises();
    profileService.getBasicProfile($scope.userId, 'short', $scope);
    $scope.refreshIndex();
    $scope.isMenuPage = $state.current.name === 'u.settings';
    $scope.isSettingsPage = true;

    $scope.openChangePasswordPopup = function() {
      return ModalManager.open({
        templateUrl: '/views/popup/popup_change_password.html',
        controller: 'ChangePasswordPopupController',
        scope: $scope
      });
    };
    $scope.openChangeLoginMailPopup = function() {
      return ModalManager.open({
        templateUrl: '/scripts/users/emails/views/popup_user_emails_use_for_authenticate.html',
        controller: 'UserEmailsUseForAuthenticateController',
        scope: $scope
      }).result.then(function() {
          return $scope.refreshIndex();
        });
    };
    $scope.openValidateMailPopup = function(id) {
      return ModalManager.open({
        templateUrl: '/scripts/users/emails/views/popup_user_emails_send_user_email_validation.html',
        controller: 'UserEmailsSendUserValidationController',
        scope: $scope,
        resolve: {
          mailFormMode: () => 'validate',
          mailId: () => id
        }
      }).result.then(function() {
          return $scope.refreshIndex();
        });
    };
    $scope.openAddMailPopup = function() {
      return ModalManager.open({
        templateUrl: '/scripts/users/emails/views/popup_user_emails.html',
        controller: 'UserEmailsController',
        resolve: {
          mailFormMode: () => 'add',
          mailId: () => null,
          canDelete: () => false
        },
        scope: $scope
      }).result.then(function() {
          return $scope.refreshIndex();
        });
    };
    $scope.openEditMailPopup = function(id, canDelete) {
      return ModalManager.open({
        templateUrl: '/scripts/users/emails/views/popup_user_emails.html',
        controller: 'UserEmailsController',
        resolve: {
          mailFormMode: () => 'edit',
          mailId: () => id,
          canDelete: () => canDelete
        },
        scope: $scope
      }).result.then(() => $scope.refreshIndex());
    };
  });
