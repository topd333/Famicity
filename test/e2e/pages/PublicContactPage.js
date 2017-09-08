'use strict';

var helper = require('../helper');

function PublicContactPage(browser) {
  this.browser = browser;
  this.email = browser.element(by.model('contact.userEmail'));
  this.message = browser.element(by.model('contact.contactContent'));
  this.validateButton = browser.$('button[data-fc-form-submit]');
}

PublicContactPage.prototype.get = function() {
  this.browser.$('a[ui-sref="public.contact({locale: locale})"]').click();
  expect(this.browser.getCurrentUrl()).toContain('/fr/contact');
};

PublicContactPage.prototype.fillForm = function(contact) {
  this.email.clear();
  contact.email &&
  this.email.sendKeys(contact.email);
  this.message.clear();
  contact.message &&
  this.message.sendKeys(contact.message);
};

PublicContactPage.prototype.write = function(contact) {
  this.fillForm(contact);
  this.validateButton.click();
  helper.hasSuccess('Votre message a bien été envoyé !', this.browser);
  expect(this.browser.getCurrentUrl()).toContain('/fr/inscrivez-vous');
};

module.exports = function(customBrowser) {
  return new PublicContactPage(customBrowser || browser);
};
