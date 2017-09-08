angular.module('famicity')
  .factory('Permission', function($resource, configuration, resourceTransformer) {
    'use strict';
    return $resource(configuration.api_url, {}, {
      get: {
        url: configuration.api_url + '/permissions/:object_type/:object_id/get'
      },
      save: {
        method: 'POST',
        url: configuration.api_url + '/permissions/:object_type/:object_id/set'
      },
      check: {
        method: 'GET',
        url: configuration.api_url + '/permissions/:object_type/:object_id/check'
      },
      getDefault: {
        url: configuration.api_url + '/default_permissions/:user_id/get',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'permissions', status)
      },
      set_default: {
        method: 'POST',
        url: configuration.api_url + '/default_permissions/:user_id/set'
      },
      get_tree_permissions: {
        url: configuration.api_url + '/tree_permissions/:user_id/get'
      },
      set_tree_permissions: {
        method: 'POST',
        url: configuration.api_url + '/tree_permissions/:user_id/set'
      },
      autocomplete: {
        url: configuration.api_url + '/users/get_permission?q=:query',
        isArray: true,
        type: 'cmA',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'permissions', status)
      }
    });
  });
