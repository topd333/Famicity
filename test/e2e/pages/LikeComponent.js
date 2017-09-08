'use strict';

var helper = require('../helper');

function LikeComponent(element, browser) {
  this.browser = browser;
  this.element = element;
  this.heart = this.element.$('i.fa');
  this.link = this.element.$('a.counter');
  this.likesPageList = this.browser.element(by.repeater('like in likesList | orderBy: \'-create_date\''));
}

LikeComponent.prototype.like = function() {
  this.heart.click();
  helper.hasSuccess('Génial, vous aimez cette publication !', this.browser);
};

LikeComponent.prototype.unlike = function() {
  this.heart.click();
  helper.hasSuccess('Vous n\'aimez plus cette publication.', this.browser);
};

LikeComponent.prototype.hasLikes = function(number) {
  if (number === 0) {
    this.hasNoLike();
  } else {
    expect(this.element.getText()).toContain(number + ' J\'aime');
    expect(this.link.getAttribute()).not.toBe('');
  }
};

LikeComponent.prototype.hasNoLike = function() {
  expect(this.element.getText()).not.toContain('J\'aime');
  expect(this.link.isDisplayed()).toBe(false);
};

LikeComponent.prototype.hasLiked = function(username) {
  expect(this.likesPageList.getText()).toContain(username);
};

module.exports = function(element, customBrowser) {
  return new LikeComponent(element, customBrowser || browser);
};
