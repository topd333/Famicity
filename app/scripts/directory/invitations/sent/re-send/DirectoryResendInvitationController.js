// @flow weak

angular.module('famicity').controller('DirectoryResendInvitationController', (
  $scope, $q, $rootScope,
  pendingFormsManagerService, InvitationService, ModalManager, $stateParams,
  $location, $state, notification, LoadingAnimationUtilService,
  me, invitation, pubsub, PUBSUB, util) => {
  'use strict';

  $scope.userId = $scope.viewedUserId = me.id;
  $scope.invitation = invitation;
  $scope.submitted = false;
  $scope.invitation.newMailAddress = invitation.mail_address;

  $scope.submit = () => {
    $scope.submitted = true;
    // if the mail_address is not present (active user), or the email is correct
    if ($scope.invitationsForm.$valid && (!invitation.mail_address || util.validateEmail($scope.invitation.newMailAddress))) {
      $scope.invitation.mail_address = $scope.invitation.newMailAddress;
      delete $scope.invitation.newMailAddress;
      $scope.invitation.$resend({invitation_id: $scope.invitation.id, user_id: $scope.userId})
      .then(() => {
        $state.go('u.directory.sent-invitations');
        notification.add('INVITATION_RESENT_SUCCESS_MSG');
      });
    } else {
      notification.add('INVALID_EMAIL', {warn: true});
    }
  };
  pubsub.subscribe(PUBSUB.DIRECTORY.INVITATIONS.SENT.REVIVE, $scope.submit, $scope);
});
