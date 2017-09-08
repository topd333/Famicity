angular.module('famicity')
  .factory('Group', function($resource, configuration, resourceTransformer) {
    'use strict';
    return $resource(configuration.api_url + '/users/:user_id/groups/:group_id', {
      group_id: '@id',
      user_id: '@user_id'
    }, {
      query: {
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'groups', status),
        isArray: true
      },
      addMembers: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/groups/:group_id/add_members'
      },
      remove_members: {
        method: 'POST',
        url: configuration.api_url + '/users/:user_id/groups/:group_id/remove_members'
      },
      getNames: {
        isArray: true,
        url: configuration.api_url + '/groups/get_group_names',
        transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'groups', status)
      },
      update: {
        method: 'PUT'
      }
    });
  });
