angular.module('famicity')
  .factory('Directory', ($resource, configuration) => {
    'use strict';
    return $resource(configuration.api_url + '/users/directory/searches', {}, {
      directory_user: {
        method: 'GET',
        params: {user_id: '@user_id'},
        url: configuration.api_url + '/users/:user_id/directory'
      },
      create_from_directory: {
        method: 'POST', url: configuration.api_url + '/users/new/create_from_directory'
      },
      destroy_from_directory: {
        method: 'DELETE', url: configuration.api_url + '/users/:id/destroy_from_directory'
      },
      counters: {
        url: configuration.api_url + '/users/directory/counters'
      },
      forInvitation: {
        url: configuration.api_url + '/users/:user_id/directory_for_invitation'
      },
      destroyFromDirectory: {
        method: 'DELETE',
        url: configuration.api_url + '/users/:user_id/destroy_from_directory'
      },
      getImports: {
        isArray: true,
        url: configuration.api_url + '/users/directory/imports'
      }
    });
  });
