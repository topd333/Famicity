'use strict';

function ResetPassword(browser) {
  this.browser = browser;
  this.email = this.browser.element(by.model('recover.userEmail'));
  this.validateButton = this.browser.$('button[fc-form-submit]');
}

ResetPassword.prototype.get = function() {
  this.browser.$('a[ui-sref="public.password_recoveries({email: signIn.sessionUsername, locale: locale})"]').click();
  expect(this.browser.getCurrentUrl()).toContain('/fr/mot_de_passe_oublie');
};

ResetPassword.prototype.fillForm = function(email) {
  this.email.clear();
  email &&
  this.email.sendKeys(email);
};

ResetPassword.prototype.write = function(email) {
  this.fillForm(email);
  this.validateButton.click();
  expect(this.browser.getCurrentUrl()).toContain('/forgotten-password-s2');
};

module.exports = function(customBrowser) {
  return new ResetPassword(customBrowser || browser);
};
