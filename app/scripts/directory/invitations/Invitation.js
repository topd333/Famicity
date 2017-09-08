angular.module('famicity')
.factory('Invitation', function($resource, $moment, configuration, resourceTransformer) {
  'use strict';
  const transformRequestInvitation = function(data) {
    const tData = angular.copy(data);
    delete tData.other_user;
    delete tData.in_groups;
    delete tData.id;
    delete tData.can_be_resent;
    delete tData.updated_at;
    delete tData.status;
    return angular.toJson({invitation: tData});
  };
  return $resource(configuration.api_url + '/users/:user_id/invitations/:invitation_id', {invitation_id: '@id'}, {
    get: {
      url: configuration.api_url + '/users/:user_id/invitations/:invitation_id/edit',
      transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'invitation', status)
    },
    save: {
      method: 'POST',
      transformResponse(data, headers, status) {
        const invitation = resourceTransformer.transform(data, 'invitation', status);
        if (invitation) {
          invitation.send_date = $moment(invitation.created_date, 'X').forServer();
        }
        return invitation;
      }
    },
    received: {
      isArray: true,
      url: configuration.api_url + '/users/:user_id/invitations/received',
      type: 'cmA',
      transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'invitations', status)
    },
    sent: {
      isArray: true,
      url: configuration.api_url + '/users/:user_id/invitations/sent',
      type: 'cmA',
      transformResponse(data, headers, status) {
        data = resourceTransformer.transform(data, 'invitations', status);
        data = data.map((invitation) => {
          invitation.is_invited_by_me = true;
          if (invitation.user_concerned) {
            invitation.user_concerned.is_invited_by_me = true;
          }
          if (invitation.other_user) {
            invitation.other_user.is_invited_by_me = true;
          }
          return invitation;
        });
        return data;
      }
    },
    resend: {
      method: 'PUT',
      url: configuration.api_url + '/users/:user_id/invitations/:invitation_id',
      transformRequest: transformRequestInvitation
    },
    accept: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/invitations/:invitation_id/accept'
    },
    sendMultiple: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/invitations/create_multiple'
    },
    // create_invitation: {method: 'POST', params: {user_id: '@user_id'}, url: configuration.api_url + '/users/:user_id/invitations'},
    create_from_users_user_invitations: {
      method: 'POST',
      params: {user_id: '@user_id'},
      url: configuration.api_url + '/users/:user_id/invitations/create_from_users'
    },
    create_from_emails_user_invitations: {
      method: 'POST',
      params: {user_id: '@user_id'},
      url: configuration.api_url + '/users/:user_id/invitations/create_from_emails'
    },
    accept_user_invitation: {
      method: 'POST',
      params: {user_id: '@user_id', id: '@id'},
      url: configuration.api_url + '/users/:user_id/invitations/:id/accept'
    },
    accept_multiple: {method: 'POST', params: {id: '@id'}, url: configuration.api_url + '/accept_multi'},
    get_external_import_url: {
      method: 'GET',
      params: {user_id: '@user_id'},
      url: configuration.api_url + '/users/:user_id/launch_import'
    },
    send_information_external_import_users: {
      method: 'POST',
      params: {user_id: '@user_id'},
      url: configuration.api_url + '/import/give_answer'
    },
    get_external_import_users: {
      method: 'GET',
      params: {user_id: '@user_id'},
      url: configuration.api_url + '/import/get_status'
    },
    directory_for_invitation: {
      method: 'GET',
      url: configuration.api_url + '/users/:user_id/directory_for_invitation'
    },
    send_multiple_invitations: {
      method: 'POST',
      params: {user_id: '@user_id'},
      url: configuration.api_url + '/users/:user_id/invitations/create_multiple'
    }
  });
});
