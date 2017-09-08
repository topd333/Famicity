angular.module('famicity').factory('htmlInterceptor', function(configuration, $templateCache) {
  'use strict';

  const log = debug('html-interceptor');

  return {
    request(config) {
      if (!/\.html/.test(config.url)) {
        return config;
      }
      log(config.url);
      const isCached = Boolean($templateCache.get(config.url));
      log('is cached: %o', isCached);
      if (/\/[^.]*\.html/.test(config.url) && !isCached) {
        config.url = configuration.static1Url + config.url;
        delete config.headers['Desktop-App-Version'];
        delete config.headers.Authorization;
        if (!/\.html\?v=(?:.*)/.test(config.url)) {
          config.url = config.url + '?v=' + configuration.version;
        }
      }
      log(config.url + '\n');
      return config;
    }
  };
});
