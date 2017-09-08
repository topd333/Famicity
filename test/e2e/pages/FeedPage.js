'use strict';

function FeedPage(browser) {
  this.browser = browser;
  this.elements = this.browser.element.all(by.repeater('element in elements'));
  this.firstElement = this.elements.get(0);
  this.posts = this.browser.$$('div[object="post"]');
  this.events = this.browser.$$('div[data-object="::element.event"]');
  this.albums = this.browser.$$('div[data-object="::element.album"]');
  this.users = this.browser.$$('div[data-user="::user"]');
  this.avatars = this.browser.$$('div[data-user="::user"][ng-if="::element.avatar"]');
}

FeedPage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  return header.get('feed');
};

FeedPage.prototype.hasEventBlock = function(present) {
  present = present != null ? present : true;
  present &&
  expect(this.browser.$('fc-events-list').isPresent()).toBe(true) &&
  expect(this.browser.$('fc-events-list').isDisplayed()).toBe(true);
  !present &&
  expect(this.browser.$('fc-events-list').isPresent() && this.browser.$('fc-events-list').isDisplayed()).toBe(false);
};

FeedPage.prototype.hasBirthdayBlock = function(present) {
  present = present != null ? present : true;
  present &&
  expect(this.browser.$('fc-birthday-list').isPresent()).toBe(true) &&
  expect(this.browser.$('fc-birthday-list').isDisplayed()).toBe(true);
  !present &&
  expect(this.browser.$('fc-birthday-list').isPresent() && this.browser.$('fc-birthday-list').isDisplayed()).toBe(false);
};

FeedPage.prototype.hasStoryBlock = function(present) {
  present = present != null ? present : true;
  present &&
  expect(this.browser.$('fc-story-detail').isPresent()).toBe(true) &&
  expect(this.browser.$('fc-story-detail').isDisplayed()).toBe(true);
  !present &&
  expect(this.browser.$('fc-story-detail').isPresent()).toBe(false);
};

FeedPage.prototype.hasConnectedBlock = function(present) {
  present = present != null ? present : true;
  present &&
  expect(this.browser.$('fc-last-connected-list').isPresent()).toBe(true) &&
  expect(this.browser.$('fc-last-connected-list').isDisplayed()).toBe(true);
  !present &&
  expect(this.browser.$('fc-last-connected-list').isPresent()).toBe(false);
};

FeedPage.prototype.hasElement = function(present) {
  present = present != null ? present : true;
  this.browser.element.all(by.repeater('element in elements')).count().then(function(count) {
    present && typeof present === 'number' && expect(count).toBe(present);
    present && typeof present === 'boolean' && expect(count).isGreaterThan(0);
    !present && expect(count).toBe(0);
  });
};

FeedPage.prototype.hasPost = function(present) {
  present = present != null ? present : true;
  present && expect(this.posts.count()).toBeGreaterThan(0);
  !present && expect(this.posts.count()).toBe(0);
};

FeedPage.prototype.hasAlbum = function(present) {
  present = present != null ? present : true;
  present && expect(this.albums.count()).toBeGreaterThan(0);
  !present && expect(this.albums.count()).toBe(0);
};

FeedPage.prototype.hasNoFriendTooltip = function(present) {
  present = present != null ? present : true;
  var tooltip = this.browser.$('.tooltip-popup');
  expect(tooltip.isPresent()).toBe(present);
  if (present) {
    expect(tooltip.getText()).toContain('Cette page est vide pour le moment');
  }
};

FeedPage.prototype.isInitial = function() {
  var chat = require('./ChatComponent')(this.browser);
  var infoBanner = require('./InfoBannerComponent')(this.browser);

  this.hasNoFriendTooltip(true);
  this.hasBirthdayBlock(true);
  this.hasStoryBlock(false);
  this.hasConnectedBlock(false);
  this.hasEventBlock(false);
  chat.isPresent();
  infoBanner.isPresent();

  // The invitation popin must not be present
  expect(this.browser.$('#invitation-alert-modal').isPresent()).toBe(false);

  // // The feed indicates that I joined famicity
  // TODO: not ready yet?
  // expect(this.elements.getText()).toContain(user.firstName + ' ' + user.lastName.toUpperCase());
  // The CM bar is visible
};

module.exports = function(customBrowser) {
  return new FeedPage(customBrowser || browser);
};
