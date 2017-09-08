'use strict';

var helper = require('../../helper');
var faker = require('faker');
var header = require('../../pages/HeaderComponent')();
var message = require('../../pages/MessagesPage')();
var subject;
var body;
var permissions;
var user;
var browser2;
var home2;
var message2;

var user2 = helper.user.generate();

describe('Message email rights', function() {
  it('the user signs up', function() {
    user = helper.createUser();
  });

  it('the user starts creating a new message', function() {
    message.get();
    $('.messages-write-message .left-column-block-header.btn-primary').click();
  });

  it('the first user writes a message', function() {
    subject = faker.lorem.sentence().slice(0, 20);
    body = faker.lorem.paragraph();
    permissions = {
      emails: [user2.email]
    };
    message.write({subject: subject, body: body, permissions: permissions});
  });

  it('the invitation has been sent', function() {
    var directory = require('./../../pages/DirectoryPage')();
    directory.hasBeenInvited(user2, {checkName: false});
  });

  describe('the second user', function() {
    it('the other user registers', function() {
      browser2 = browser.forkNewDriverInstance();
      expect(browser2).not.toEqual(browser);
      helper.setTestCookie(browser2);
      home2 = require('./../../pages/HomePage')(browser2);
      home2.signUp(user2.email, user2.password);
    });

    it('can fill the wizard, and accept the invitation', function() {
      var wizard2 = require('./../../pages/WizardPage')(browser2);
      wizard2.goThrough(user2, {acceptAll: true, inviter: user});
    });

    it('has access the the message created by the first user', function() {
      message2 = require('./../../pages/MessagesPage')(browser2);
      message2.get();

      expect(message2.header.getText()).toContain(subject.trim());
      expect(message2.childrenMessages.count()).toBeGreaterThan(0);
      expect(message2.childrenMessages.get(0).getText()).toContain(body.trim().replace(/ +/g, ' '));
      expect(message2.messageList.get(0).getText()).toContain(subject.trim().replace(/ +/g, ' '));
    });
  });

  it('sign out', function() {
    header.signOut();
    browser2.quit();
  });
});
