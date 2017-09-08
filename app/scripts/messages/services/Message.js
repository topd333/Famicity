angular.module('famicity')
/**
 * The REST resource to get discussions and messages in those discussions.
 */
  .factory('Message', function($resource, configuration) {
    'use strict';
    return $resource(configuration.api_url + '/users/:user_id/messages/:message_id', {
      message_id: '@id'
    }, {
      query: {
        isArray: false
      },
      messages_children: {
        method: 'GET',
        url: configuration.api_url + '/users/:user_id/messages/:message_id/children'
      }
    });
  });
