'use strict';

var faker = require('faker');
var helper = require('../../helper');
var header = require('../../pages/HeaderComponent')();
var message = require('../../pages/MessagesPage')();
var directory = require('../../pages/DirectoryPage')();
var message2;
var user;
var user2;
var browser2;
var subject;
var body;
var permissions;

var groupName = faker.lorem.sentence().slice(0, 10).trim();

describe('Message rights', function() {
  describe('create users and group', function() {
    it('the two users sign up', function() {
      user = helper.createUser();
      browser2 = browser.forkNewDriverInstance();
      helper.setTestCookie(browser2);
      user2 = helper.createUser(null, browser2);
    });

    it('the first user invites the second one', function() {
      directory.get();
      directory.menu.click(2);
      directory.invite(user2.firstName, user2.lastName, user2.email);
    });

    it('the second user accepts the invitation', function() {
      var directory = require('../../pages/DirectoryPage')(browser2);
      directory.get();
      browser2.$('.fa-eye').click();
      browser2.$('.directory-item-table-cell-invit-buttons .accept').click();
      helper.hasSuccess(helper.user.username(user) + ' fait maintenant partie de votre groupe "Tous mes proches".', browser2);
    });

    it('the first user creates a group', function() {
      directory.get();
      directory.createGroup(groupName);
    });

    it('and adds the second user to it', function() {
      directory.addUserToGroup(user2);
    });
  });

  describe('the first user writes a message with permissions', function() {
    beforeEach(function() {
      message2 = require('../../pages/MessagesPage')(browser2);
      message.get();
      $('.messages-write-message .left-column-block-header.btn-primary').click();
    });

    it('user permissions', function() {
      subject = faker.lorem.sentence().slice(0, 20);
      body = faker.lorem.paragraph();
      permissions = {
        users: [user2]
      };
      message.write({subject: subject, body: body, permissions: permissions});
      message2.get();
      expect(message2.header.getText()).toContain(subject.trim());
      expect(message2.childrenMessages.count()).toBeGreaterThan(0);
      expect(message2.childrenMessages.get(0).getText()).toContain(body.trim().replace(/ +/g, ' '));
      expect(message2.messageList.get(0).getText()).toContain(subject.trim().replace(/ +/g, ' '));
    });

    it('group permissions', function() {
      subject = faker.lorem.sentence().slice(0, 20);
      body = faker.lorem.paragraph();
      permissions = {
        groups: [groupName]
      };
      message.write({subject: subject, body: body, permissions: permissions});
      message2.get();
      expect(message2.header.getText()).toContain(subject.trim());
      expect(message2.childrenMessages.count()).toBeGreaterThan(0);
      expect(message2.childrenMessages.get(0).getText()).toContain(body.trim().replace(/ +/g, ' '));
      expect(message2.messageList.get(0).getText()).toContain(subject.trim().replace(/ +/g, ' '));
    });
  });

  describe('message deletion', function() {
    it('the first user deletes the first message', function() {
      message.get();
      message.menu.click(2);
      browser.$('.popin-dialog .btn-primary').click();
      helper.hasSuccess('Message supprimé avec succès.');
      expect(message.messageList.count()).toBe(1);
    });

    it('it is still visible by the other user', function() {
      message2.get();
      expect(message2.messageList.count()).toBe(2);
    });

    it('the second user deletes it', function() {
      message2.get();
      message2.menu.click(2);
      browser2.$('.popin-dialog .btn-primary').click();
      helper.hasSuccess('Message supprimé avec succès.', browser2);
    });

    it('none of the users now see it', function() {
      expect(message.messageList.count()).toBe(1);
      expect(message2.messageList.count()).toBe(1);
    });
  });

  describe('message reopen', function() {
    it('the first user deletes the first message', function() {
      message.get();
      message.menu.click(2);
      browser.$('.popin-dialog .btn-primary').click();
      helper.hasSuccess('Message supprimé avec succès.');
      expect(message.messageList.count()).toBe(0);
    });

    it('it is still visible by the other user', function() {
      message2.get();
      expect(message2.messageList.count()).toBe(1);
    });

    it('the second replies to it', function() {
      body = faker.lorem.paragraph();
      message2.reply({body: body});
    });

    it('the first user sees it again', function() {
      message.get();
      expect(message.messageList.count()).toBe(1);
      expect(message.childrenMessages.get(1).getText()).toContain(body.trim().replace(/ +/g, ' '));
    });
  });

  it('sign out', function() {
    header.signOut();
    browser2.quit();
  });
});
