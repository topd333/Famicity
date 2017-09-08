angular.module('famicity')
  .factory('Like', function($resource, configuration, resourceTransformer) {
    'use strict';

    var Like;
    Like = $resource(configuration.api_url + '/likes', {}, {
      query: {
        isArray: true,
        params: {
          object_id: '@object_id',
          object_type: '@object_type'
        },
        transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'likes', status)
      },
      like: {
        method: 'POST',
        params: {
          object_id: '@object_id',
          object_type: '@object_type'
        },
        url: configuration.api_url + '/likes/like/:object_id/:object_type'
      }
    });
    return Like;
  });
