angular.module('famicity')
  .factory('Tree', ($resource, configuration) => {
    'use strict';
    return $resource(configuration.api_url + '/users/:user_id/tree', {
      user_id: '@id',
      matching_id: '@matching_id'
    }, {
      getMatchings: {
        url: configuration.api_url + '/users/:user_id/tree/match'
      },
      answerMatching: {
        method: 'PUT',
        url: configuration.api_url + '/users/:user_id/tree/match/:matching_id'
      },
      tree_user: {
        params: {user_id: '@user_id'},
        url: configuration.api_url + '/users/:user_id/tree'
      },
      isTreeBlocked: {
        url: configuration.api_url + '/trees/is_tree_blocked/:user_id'
      }
    });
  });
