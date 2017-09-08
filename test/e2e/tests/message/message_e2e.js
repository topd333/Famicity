'use strict';

var helper = require('../../helper');
var faker = require('faker');
var header = require('../../pages/HeaderComponent')();
var message = require('../../pages/MessagesPage')();
var subject;
var body;
var permissions;

describe('Message', function() {
  it('the user signs up', function() {
    helper.createUser();
  });

  it('the user starts creating a new message', function() {
    message.get();
    $('.messages-write-message .left-column-block-header.btn-primary').click();
  });

  it('the user writes a message', function() {
    subject = faker.lorem.sentence().slice(0, 20);
    body = faker.lorem.paragraph();
    permissions = {
      emails: []
    };
    for (var i = 0; i < faker.random.number({min: 3, max: 8}); i++) {
      permissions.emails.push(faker.internet.email());
    }
    message.write({subject: subject, body: body, permissions: permissions});
  });

  it('the recipients are displayed properly', function() {
    // expect(message.header.getText()).toContain(permissions.emails.sort()[0]);
    expect(message.header.getText()).toContain('et ' + parseInt(permissions.emails.length - 1, 10) + ' autres personnes');
    // expect(message.messageList.get(0).getText()).toContain(permissions.emails.sort()[0]);
    expect(message.messageList.get(0).getText()).toContain('et ' + parseInt(permissions.emails.length - 1, 10) + ' autres personnes');
  });

  it('replies to the message', function() {
    var body = faker.lorem.paragraph();
    message.reply({body: body});
    // #186
    expect(message.messageList.get(0).$('span[ng-if="message.messages_count"]').getText()).toBe('2');
  });

  it('only 10 message items are displayed', function() {
    var body;
    for (var i = 1; i < 8; i++) {
      body = faker.lorem.paragraph();
      message.reply({body: body}, i + 1);
      message.get();
      expect(message.childrenMessages.count()).toBe(2 + i);
    }
    body = faker.lorem.paragraph();
    message.reply({body: body}, 9);
    message.get();
    expect(message.childrenMessages.count()).toBe(10);
  });

  it('sign out', function() {
    header.signOut();
  });
});
