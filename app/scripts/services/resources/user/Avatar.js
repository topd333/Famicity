angular.module('famicity')
  .factory('Avatar', function(configuration, $resource, resourceTransformer) {
    'use strict';
    return $resource(configuration.api_url + '/users/:user_id/avatars/:avatar_id', {
      avatar_id: '@id',
      user_id: '@user_id'
    }, {
      query: {
        url: configuration.api_url + '/users/:user_id/avatars',
        isArray: true,
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'avatars', status)
      },
      get_previous_avatar: {
        url: configuration.api_url + '/users/:user_id/avatars/:id/previous_avatar'
      },
      get_next_avatar: {
        url: configuration.api_url + '/users/:user_id/avatars/:id/next_avatar',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'avatar', status)
      },
      get: {
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'avatar', status)
      },
      edit: {
        url: configuration.api_url + '/users/:user_id/avatars/:id/edit',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'avatar', status)
      },
      set_current: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/avatars/:id/set_current'
      },
      crop: {
        method: 'POST',
        url: configuration.api_url + '/upload/crop/avatars/:user_id/:id'
      },
      update: {
        method: 'PUT'
      },
      load_slideshow: {
        url: configuration.api_url + '/users/:user_id/avatars/load_slideshow'
      }
    });
  });
