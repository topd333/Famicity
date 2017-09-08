angular.module('famicity').factory('UserInfo', function($resource, configuration, resourceTransformer) {
  'use strict';
  var UserInfo;
  UserInfo = $resource(configuration.api_url + '/users/:user_id/user_info', {
    user_id: '@user_id'
  }, {
    edit: {
      url: configuration.api_url + '/users/:user_id/user_info/edit',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user_info', status)
    },
    update: {
      method: 'PUT'
    }
  });
  return UserInfo;
});
