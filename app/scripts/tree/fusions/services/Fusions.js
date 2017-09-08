angular.module('famicity.gedcom').factory('Fusion', function($resource, configuration, resourceTransformer) {
  'use strict';

  const fusionListTransform = (data, headers, status) => resourceTransformer.transform(data, 'fusion_list', status);

  return $resource(configuration.api_url + '/users/:user_id/fusions/:id', {id: '@id', user_id: '@user_id'}, {
    query: {
      isArray: false,
      transformResponse: fusionListTransform
    },
    received: {
      url: configuration.api_url + '/users/:user_id/fusions/received',
      transformResponse: fusionListTransform
    },
    sent: {
      url: configuration.api_url + '/users/:user_id/fusions/sent',
      transformResponse: fusionListTransform
    },
    cancel: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/fusions/:id/cancel'
    },
    accept: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/fusions/:id/accept'
    },
    refuse: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/fusions/:id/refuse'
    }
  });
});
