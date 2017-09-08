// Karma configuration
// Generated on Wed Dec 24 2014 15:28:46 GMT+0100 (CET)

module.exports = function(config) {
  'use strict';
  /**
   * We rely on port forwarding here,
   * so localhost:4444 will redirect to the VM:4444 where the webdriver-manager listens.
   */
  var webdriverConfig = {
    hostname: 'localhost',
    port: 4444
  };

  config.set({
    /**
     * This is the Karma server address (i.e. ourselves) that the webdriver-manager will call back.
     */
    hostname: '192.168.1.15',

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // ES5 shim for phantomjs
      'bower_components/es5-shim/es5-shim.js',
      // Libs required by our sources
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'app/languages/angular-i18n/angular-locale_fr.js',

      // @@inject

      // Our tests
      'bower_components/angular-mocks/angular-mocks.js',
      'test/unit/**/*.js',
      'app/**/*.html'
    ],
    proxies: {
      '/languages/angular-i18n': '.tmp/languages/angular-i18n'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '.tmp/scripts/!(lib)/**/*.js': ['coverage'],
      'app/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app',
      moduleName: 'famicity.views'
    },

    coverageReporter: {
      dir: 'test/unit/coverage',
      type: 'lcov'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    customLaunchers: {
      'Win-IE10': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'internet explorer', // Must be chrome	firefox	htmlunit	internet explorer	iPhone	iPad	opera	safari
        platform: 'WINDOWS',
        version: '10',
        name: 'Karma'
      },
      'Win-Firefox': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'firefox',
        platform: 'WINDOWS',
        name: 'Karma'
      },
      'Win-Chrome': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'chrome',
        platform: 'WINDOWS',
        name: 'Karma'
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'Win-Chrome', 'Win-Firefox', 'Win-IE10'],

    // No Continuous Integration : Karma captures browsers, runs the tests and exits
    singleRun: true,

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-webdriver-launcher',
      'karma-coverage',
      'karma-ng-html2js-preprocessor'
    ]
  });
};
