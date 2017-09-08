angular.module('famicity.gedcom')
  .factory('Gedcom', function($resource, configuration, resourceTransformer) {
    'use strict';

    return $resource(configuration.api_url + '/users/:user_id/gedcom_imports/:id',
      {
        id: '@id',
        user_id: '@user_id'
      },
      {
        summaries: {
          url: configuration.api_url + '/users/:user_id/gedcom_imports/gedcom_summary'
        },
        index: {
          isArray: true,
          url: configuration.api_url + '/users/:user_id/gedcom_imports',
          transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'gedcom_imports', status)
        },
        canUpload: {
          url: configuration.api_url + '/users/:user_id/gedcom_imports/can_upload'
        },
        cancel: {
          method: 'POST',
          url: configuration.api_url + '/users/:user_id/gedcom_imports/:id/cancel'
        },
        launch_import: {
          method: 'POST',
          url: configuration.api_url + '/users/:user_id/gedcom_imports/:id/launch_import'
        },
        cancel_import: {
          method: 'POST',
          url: configuration.api_url + '/users/:user_id/gedcom_imports/:id/cancel',
          type: 'cm'
        },
        details: {
          method: 'GET',
          url: configuration.api_url + '/gedcom_imports/:id/events'
        },
        position_in_queue: {
          method: 'GET',
          url: configuration.api_url + '/users/:user_id/gedcom_imports/:id/position_in_queue'
        }
      });
  });
