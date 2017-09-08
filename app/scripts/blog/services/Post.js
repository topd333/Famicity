angular.module('famicity').factory('Post', function($resource, configuration, resourceTransformer) {
  'use strict';
  return $resource(configuration.api_url + '/users/:user_id/posts/:post_id', {post_id: '@id'}, {
    get: {
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'post', status)
    },
    query: {
      isArray: false
    },
    edit: {
      url: configuration.api_url + '/users/:user_id/posts/:post_id/edit'
    },
    update: {
      method: 'PUT'
    },
    delete_photo: {
      method: 'DELETE',
      url: configuration.api_url + '/users/:user_id/posts/:post_id/post_photos/:id'
    }
  });
});
