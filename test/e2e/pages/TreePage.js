'use strict';

var helper = require('../helper');

function TreePage(browser) {
  this.browser = browser;
}

TreePage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  return header.get('tree', this.browser);
};

TreePage.prototype.fillAddRelativeForm = function(user, popup) {
  popup && this.checkAddRelativePopup(popup);

  user.sex && user.sex === 'F' &&
  this.browser.$('label[for="female"]').click();
  user.sex && user.sex === 'M' &&
  this.browser.$('label[for="male"]').click();

  user.lastName &&
  this.browser.element(by.model('currentForm.user.last_name')).clear().sendKeys(user.lastName);

  user.deceased &&
  this.browser.$('label[for="deceased"]').click();
  user.deathDeate &&
  this.browser.element(by.model('currentForm.user.death_date')).clear().sendKeys(user.deathDeate);

  user.maidenName &&
  this.browser.element(by.model('currentForm.user.user_info_attributes.maiden_name')).clear().sendKeys(user.maidenName);

  user.email &&
  this.browser.element(by.model('invitationFormHolder.mail_address')).clear().sendKeys(user.email);

  this.browser.element(by.model('currentForm.user.first_name')).clear().sendKeys(user.firstName);
  this.browser.element(by.model('currentForm.user.birth_date')).element(by.model('value')).sendKeys(helper.dateFr(user.birthDate));
  this.browser.element(by.css('.tree-popup .btn-primary[type="submit"]')).click();
  if (user.fill) {
    helper.hasSuccess('Le profil a bien été renseigné.', this.browser);
  } else if (user.email) {
    helper.hasSuccess('Le profil a bien été renseigné et invité à rejoindre Famicity.', this.browser);
  } else {
    helper.hasSuccess('Votre proche a été ajouté avec succès.', this.browser);
  }
  if (!user.isStep) {
    expect(this.browser.$('.tree-popup').isPresent()).toBe(false);
    this.browser.sleep(200);
    expect(this.browser.element(by.id('tr-ba')).getText()).toContain(user.firstName);
  }
};

TreePage.prototype.checkAddRelativePopup = function(popup) {
  popup.title &&
  expect(this.browser.$('#tree-user-modal .tree-popup-header .pull-left').getText()).toContain(popup.title);
  popup.button &&
  expect(this.browser.$('#tree-user-modal .btn-primary').getText()).toContain(popup.button);
  popup.url &&
  expect(this.browser.getCurrentUrl()).toMatch(popup.url);
};

TreePage.prototype.openTreePopin = function(id) {
  var promise = this.browser.element(by.id('tr-com-' + id)).click();
  expect(this.browser.$('.tree-popup').isPresent()).toBe(true);
  return promise;
};

TreePage.prototype.closeTreePopin = function() {
  var promise = this.browser.$('.close-popup-icon').click();
  expect(this.browser.$('.tree-popup').isPresent()).toBe(false);
  return promise;
};

module.exports = function(customBrowser) {
  return new TreePage(customBrowser || browser);
};
