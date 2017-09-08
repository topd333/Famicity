'use strict';

var helper = require('../helper');
var Page = require('../helpers/Page');

function MessagesPage(browser) {
  Page.apply(this, arguments);
  this.browser = browser;

  this.recipients = this.browser.$('.fake-input-gray');
  this.subject = this.browser.element(by.model('formData.message.subject'));
  this.body = this.browser.element(by.model('formData.message.body'));
  this.validateButton = this.browser.$('.buttons .btn-primary');
  this.replyButton = this.browser.$('button[ng-click="openReplyMessagePopup()"].hidden-xs');
  this.replyBody = this.browser.element(by.model('reply.body'));
  this.validateReplyButton = this.browser.$('button[data-fc-form-submit]');
  this.header = this.browser.$('.message-index-header-left');
  this.childrenMessages = this.browser.element.all(by.repeater('message in childrenMessages'));
  this.messageList = this.browser.$('div[fc-messages-list]').all(by.repeater('message in messages'));
}

MessagesPage.prototype = Object.create(Page.prototype);
MessagesPage.prototype.constuctor = MessagesPage;

MessagesPage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  header.get('mail');
};

MessagesPage.prototype.fillForm = function(message) {
  var self = this;
  this.subject.clear();
  message.subject &&
  this.subject.sendKeys(message.subject);
  this.body.clear();
  message.body &&
  this.body.sendKeys(message.body);
  if (message.permissions) {
    this.recipients.click();
    var permissions = require('./OldPermissionsPage')();
    permissions.addPermissions(message.permissions);
    message.permissions.emails && message.permissions.emails.forEach(function(email) {
      expect(self.recipients.getText()).toContain(email);
    });
  }
};

MessagesPage.prototype.write = function(message) {
  this.fillForm(message);
  this.validateButton.click();
  helper.hasSuccess('Message envoyé avec succès.', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/messages\/\d*/);
  expect(this.header.getText()).toContain(message.subject.trim());
  expect(this.childrenMessages.count()).toBeGreaterThan(0);
  expect(this.childrenMessages.get(0).getText()).toContain(message.body.trim().replace(/ +/g, ' '));
  expect(this.messageList.get(0).getText()).toContain(message.subject.trim().replace(/ +/g, ' '));
  expect(this.messageList.get(0).$('span[ng-if="message.messages_count"]').getText()).toBe('1');
};

MessagesPage.prototype.fillReplyForm = function(message) {
  this.replyBody.clear();
  message.body &&
  this.replyBody.sendKeys(message.body);
};

MessagesPage.prototype.reply = function(message, index) {
  index = index || 1;
  this.replyButton.click();
  this.fillReplyForm(message);
  this.validateReplyButton.click();
  helper.hasSuccess('Message envoyé avec succès.', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/messages\/\d*/);
  expect(this.childrenMessages.count()).toBeGreaterThan(1);
  expect(this.childrenMessages.get(index).getText()).toContain(message.body.trim().replace(/ +/g, ' '));
};

module.exports = function(customBrowser) {
  return new MessagesPage(customBrowser || browser);
};
