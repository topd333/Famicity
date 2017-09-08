'use strict';

var helper = require('../helper');

function SettingsPage(browser) {
  this.browser = browser;
}

SettingsPage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  return header.get('settings');
};

SettingsPage.prototype.select = function(area) {
  area === 'deleteAccount' &&
  this.browser.$('.left-column-block-content a:last-child').click();
};

SettingsPage.prototype.deleteAccount = function() {
  this.browser.element(by.model('reason')).sendKeys('TEST');
  this.browser.$('.btn-secondary').click();
  helper.hasSuccess('Votre compte a été supprimé avec succès.', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/[a-z]{2}(?:-[a-z]{2})?\/inscrivez-vous\/?$/);
};

module.exports = function(customBrowser) {
  return new SettingsPage(customBrowser || browser);
};
