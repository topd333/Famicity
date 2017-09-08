'use strict';

exports.config = {
  seleniumServerJar: '../../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  specs: [
    'routes_e2e.js'
  ],
  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: false,
      displayFailuresSummary: false
    }));
  },
  jasmineNodeOpts: {
    silent: true,
    defaultTimeoutInterval: 9999999
  },
  allScriptsTimeout: 9999999,
  capabilities: {
    'browserName': 'chrome'
  }
};
