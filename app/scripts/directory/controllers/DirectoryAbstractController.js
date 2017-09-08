// @flow weak

angular.module('famicity').controller('DirectoryAbstractController', function(
  $scope, $rootScope, ModalManager, groupService, InvitationService,
  invitationManagerService, profileService, $stateParams, notification,
  LoadingAnimationUtilService,
  me, receivedInvitations, sentInvitations, groups) {
  'use strict';

  $scope.userId = me.id;
  $scope.data = invitationManagerService.data;
  $scope.receivedInvitations = receivedInvitations;
  $scope.sentInvitations = sentInvitations;
  $scope.groups = groups;

  profileService.getBasicProfile($scope.userId, 'short', $scope);

  $scope.init = function() { };

  $scope.openAddContactsOptionsPopup = function() {
    return ModalManager.open({
      templateUrl: '/views/popup/popup_add_contacts_options.html',
      controller: 'AddContactsOptionsPopupController',
      scope: $scope
    });
  };
  $scope.reviveInvitation = function(invitation) {
    $scope.invitationDate = invitation.updated_at;
    $scope.reviveInvitationId = invitation.id;
    $scope.reviveInvitationEmail = invitation.mail_address;
  };
  $scope.openAddGroupPopup = function() {
    ModalManager.open({
      templateUrl: '/views/popup/popup_add_group.html',
      controller: 'AddGroupPopupController',
      scope: $scope
    });
  };
});
