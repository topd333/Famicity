angular.module('famicity').factory('User', function($resource, configuration, resourceTransformer) {
  'use strict';

  const transformSessionUser = function(data) {
    // replace 'setting' with 'settings'
    try {
      data = JSON.parse(data);
      if (data.user && data.user.infos) {
        data.user.infos.settings = data.user.infos.setting;
        delete data.user.infos.setting;
      }
      // TODO nico: remove
      delete data.user.notifications;
    } catch (err) {
      return data;
    }
    return data;
  };

  return $resource(configuration.api_url + '/users/:id', {user_id: '@id'}, {
    destroyable: {
      isArray: true,
      url: configuration.api_url + '/users/:user_id/directory_destroyable',
      transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'users', status)
    },
    destroyMultiple: {
      method: 'DELETE',
      url: configuration.api_url + '/users/:user_id/destroy_multiple_from_directory'
    },
    forContent: {
      url: configuration.api_url + '/users/for_content',
      transformResponse: transformSessionUser
    },
    block: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/block'
    },
    authorize: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/authorize'
    },
    search: {
      type: 'cm',
      url: configuration.api_url + '/users/search'
    },
    getNames: {
      isArray: true,
      url: configuration.api_url + '/users/get_user_names',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'users', status)
    }
  });
});
