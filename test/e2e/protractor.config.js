'use strict';

var seleniumUrl = process.env.SELENIUM_URL;
var browsers = process.env.BROWSER || 'chrome';
var E2E_SET = process.env.E2E_SET || 'all';
var multipleCapabilities = browsers.split(',').map(function(browser) {
  return {
    browserName: browser,
    'ie.ensureCleanSession': true
  };
});

var set1 = [
  'tests/public/sign-in_e2e.js',
  'tests/public/sign-up_e2e.js',
  'tests/public/contact_e2e.js',
  'tests/public/reset_password_e2e.js',
  'tests/tree/tree_e2e.js',
  'tests/profile/profile_e2e.js',
  'tests/profile/profile_avatar_e2e.js',
  'tests/directory/directory_e2e.js',
  'tests/directory/invitation_send_e2e.js', 'tests/directory/invitation_accept_e2e.js',
  'tests/directory/directory_search_e2e.js',
  'tests/settings/delete-account_e2e.js',
  'tests/post/post_e2e.js',
  'tests/post/post_email_rights_e2e.js',
  'tests/post/post_rights_e2e.js',
  'tests/post/post_like_e2e.js',
  'tests/post/post_comments_e2e.js',
  'tests/post/post_comments_likes_e2e.js'
];

var set2 = [
  'tests/album/album_e2e.js',
  'tests/album/album_comments_e2e.js',
  'tests/album/album_likes_e2e.js',
  'tests/album/album_comments_likes_e2e.js',
  'tests/calendar/calendar_e2e.js',
  'tests/calendar/event_e2e.js',
  'tests/calendar/event_rights_e2e.js',
  'tests/calendar/event_invitations_e2e.js',
  'tests/calendar/event_album_e2e.js',
  'tests/calendar/event_comments_e2e.js',
  'tests/calendar/event_likes_e2e.js',
  'tests/calendar/event_comments_likes_e2e.js',
  'tests/message/message_e2e.js',
  'tests/message/message_rights_e2e.js',
  'tests/message/message_email_rights_e2e.js'
];

var common = [
  'helpers/initiate_browser.js'
];

var specs = [];
if (E2E_SET === 'all') {
  specs = common.concat(set1).concat(set2);
} else if (E2E_SET === '1') {
  specs = common.concat(set1);
} else if (E2E_SET === '2') {
  specs = common.concat(set2);
}

exports.config = {
  ie: {
    ensureCleanSession: true
  },
  seleniumAddress: seleniumUrl,
  seleniumServerJar: '../../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  specs: specs,
  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
      // 'specs' show everything
      displayStacktrace: 'specs',
      displayFailuresSummary: false,
      displaySpecDuration: true,
      displayPendingSpec: true
    }));
    browser.getCapabilities().then(function(cap) {
      browser.browserName = cap.caps_.browserName;
    });
    require('./helpers/selectors')(protractor); // eslint-disable-line
  },
  jasmineNodeOpts: {
    silent: true,
    defaultTimeoutInterval: 9999999,
    print: function() {}
  },
  allScriptsTimeout: 9999999,
  params: {
    user: {
      id: 6252,
      email: 'journaliste@famicity.com',
      password: 'journaliste'
    }
  },
  framework: 'jasmine2',
  rootElement: 'html',
  multiCapabilities: multipleCapabilities
};
