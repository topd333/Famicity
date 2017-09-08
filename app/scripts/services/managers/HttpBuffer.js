angular.module('famicity').factory('HttpBuffer', function($http, $location) {
  'use strict';
  let buffer = [];
  let bufferLocation = '';
  let locationCount = 0;
  const httpBuffer = {};
  httpBuffer.append = function(config, deferred) {
    return buffer.push({config, deferred});
  };
  httpBuffer.retryHttpRequest = function(config, deferred) {
    let errorCallback;
    let successCallback;
    successCallback = function(response) {
      return deferred.resolve(response);
    };
    errorCallback = function(response) {
      return deferred.reject(response);
    };
    return $http(config).then(successCallback, errorCallback);
  };
  httpBuffer.retryAllRequest = function(newToken) {
    let i = 0;
    while (i < buffer.length) {
      if (angular.isDefined(newToken) || newToken !== '') {
        buffer[i].config.headers.Authorization = 'Bearer ' + newToken;
        this.retryHttpRequest(buffer[i].config, buffer[i].deferred);
      }
      ++i;
    }
    buffer = [];
  };
  httpBuffer.rejectAllRequest = function() {
    let i = 0;
    while (i < buffer.length) {
      buffer[i].deferred.reject();
      ++i;
    }
    buffer = [];
  };
  httpBuffer.getLocationCount = function() {
    return locationCount;
  };
  httpBuffer.setRetryLocation = function(location) {
    locationCount += 1;
    bufferLocation = location;
  };
  httpBuffer.retryLocation = function() {
    $location.path(bufferLocation);
    locationCount = 0;
  };
  httpBuffer.resetLocation = function() {
    bufferLocation = '';
    locationCount = 0;
  };
  httpBuffer.resetCount = function() {
    locationCount = 0;
  };
  httpBuffer.resetBuffer = function() {
    buffer = [];
  };
  httpBuffer.getBufferLocation = function() {
    return bufferLocation;
  };
  return httpBuffer;
});
