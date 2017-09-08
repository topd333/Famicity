'use strict';

var directoryPage = require('./../../pages/DirectoryPage');

var browser2;
var browser3;
var helper = require('./../../helper');
var home2;
var home3;
var user1;
var user2;
var user3;

describe('The second user', function() {
  it('can register', function() {
    user1 = helper.user[1];
    user2 = helper.user[2];
    user3 = helper.user[3];
    browser2 = browser.forkNewDriverInstance();
    expect(browser2).not.toEqual(browser);
    helper.setTestCookie(browser2);
    home2 = require('./../../pages/HomePage')(browser2);
    home2.signUp(user2.email, user2.password);
  });

  it('can fill the wizard, and accept the invitation', function() {
    var wizard2 = require('./../../pages/WizardPage')(browser2);
    wizard2.goThrough(user2, {acceptAll: true, inviter: user1});
  });

  xit('the first user receives a chat connection notification', function() {
    var chat = require('./ChatPage')();
    chat.hasConnectionNotification(user2);
  });
});

describe('The third user', function() {
  it('can register', function() {
    browser3 = browser.forkNewDriverInstance();
    expect(browser3).not.toEqual(browser);
    helper.setTestCookie(browser3);
    home3 = require('./../../pages/HomePage')(browser3);
    home3.signUp(user3.email, user3.password);
  });

  it('can fill the wizard', function() {
    var wizard3 = require('./../../pages/WizardPage')(browser3);
    wizard3.goThrough(user3, {declineAll: true, inviter: user1});
  });

  // TODO: the notification is not here yet
  // it('has received an invitation notification', function() {
  //
  //   // TODO: add more tests
  // });

  it('has an invitation tooltip in his directory', function() {
    var directory = directoryPage(browser3);
    directory.get();
    expect(browser3.$('.tooltip-popup').isDisplayed()).toBe(true);
  });

  it('has an invitation visible in directory left block', function() {
    var sentLeftBlock = browser3.element.all(by.repeater('invitation in ::receivedInvitations | limitTo : 2'));
    expect(sentLeftBlock.get(0).getText()).toContain(user1.firstName + ' ' + user1.lastName.toUpperCase());
    expect(sentLeftBlock.get(0).getText()).toContain(user1.email);
    browser3.$('.fa-eye').click();
  });

  it('has an invitation visible in received invitations page', function() {
    var invitations = browser3.element.all(by.repeater('user in formattedUsers'));
    var currentYear = new Date().getFullYear();
    expect(invitations.get(0).getText()).toContain(user1.firstName + ' ' + user1.lastName.toUpperCase());
    expect(invitations.get(0).getText()).toContain(user1.firstName);
    expect(invitations.get(0).getText()).toContain(currentYear);
  });

  it('accepts the invitation', function() {
    // Accept the invitation
    browser3.$('.directory-item-table-cell-invit-buttons .accept').click();
    helper.hasSuccess(user1.firstName + ' ' + user1.lastName.toUpperCase() + ' fait maintenant partie de votre groupe "Tous mes proches".', browser3);
    expect(browser3.$('.directory-item-table-cell-invit-buttons .accept.disabled').isPresent()).toBe(true);
    expect(browser3.$('.left-column .fa-check').isPresent()).toBe(true);
  });

  xit('both user have a chat connection notification', function() {
    var chat = require('./../../pages/ChatComponent')();
    var chat3 = require('./../../pages/ChatComponent')(browser3);
    chat.hasConnectionNotification(user3);
    chat3.hasConnectionNotification(user1);
  });
});

describe('The three users', function() {
  it('have a friend ----- #11892', function() {
    // First user

    // var header = require('./../../pages/HeaderComponent')();
    // header.get('directory');
    // var user1Contacts = browser.all(by.repeater('user in formattedUsers'));
    // var users = [helper.user.username(user2), helper.user.username(user3)].sort();

    // var directoryList = $('.directory-listing');
    // TODO Nico : reactivate
    // expect(directoryList.getText()).toContain(users[0]);
    // expect(directoryList.getText()).toContain(users[1]);

    // if (helper.user.username(user2) !== users[0]) {
    //  expect(user1Contacts.get(0).getText()).toContain(users[0]);
    //  expect(user1Contacts.get(1).getText()).not.toContain(users[1]); //#11892
    // } else {
    //  expect(user1Contacts.get(0).getText()).toContain(users[0]);
    //  expect(user1Contacts.get(1).getText()).not.toContain(users[2]); //#11892
    // }

    // Second user
    var directory2 = directoryPage(browser2);
    directory2.get();
    var users2 = directory2.users.filter(function(el) {
      return el.getAttribute('class').then(function(className) {
        return className.indexOf('separator') < 0;
      });
    });
    expect(users2.get(0).getText()).toContain(user1.firstName + ' ' + user1.lastName.toUpperCase());
    directory2.header.signOut();
    browser2.quit();

    // Third user
    var directory3 = directoryPage(browser3);
    directory3.get();
    var users3 = directory3.users.filter(function(el) {
      return el.getAttribute('class').then(function(className) {
        return className.indexOf('separator') < 0;
      });
    });
    expect(users3.get(0).getText()).toContain(user1.firstName + ' ' + user1.lastName.toUpperCase());
    directory3.header.signOut();
    browser3.quit();
  });

  // TODO: clean when famicity/issues#107 is fixed
  it('sign out', function() {
    require('../../pages/DirectoryPage')(browser).header.signOut();
  });
});
