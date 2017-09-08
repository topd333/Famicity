angular.module('famicity')
  .factory('Comment', function($resource, configuration, resourceTransformer) {
    'use strict';

    return $resource(configuration.api_url + '/users/:user_id/comments/:comment_id', {
      comment_id: '@id'
    }, {
      query: {
        isArray: false
      },
      edit: {
        method: 'GET',
        url: configuration.api_url + '/users/:user_id/comments/:comment_id/edit',
        transformResponse: function(data, headers, status) {
          return resourceTransformer.transformResponse(data, 'comment', status);
        }
      },
      update: {
        method: 'PUT',
        transformResponse: function(data, headers, status) {
          return resourceTransformer.transformResponse(data, 'comment', status);
        }
      }
    });
  });
