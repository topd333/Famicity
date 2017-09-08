'use strict';

describe('unsubscribe all users', function() {
  var helper = require('../helper.js');
  var signIn;
  var settingsPage;
  var browser2;

  it('', function() {
    Object.keys(helper.user).forEach(function(key) {
      if (typeof helper.user[key] === 'function') {
        return;
      }
      try {
        var user = helper.user[key];
        browser2 = browser.forkNewDriverInstance();
        helper.setTestCookie(browser2);
        signIn = require('../pages/SignInPage')(browser2);
        settingsPage = require('../pages/SettingsPage')(browser2);
        signIn.get();
        signIn.signIn(user.email, user.password);
        settingsPage.get();
        settingsPage.select('deleteAccount');
        settingsPage.deleteAccount();
        browser2.quit();
      } catch (e) {
        console.log(e);
      }
    });
  });
});
