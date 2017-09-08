'use strict';

var helper = require('../helper');

function WizardPage(browser) {
  this.browser = browser;

  this.profile = {
    male: this.browser.$('label[for="male"]'),
    female: this.browser.$('label[for="female"]'),
    last_name: this.browser.element(by.model('user.last_name')),
    first_name: this.browser.element(by.model('user.first_name')),
    birth_date: this.browser.element(by.model('value')),
    guesses: this.browser.element.all(by.repeater('guess in guesses')),
    avatar: this.browser.$('input[type="file"]'),
    crop: this.browser.$('button[ng-click="cropIt()"]'),
    validateButton: this.browser.element(by.id('form-button'))
  };
}

WizardPage.prototype.fillProfile = function(user) {
  var self = this;
  this.profile.male.click();
  // last name
  this.profile.last_name.clear();
  user.lastName &&
  this.profile.last_name.sendKeys(user.lastName);
  // first name
  this.profile.first_name.clear();
  user.firstName &&
  this.profile.first_name.sendKeys(user.firstName);
  // birth date
  this.profile.birth_date.clear();
  if (user.birthDate) {
    var frDate = helper.dateFr(user.birthDate);
    var fullDateFr = helper.fullDateFr(user.birthDate);
    this.profile.birth_date.sendKeys(frDate).then(function() {
      self.browser.sleep(1000).then(function() {
        expect(self.profile.guesses.get(0).getText()).toBe(fullDateFr);
      });
    });
  }
  if (user.avatar) {
    this.profile.avatar.sendKeys(helper.imgPath);
  }
  if (user.avatar) {
    this.browser.sleep(2000);
    this.profile.crop.click();
  }
  // TODO: check why we need to loose date focus on chrome
  this.profile.last_name.click();
};

WizardPage.prototype.goThrough = function(user, options) {
  options = options || {};

  // Fill the wizard first step
  expect(this.browser.getCurrentUrl()).toMatch(/\/internal\/wizard\/profile/);
  this.fillProfile(user);
  this.profile.validateButton.click();
  if (user.avatar) {
    helper.hasSuccess('La photo a été redimensionnée avec succès.', this.browser);
  }
  // Skip each following step
  // expect(this.browser.getCurrentUrl()).toMatch(/\/internal\/wizard\/avatar/);
  // this.browser.$('.skip-step').click();
  // If we have invitations
  if (options.acceptAll || options.declineAll) {
    expect(this.browser.getCurrentUrl()).toMatch(/\/internal\/wizard\/received-invitations/);
    expect(this.browser.element(by.repeater('user in formattedUsers')).getText()).toContain(options.inviter.firstName + ' ' + options.inviter.lastName.toUpperCase());
    if (options.acceptAll) {
      // TODO: this does not accept all, but accepts the first one
      this.browser.$('.directory-listing .accept').click();
      helper.hasSuccess(helper.user.username(options.inviter) + ' fait maintenant partie de votre groupe "Tous mes proches".', this.browser);
      // this.browser.$('.skip-step').click();
    } else if (options.declineAll) {
      this.browser.$('.skip-step').click();
    }
  }

  expect(this.browser.getCurrentUrl()).toMatch(/\/internal\/wizard\/invite-menu/);
  this.browser.$('.skip-step').click();

  expect(this.browser.getCurrentUrl()).toMatch(/\/internal\/wizard\/tree_info/);
  this.browser.$('button[ng-click="goToTree()"]').click();
};

module.exports = function(customBrowser) {
  return new WizardPage(customBrowser || browser);
};
