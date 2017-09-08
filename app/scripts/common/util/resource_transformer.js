angular.module('famicity')
  .factory('resourceTransformer', function() {
    'use strict';

    const log = debug('fc-resource-transformer');

    const transform = function(data, name, status) {
      try {
        data = JSON.parse(data); // eslint-disable-line
        if (data[name]) {
          data = data[name];
        } else if (!data.errors && !data.reason) {
          data = null;
        }
      } catch (err) {
        if (!status) {
          Bugsnag.notify('ResourceTransformerError', 'Did not provide call status', {}, 'info');
        } else if (status !== 400 && status !== 401 && status !== 403 &&status !== 404 &&  status !== 500) {
          Bugsnag.notifyException(err, 'ResourceTransformerError', {name, data}, 'error');
        }
        log('could not parse json');
      }
      return data;
    };

    const transformRequest = function(data, name) {
      if (data[name]) {
        data = data[name];
        data.object_type = name;
      }
      return angular.toJson(data);
    };

    const transformResponse = function(data, name, status) {
      data = transform(data, name, status);
      if (data && data.constructor !== Array && angular.isObject(data)) {
        data.type = name;
      }
      return data;
    };

    return {
      transform,
      transformRequest,
      transformResponse
    };

  });
