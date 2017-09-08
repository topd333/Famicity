angular.module('famicity').controller('ReceivedInvitationsController', function(
  $scope, receivedInvitations, me) {
  'use strict';
  $scope.me = me;
  $scope.receivedInvitations = receivedInvitations.map((invitation) => {
    invitation.avatar_url = invitation.user.avatar_url;
    return invitation;
  });
});
