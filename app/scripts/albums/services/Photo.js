angular.module('famicity').factory('Photo', function($resource, $moment, configuration, resourceTransformer) {
  'use strict';
  var transformPhoto = function(data, status) {
    data = resourceTransformer.transformResponse(data, 'photo', status);
    if (data && data.photo_date) {
      data.photo_date = $moment(data.photo_date, 'X').toDate();
    }
    return data;
  };
  return $resource(configuration.api_url + '/users/:user_id/albums/:album_id/photos/:photo_id', {
    album_id: '@id',
    photo_id: '@photo_id'
  }, {
    query: {
      isArray: true,
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'photos', status)
    },
    get: {
      transformResponse: (data, headers, status) => transformPhoto(data, status)
    },
    edit: {
      url: configuration.api_url + '/users/:user_id/albums/:album_id/photos/:photo_id/edit',
      transformResponse: (data, headers, status) => transformPhoto(data, status)
    },
    update: {
      method: 'PUT',
      transformResponse: (data, headers, status) => transformPhoto(data, status)
    },
    get_previous_photo: {
      params: {user_id: '@user_id', album_id: '@album_id', photo_id: '@photo_id'},
      url: configuration.api_url + '/users/:user_id/albums/:album_id/photos/:photo_id/previous_photo',
      transformResponse: (data, headers, status) => transformPhoto(data, status)
    },
    get_next_photo: {
      params: {user_id: '@user_id', album_id: '@album_id', photo_id: '@photo_id'},
      url: configuration.api_url + '/users/:user_id/albums/:album_id/photos/:photo_id/next_photo',
      transformResponse: (data, headers, status) => transformPhoto(data, status)
    },
    set_as_avatar: {
      method: 'POST',
      params: {user_id: '@user_id', album_id: '@album_id', photo_id: '@photo_id'},
      url: configuration.api_url + '/users/:user_id/albums/:album_id/photos/:photo_id/set_as_avatar'
    }
  });

});
