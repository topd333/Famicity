angular.module('famicity').factory('LandingPage', function($resource, configuration, resourceTransformer) {
  'use strict';
  var LandingPage;
  LandingPage = $resource(configuration.api_url + '/landing_pages/get_shared_informations', null, {
    get_shared_informations: {
      params: {
        token_id: '@token_id',
        object_id: '@object_id',
        object_type: '@object_type'
      },
      transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'info', status)
    }
  });
  return LandingPage;
});
