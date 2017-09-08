/* globals by: false */

'use strict';

function Page(browser) {
  this.menu = require('../pages/MenuComponent')(browser || this.browser);
  this.yesnopopin = require('../pages/YesNoPopinComponent')(browser || this.browser);
  this.header = require('../pages/HeaderComponent')(browser || this.browser);
}

Page.prototype.what = function(what) {
  return this.browser.element(by.what.call(this, what));
};

Page.prototype.which = function(which) {
  return this.browser.element(by.which.call(this, which));
};

Page.prototype.all = function(what) {
  return this.browser.element.all(by.what(what));
};

Page.prototype.select = function(selector) {
  return this.browser.element(by.css(selector));
};

module.exports = Page;
