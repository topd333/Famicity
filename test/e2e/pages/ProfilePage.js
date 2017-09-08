'use strict';

function ProfilePage(browser) {
  this.browser = browser;
  this.avatar = this.browser.$('div.hidden-xs img[alt="avatar"]:not(.hidden-xs)');
  this.fileInput = this.browser.$('.hidden-xs input[type="file"]');
}

ProfilePage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  header.get('profile');
};

module.exports = function(customBrowser) {
  return new ProfilePage(customBrowser || browser);
};
