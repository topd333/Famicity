'use strict';

function ChatComponent(browser) {
  this.browser = browser;
  this.panel = this.browser.$('.chat-panel');
  this.notification = this.browser.$('.chat-notification');
}

ChatComponent.prototype.isPresent = function() {
  expect(this.panel.isPresent()).toBe(true);
};

ChatComponent.prototype.open = function() {

};

ChatComponent.prototype.close = function() {

};

ChatComponent.prototype.openConversation = function() {

};

ChatComponent.prototype.closeConversation = function() {

};

ChatComponent.prototype.sendMessage = function() {

};

ChatComponent.prototype.hasReceivedMessage = function() {

};

ChatComponent.prototype.hasConnectionNotification = function(user) {
  var self = this;
  this.browser.driver.wait(this.notification.isDisplayed, 3000)
    .then(function(isDisplayed) {
      expect(isDisplayed).toBe(true);
      expect(self.notification.getText()).toBe(user.firstName + ' ' + user.lastName.toUpperCase() + ' vient de se connecter sur la discussion');
    });
};

module.exports = function(customBrowser) {
  return new ChatComponent(customBrowser || browser);
};
