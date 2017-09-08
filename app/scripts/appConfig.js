const locationDecorator = function($delegate, $rootScope) {
  'use strict';
  let skipping = false;
  $rootScope.$on('$locationChangeSuccess', function(event) {
    if (skipping) {
      event.preventDefault();
      skipping = false;
    }
  });
  $delegate.skipReload = function() {
    skipping = true;
    return this;
  };
  return $delegate;
};

angular.module('famicity')
  .config(($compileProvider, configuration) => {
    'use strict';
    $compileProvider.debugInfoEnabled(configuration.development);
  })
  .config(($httpProvider) => {
    'use strict';
    $httpProvider.useApplyAsync(true);
  })
  /**
   * Decorator that allows to update the url without reloading router or view changes
   * usage:
   *   $location.skipReload().url('/test').replace();
   */
  .config(function($provide) {
    'use strict';
    $provide.decorator('$location', locationDecorator);
  })
  .config(function(datepickerConfig, datepickerPopupConfig) {
    'use strict';
    datepickerPopupConfig.showButtonBar = false;
    datepickerConfig.showWeeks = false;
  })
  .config(function($modalProvider) {
    'use strict';

    angular.extend($modalProvider.options, {
      keyboard: true
    });
  })
  .config(function($provide, configuration, $httpProvider) {
    'use strict';

    $httpProvider.defaults.headers.common['Desktop-App-Version'] = configuration.version;

    try {
      Bugsnag.releaseStage = configuration.environment;
      Bugsnag.notifyReleaseStages = ['staging', 'production'];
      Bugsnag.apiKey = configuration.api_key_monitoring;
      Bugsnag.appVersion = configuration.version;
    } catch (e) {
      log('Bugsnag blocked');
    }

    $provide.decorator('$exceptionHandler', function($delegate) {
      return function(exception, cause) {
        try {
          Bugsnag.notifyException(exception, {
            diagnostics: {
              cause: cause
            }
          });
        } catch (e) {
          log('Bugsnag blocked');
        }
        return $delegate(cause, exception);
      };
    });
    if (configuration.development === false) {
      window.debug = function() {
        return function() {
        };
      };
    }
  })
  .config(function($httpProvider) {
    'use strict';
    // Add interceptors
    $httpProvider.interceptors.push('responseInterceptor', 'requestErrorHttpInterceptor', 'errorsInterceptor', 'htmlInterceptor');

    // Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    // Remove the header used to identify ajax call which would prevent CORS from working
    return delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .config(function($translateProvider, $injector, tmhDynamicLocaleProvider, $tooltipProvider, configuration) {
    'use strict';

    $translateProvider.useStaticFilesLoader({
      prefix: configuration.static3Url + '/languages/',
      suffix: '.json' + '?v=' + configuration.version
    });

    $translateProvider.addInterpolation('$translateMessageFormatInterpolation');
    MessageFormat.locale.fr = function(n) {
      if (n === 0 || n === 1) {
        return 'one';
      } else {
        return 'other';
      }
    };

    $translateProvider.useSanitizeValueStrategy(null);

    MessageFormat.locale.en = function(n) {
      if (n === 0 || n === 1) {
        return 'one';
      } else {
        return 'other';
      }
    };

    tmhDynamicLocaleProvider.localeLocationPattern(configuration.static2Url + '/languages/angular-i18n/angular-locale_{{locale}}.js');

    return $tooltipProvider.options({
      popupDelay: 300
    });
  });
