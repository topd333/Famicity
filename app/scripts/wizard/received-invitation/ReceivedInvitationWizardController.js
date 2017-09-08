angular.module('famicity')
  .controller('ReceivedInvitationWizardController', function(
    $scope, $rootScope, userManager, WizardService, notification,
    pubsub, $location, $state, sessionManager, $timeout,
    wizardInvitations, InvitationService, PUBSUB, me) {
    'use strict';
    const invitationService = InvitationService;

    $scope.me = me;

    $scope.acceptAllRemaingInvitationsMessage = 'ACCEPT_ALL_INVITATIONS';

    $scope.wizardInvitations = wizardInvitations;
    let remainingInvitationsCount = wizardInvitations.length;

    const invitation_ids = $scope.wizardInvitations.map(function(invitation) {
      return invitation.id;
    });

    const removeInvitation = function() {
      $scope.acceptAllRemaingInvitationsMessage = 'ACCEPT_REMAINING_INVITATIONS';
      remainingInvitationsCount--;
      if (remainingInvitationsCount <= 0) {
        $scope.goToNextStep();
      }
    };

    // TODO: Insulate toast displays in dedicated, independent controller/directive
    pubsub.subscribe(PUBSUB.INVITATIONS.ACCEPTED, removeInvitation, $scope);
    pubsub.subscribe(PUBSUB.INVITATIONS.DECLINED, removeInvitation, $scope);

    $scope.acceptMultiple = function() {
      $scope.multiplePending = true;
      invitationService.acceptMultiple(invitation_ids)
      .then(function() {
        notification.add('INVITATIONS_ACCEPTED_SUCCESS_MSG');
        $scope.goToNextStep();
      })
      .finally(() => $scope.multiplePending = false);
    };
  });
