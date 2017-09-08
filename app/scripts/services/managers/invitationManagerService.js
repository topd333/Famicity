angular.module('famicity').factory('invitationManagerService', function() {
  'use strict';
  return {
    data: {
      sent_invitations: {
        users: []
      },
      received_invitations: {
        users: []
      }
    }
  };
});
