angular.module('famicity').factory('UserEmail', function($resource, resourceTransformer, configuration) {
  'use strict';
  var UserEmail;
  UserEmail = $resource(configuration.api_url + '/users/:user_id/user_emails/:email_id', {
    user_id: '@user_id',
    email_id: '@email_id'
  }, {
    query: {
      isArray: false
    },
    edit: {
      url: configuration.api_url + '/users/:user_id/user_emails/:email_id/edit',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user_email', status)
    },
    update: {
      method: 'PUT',
      transformRequest: function(data) {
        var attrs;
        attrs = {};
        attrs.user_email = angular.copy(data);
        if (attrs.user_email.id != null) {
          delete attrs.user_email.id;
        }
        if (attrs.user_email.is_used_for_authenticate != null) {
          delete attrs.user_email.is_used_for_authenticate;
        }
        if (attrs.user_email.type) {
          delete attrs.user_email.type;
        }
        delete attrs.user_email.destroyable;
        return angular.toJson(attrs);
      }
    },
    use_for_authenticate: {
      method: 'PUT',
      url: configuration.api_url + '/users/:user_id/user_emails/:email_id/use_for_authenticate'
    },
    send_user_email_validation: {
      method: 'PUT',
      url: configuration.api_url + '/users/:user_id/user_emails/:email_id/send_user_email_validation'
    },
    validation: {
      method: 'PUT',
      params: {
        user_id: '@user_id',
        token: '@token'
      },
      url: configuration.api_url + '/users/:user_id/user_emails/validation/:token'
    }
  });
  return UserEmail;
});
