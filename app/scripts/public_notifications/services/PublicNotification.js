angular.module('famicity').factory('PublicNotification', function($resource, configuration, resourceTransformer) {
  'use strict';
  return $resource(configuration.api_url + '/public_parameters/:user_id/:token', {
    user_id: '@user_id',
    token: '@token'
  }, {
    get: {
      transformResponse(data) {
        data = angular.fromJson(data);
        if (data.setting) {
          data = data.setting;
          // Remove mobile notifications
          delete data.birthday_reminder_notifications;
          delete data.event_reminder_notifications;
          delete data.new_album_notifications;
          delete data.new_close_invitation_notifications;
          delete data.new_close_notifications;
          delete data.new_message_notifications;
          delete data.new_post_notifications;
        }
        return data;
      }
    },
    update: {
      method: 'PUT',
      transformRequest(data) {
        const attrs = {};
        attrs.setting = angular.copy(data);
        return angular.toJson(attrs);
      },
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'setting', status)
    }
  });
});
