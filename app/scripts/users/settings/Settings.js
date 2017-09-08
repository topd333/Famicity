angular.module('famicity')
  .factory('Settings', function(
    $resource, $location, $filter, notification, configuration) {
    'use strict';

    return $resource(configuration.api_url, {}, {
      show_settings: {
        method: 'GET',
        params: {
          user_id: '@user_id',
          settings_id: '@settings_id'
        },
        url: configuration.api_url + '/users/:user_id/settings/:settings_id'
      },
      update_settings: {
        method: 'PUT',
        params: {
          user_id: '@user_id',
          settings_id: '@settings_id'
        },
        url: configuration.api_url + '/users/:user_id/settings/:settings_id'
      }
    });
  });
