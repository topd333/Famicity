angular.module('famicity')
  .directive('fcInvitationsReceived', function(
    $rootScope, userManager, notification,
    pubsub, $location, $state, sessionManager, $timeout,
    InvitationService, PUBSUB) {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        invitations: '=',
        finished: '&'
      },
      templateUrl: '/scripts/directory/invitations/received/list/fc-received-invitations.html',
      controller($scope) {
        $scope.me = sessionManager.getUser();

        const invitations = $scope.invitations;

        $scope.acceptAllRemaingInvitationsMessage = 'ACCEPT_ALL_INVITATIONS';

        $scope.wizardInvitations = invitations;
        let remainingInvitationsCount = invitations.length;

        const invitation_ids = $scope.wizardInvitations.map(function(invitation) {
          return invitation.id;
        });

        const removeInvitation = function() {
          $scope.acceptAllRemaingInvitationsMessage = 'ACCEPT_REMAINING_INVITATIONS';
          remainingInvitationsCount--;
          if (remainingInvitationsCount <= 0) {
            $scope.finished();
          }
        };

        // TODO: Insulate toast displays in dedicated, independent controller/directive
        pubsub.subscribe(PUBSUB.INVITATIONS.ACCEPTED, removeInvitation, $scope);
        pubsub.subscribe(PUBSUB.INVITATIONS.DECLINED, removeInvitation, $scope);

        $scope.acceptMultiple = function() {
          $scope.multiplePending = true;
          InvitationService.acceptMultiple(invitation_ids)
          .then(function() {
            notification.add('INVITATIONS_ACCEPTED_SUCCESS_MSG');
            $scope.finished();
          })
          .finally(() => $scope.multiplePending = false);
        };
      }
    };
  });
