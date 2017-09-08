angular.module('famicity')
  .factory('Profile', function($resource, configuration, resourceTransformer) {
    'use strict';
    return $resource(configuration.api_url + '/users/:user_id', {user_id: '@id'}, {
      edit: {
        url: configuration.api_url + '/users/:user_id/edit',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user', status)
      },
      update_profile: {
        method: 'PUT',
        url: configuration.api_url + '/users/:user_id',
        transformRequest: data => {
          let userToUpdate = angular.copy(data.user); // Don't delete original user properties
          delete userToUpdate.global_state;
          delete userToUpdate.avatar_url;
          delete userToUpdate.user_name;
          delete userToUpdate.id;
          return angular.toJson(userToUpdate);
        }
      },
      get: {
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'user', status)
      },
      getShort: {
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'short', status)
      }
    });
  });
