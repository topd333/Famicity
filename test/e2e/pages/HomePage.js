'use strict';

var helper = require('../helper');
var Page = require('../helpers/Page');

function HomePage(browser) {
  this.browser = browser;
  this.email = this.what('username');
  this.password = this.what('password');
}

HomePage.prototype = new Page();

HomePage.prototype.get = function() {
  return this.browser.get('/');
};

HomePage.prototype.trySignUp = function(email, password) {
  this.email.clear().sendKeys(email);
  this.password.clear().sendKeys(password + '\n');
};

HomePage.prototype.signUp = function(email, password) {
  this.trySignUp(email, password);
  helper.hasSuccess('Votre compte a été créé avec succès.', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/internal\/wizard\/profile/);
};

HomePage.prototype.signIn = function(email, password) {
  this.email.clear().sendKeys(email);
  this.password.clear().sendKeys(password + '\n');
  helper.hasSuccess('Connexion réussie ! Heureux de vous revoir sur Famicity !', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/(home|feed)/);
};

HomePage.prototype.hasCurrentStoryBlock = function() {

};

HomePage.prototype.hasBirthdayBlock = function() {

};

HomePage.prototype.hasEventBlock = function() {

};

HomePage.prototype.hasLastConnectedBlock = function() {

};

module.exports = function(customBrowser) {
  return new HomePage(customBrowser || browser);
};
