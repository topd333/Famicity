'use strict';

var settingsPage = require('./../../pages/SettingsPage')();
var helper = require('./../../helper');

describe('User', function() {
  it('signs up', function() {
    var user = helper.user.generate('delete');
    helper.createUser(user);
  });

  it('can delete his account', function() {
    settingsPage.get();
    settingsPage.select('deleteAccount');
    settingsPage.deleteAccount();
    delete helper.user.delete;
  });
});
