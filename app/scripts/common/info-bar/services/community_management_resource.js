angular.module('famicity').factory('CommunityManagement', function($resource, configuration) {
  'use strict';

  return $resource(configuration.api_url + '/user_activities', {}, {
    next_sentence: {
      url: configuration.api_url + '/user_activities/next_sentence',
      type: 'cm'
    },
    update: {
      url: configuration.api_url + '/user_activities/:ref',
      method: 'PUT'
    }
  });
});
