angular.module('famicity').filter('directoryInvitationsList', function() {
  'use strict';
  return function(invitations) {
    let filtered;
    let getInitial;
    let group_changed;
    let new_field;
    let prev_invitation;
    if (invitations) {
      filtered = [];
      prev_invitation = null;
      group_changed = false;
      new_field = 'group_by_CHANGED';
      getInitial = function(invitation) {
        if (invitation.mail_address) {
          invitation.initial = invitation.mail_address.charAt(0).toUpperCase();
        }
        return invitation.initial;
      };
      angular.forEach(invitations, function(invitation) {
        group_changed = false;
        if (prev_invitation !== null) {
          if (getInitial(prev_invitation) !== getInitial(invitation)) {
            group_changed = true;
          }
        } else {
          group_changed = true;
        }
        if (group_changed) {
          invitation[new_field] = true;
        } else {
          invitation[new_field] = false;
        }
        filtered.push(invitation);
        prev_invitation = invitation;
      });
    }
    return filtered;
  };
});
