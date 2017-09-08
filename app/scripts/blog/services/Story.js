angular.module('famicity.story').factory('Story', function($resource, configuration, resourceTransformer) {
  'use strict';

  function isVowel(c) {
    return ['a', 'e', 'i', 'o', 'u', 'y'].indexOf(c) !== -1;
  }

  const storyTransform = function(data, headers, status) {
    data = resourceTransformer.transformResponse(data, 'story', status);
    if (data && data.month) {
      data.month = data.month.toLowerCase();
      if (isVowel(data.month[0])) {
        data.vowel = true;
      }
    }
    return data;
  };

  return $resource(configuration.api_url + '/stories/:id', {id: '@id'}, {
    get: {
      transformResponse: storyTransform
    },
    query: {
      isArray: true,
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'stories', status)
    },
    current: {
      url: configuration.api_url + '/stories/current',
      transformResponse: storyTransform,
      type: 'cm'
    },
    getPosts: {
      isArray: true,
      url: configuration.api_url + '/stories/:id/posts',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'stories', status)
    }
  });
});
