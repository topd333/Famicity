// Karma configuration
// Generated on Wed Dec 24 2014 15:28:46 GMT+0100 (CET)

module.exports = function(config) {
  'use strict';
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // ES5 shim for phantomjs
      'build/bower_components/es5-shim/es5-shim.js',
      // Libs required by our sources

      // @@inject

      // Our tests
      'app/languages/angular-i18n/angular-locale_fr.js',
      'build/bower_components/angular-mocks/angular-mocks.js',
      'test/unit/**/*.js',
      '**/*.html'
    ],
    proxies: {
      '/languages/angular-i18n': 'app/languages/angular-i18n'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'build/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'build',
      moduleName: 'famicity.views'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Run as headless
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    singleRun: true,

    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor'
    ]
  });
};
