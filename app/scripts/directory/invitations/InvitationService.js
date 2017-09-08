angular.module('famicity')
.service('InvitationService', function(
  $resource, $location, $window, notification,
  pubsub, $q, PUBSUB, Invitation) {
  'use strict';

  return {
    // InvitationService.prototype.createInvitation = function(user_id, attrs, successCallback) {
    //   var type;
    //   type = (attrs != null ? attrs.type : void 0) != null ? attrs.type : 'I';
    //   if ((attrs != null ? attrs.type : void 0) != null) {
    //     delete attrs.type;
    //   }
    //   return new Invitation({
    //     invitation: attrs,
    //     type: type
    //   }).$create_invitation({
    //     user_id: user_id
    //   }, function(response) {
    //     if (successCallback) {
    //       successCallback(response);
    //     }
    //     return response;
    //   });
    // };

    createFromUsers(user_id, invitation, user_ids) {
      return new Invitation({invitation, user_ids}).$create_from_users_user_invitations({user_id});
    },
    createFromEmails(user_id, invitation, emails) {
      return Invitation.create_from_emails_user_invitations({user_id, invitation, emails});
    },
    acceptUserInvitation(user_id, invitation_id) {
      return Invitation.accept_user_invitation({id: invitation_id, user_id});
    },
    acceptMultiple(invitation_ids) {
      return Invitation.accept_multiple({invitation_ids}).$promise;
    },
    accept(user_id, invitation_id, userThatInvitedMe) {
      const deferredAcceptation = $q.defer();
      const invitationInfo = {id: invitation_id, user_id};
      Invitation.accept_user_invitation(invitationInfo).$promise.then(function() {
        pubsub.publish(PUBSUB.INVITATIONS.ACCEPTED, userThatInvitedMe);
        notification.add('ACCEPT_INVITATION', {
          messageParams: {userName: userThatInvitedMe.user_name}
        });
        deferredAcceptation.resolve();
      });
      return deferredAcceptation.promise;
    },
    remove(invitationId, meId) {
      return Invitation.remove({invitation_id: invitationId, user_id: meId}).$promise
      .then(function() {
        pubsub.publish(PUBSUB.INVITATIONS.DECLINED, invitationId);
      });
    },
    getExternalImportUrl(user_id, service) {
      return Invitation.get_external_import_url({
        url_to_redirect: 'https://' + document.domain + '/end_import.html',
        user_id,
        service
      });
    },
    sendInformationExternalImportUsers(params) {
      return Invitation.send_information_external_import_users(params);
    },
    getExternalImportUsers(params) {
      return Invitation.get_external_import_users(params);
    },
    directory_for_invitation(userId) {
      return Invitation.directory_for_invitation({user_id: userId});
    },
    send_multiple_invitations(params) {
      return Invitation.send_multiple_invitations(params);
    }
  };
});
