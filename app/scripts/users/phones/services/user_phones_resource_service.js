angular.module('famicity').factory('UserPhone', function($resource, configuration, resourceTransformer) {
  'use strict';
  var UserPhone;
  UserPhone = $resource(configuration.api_url + '/users/:user_id/user_phones/:phone_id', {
    'user_id': '@user_id',
    'phone_id': '@phone_id'
  }, {
    edit: {
      url: configuration.api_url + '/users/:user_id/user_phones/:phone_id/edit',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user_phone', status)
    },
    save: {
      method: 'POST',
      transformRequest: function(data) {
        var attrs;
        attrs = {};
        attrs.user_phone = angular.copy(data);
        return angular.toJson(attrs);
      }
    },
    update: {
      method: 'PUT',
      transformRequest: function(data) {
        var attrs;
        attrs = {};
        attrs.user_phone = angular.copy(data);
        delete attrs.user_phone.destroyable;
        delete attrs.user_phone.type;
        delete attrs.user_phone.id;
        return angular.toJson(attrs);
      }
    }
  });
  return UserPhone;
});
