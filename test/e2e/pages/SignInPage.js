'use strict';

var helper = require('../helper');
var Page = require('../helpers/Page');

function SignInPage(browser) {
  this.browser = browser;
  this.email = this.what('username');
  this.password = this.what('password');
}

SignInPage.prototype = new Page();

SignInPage.prototype.get = function() {
  // TODO : user way
  return this.browser.get('/sign-in');
};

SignInPage.prototype.trySignIn = function(email, password) {
  this.email.sendKeys(email);
  this.password.sendKeys(password);
};

SignInPage.prototype.signIn = function(email, password) {
  this.trySignIn(email, password + '\n');
  expect(this.browser.getCurrentUrl()).toMatch(/\/(home|feed)/);
  helper.hasSuccess('Connexion réussie ! Heureux de vous revoir sur Famicity !', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/(home|feed)/);
};

module.exports = function(customBrowser) {
  return new SignInPage(customBrowser || browser);
};
