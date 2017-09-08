angular.module('famicity').factory('requestErrorHttpInterceptor', function($location, $q, $injector) {
  'use strict';

  const log = debug('fc-error-interceptor');

  return {
    requestError(rejection) {
      let HttpBuffer;
      let newRequest;
      log('error: %o', rejection);
      HttpBuffer = $injector.get('HttpBuffer');
      if (rejection.hasOwnProperty('recover_url')) {
        if (HttpBuffer.getLocationCount() === 0) {
          console.log('Has RecoverUrl');
          HttpBuffer.setRetryLocation(rejection.recover_url);
          console.log(HttpBuffer.getLocationCount());
          delete rejection.recover_url;
        }
        newRequest = {
          transformRequest: [],
          transformResponse: [],
          method: 'GET',
          url: '/views/sign-in.html',
          headers: {
            Accept: 'application/json, text/plain, /'
          }
        };
        return newRequest;
      } else {
        console.log('Else RequestError');
        return $q.reject(rejection);
      }
    }
  };
});
