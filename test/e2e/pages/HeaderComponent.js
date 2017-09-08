'use strict';

var helper = require('../helper');

var mainHeaderLinks = {
  feed: {id: 1, url: /\/(home|feed)/},
  profile: {id: 2, url: /\/profile\/\d*/},
  tree: {id: 3, url: /\/tree\/\d*/},
  mail: {id: 4, url: /\/messages(\/\d*)?/},
  directory: {id: 5, url: /\/u\/directory/},
  albums: {id: 6, url: /\/users\/\d*\/albums/},
  calendar: {id: 7, url: /\/u\/calendar\/year\/\d*\/week\/d*/},
  blog: {id: 8, url: /\/users\/\d*\/blog/}
};

var topHeaderLinks = {
  home: {selector: 'header .logo', url: /\/(home|feed)/},
  help: {selector: '.header-top-strip-icons a:nth-child(3)', url: /\/users\/\d*\/helps/},
  settings: {selector: '.header-top-strip-icons a:nth-child(4)', url: /\/settings/}
};

function HeaderComponent(browser) {
  this.browser = browser;

  this.notificationCount = this.browser.$('.notification-count');
  this.element = this.browser.$('header.header-new');
  this.searchField = this.element.element(by.model('search.query'));
  this.searchResults = this.element.all(by.repeater('match in matches'));
}

HeaderComponent.prototype.get = function(destination) {
  var currentUrl;
  if (mainHeaderLinks[destination]) {
    this.browser.$('.header-main-icons-row .table-cell:nth-child(' + mainHeaderLinks[destination].id + ')').click();
    currentUrl = this.browser.getCurrentUrl();
    expect(currentUrl).toMatch(mainHeaderLinks[destination].url);
  } else if (topHeaderLinks[destination]) {
    this.browser.$(topHeaderLinks[destination].selector).click();
    currentUrl = this.browser.getCurrentUrl();
    expect(currentUrl).toMatch(topHeaderLinks[destination].url);
  }
  return currentUrl;
};

HeaderComponent.prototype.search = function(string) {
  this.searchField.clear().sendKeys(string);
  this.browser.sleep(500);
};

HeaderComponent.prototype.hasUnreadNotification = function() {
  this.notificationCount.getText().then(function(notificationText) {
    expect(notificationText).toContain(jasmine.any(Number));
    expect(notificationText).not.toContain(0);
  });
};

HeaderComponent.prototype.signOut = function() {
  this.browser.$('.header-poweroff-icon').click();
  helper.hasSuccess('Vous êtes maintenant déconnecté. A bientôt !', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/.*\/(?:sign-out|deconnexion)/);
};

module.exports = function(customBrowser) {
  return new HeaderComponent(customBrowser || browser);
};
