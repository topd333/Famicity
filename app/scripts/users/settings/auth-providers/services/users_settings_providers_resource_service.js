angular.module('famicity').factory('Provider', function($resource, configuration) {
  'use strict';
  var Provider;
  Provider = $resource(configuration.api_url + '/auth_providers/:name', {
    name: '@name'
  }, {});
  return Provider;
});
