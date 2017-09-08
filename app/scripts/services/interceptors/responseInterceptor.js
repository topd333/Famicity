angular.module('famicity')
  .factory('responseInterceptor', function(sessionManager, Version, Refresher) {
    'use strict';

    const log = debug('fc-responseInterceptor');

    function checkAppVersion(response) {
      const backVersion = response.headers('Api-Desktop-App-Version');
      if (Version.update(backVersion)) {
        Refresher.refreshForVersion();
      }
    }

    return {
      response(response) {
        // if we receive 404 401 and 500 here, it means this is a 'non-blocking' call,
        // so we return an error in the response
        if (response.status === 0 || response.status === 404 || response.status === 401 || response.status === 500) {
          if (response.config.type) {
            log('caught non blocking error on %o', response);
          }
          if (response.config.type && response.config.type === 'cm') {
            response.status = 200;
            response.data = {
              error: {
                status: response.status,
                statusText: response.statusText
              }
            };
          } else if (response.config.type && response.config.type === 'cmA') {
            response.status = 200;
            response.data = [
              {
                error: {
                  status: response.status,
                  statusText: response.statusText
                }
              }
            ];
          }
        } else if (!(response.config && response.config.type)) {
          checkAppVersion(response);
        }

        return response;
      }
    };
  });
