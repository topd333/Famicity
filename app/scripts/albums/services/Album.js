angular.module('famicity').factory('Album', function($resource, configuration, resourceTransformer) {
  'use strict';

  return $resource(configuration.api_url + '/users/:user_id/albums/:album_id', {'album_id': '@id'}, {
    query: {
      isArray: true,
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'albums', status)
    },
    get: {
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'album', status)
    },
    edit: {
      url: configuration.api_url + '/users/:user_id/albums/:album_id/edit',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'album', status)
    },
    update: {
      method: 'PUT',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'album', status)
    },
    save: {
      method: 'POST',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'album', status)
    },
    confirm_order: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/albums/:album_id/confirm_order'
    },
    load_slideshow: {
      isArray: true,
      url: configuration.api_url + '/users/:user_id/albums/:album_id/load_slideshow',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'photos', status)
    },
    get_list_shared_albums: {
      isArray: true,
      url: configuration.api_url + '/users/:user_id/get_list_shared_albums',
      type: 'cmA',
      transformResponse: function(data, headers, status) {
        data = resourceTransformer.transformResponse(data, 'shared_albums', status);
        if (data && data.albums) {
          data = data.albums;
        }
        return data;
      }
    }
  });
});
