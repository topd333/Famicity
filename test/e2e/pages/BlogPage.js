'use strict';

function FeedPage(browser) {
  this.browser = browser;
  this.elements = this.browser.element.all(by.repeater('post in posts'));
  // this.lastElement = this.elements.get(this.elements.length - 1);
  this.firstElement = this.elements.get(0);
}

FeedPage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  return header.get('blog');
};

FeedPage.prototype.hasPost = function(present) {
  present = present != null ? present : true;
  this.browser.$('div[data-object="post"]').isPresent().then(function(isPresent) {
    expect(isPresent).toBe(present);
  });
};

module.exports = function(customBrowser) {
  return new FeedPage(customBrowser || browser);
};
