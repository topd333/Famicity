/* global protractor */

'use strict';

var helper = require('../helper');
var Page = require('../helpers/Page');

function DirectoryPage(browser) {
  Page.apply(this, arguments);
  this.browser = browser;

  this.users = this.browser.element.all(by.repeater('user in formattedUsers'));
  this.searchField = this.browser.element(by.model('search.criteria'));
}

DirectoryPage.prototype = Object.create(Page.prototype);
DirectoryPage.prototype.constuctor = DirectoryPage;

DirectoryPage.prototype.get = function() {
  return this.header.get('directory');
};

DirectoryPage.prototype.search = function(string) {
  this.searchField.clear().sendKeys(string);
  this.browser.sleep(1000);
};

DirectoryPage.prototype.createGroup = function(name) {
  var groupId;
  var deferred = protractor.promise.defer();
  this.browser.$$('.left-column:not(.hidden) .left-column-block-header').get(1).click();
  this.browser.element(by.model('formHolder.addGroupName')).clear().sendKeys(name + '\n');
  this.browser.getCurrentUrl().then(function(url) {
    expect(url).toMatch(/\/u\/directory\/groups\/(\d*)/);
    groupId = url.match(/\/u\/directory\/groups\/(\d*)/)[1];
    deferred.fulfill(groupId);
  });
  helper.hasSuccess('', this.browser);
  expect(this.browser.$('.left-column-block').getText()).toContain(name);
  return deferred.promise;
};

DirectoryPage.prototype.renameGroup = function(old, newName) {
  this.menu.click(0);
  expect(this.browser.$('.popin-dialog').isPresent()).toBe(true);
  this.browser.$('button[ng-click="goToRenameGroup()"]').click();
  expect(this.browser.element(by.model('formHolder.renameFormGroupName')).getAttribute('value')).toBe(old.name);
  this.browser.element(by.model('formHolder.renameFormGroupName')).clear().sendKeys(newName + '\n');
  expect(this.browser.getCurrentUrl()).toContain('/u/directory/groups/' + old.id);
  helper.hasSuccess('', this.browser);
  expect(this.browser.$('.breadcrumb').getText()).toContain(newName);
  // TODO: group name is not updated on the left block
  // expect($('.left-column-block')).getText()).toContain('TEST2');
};

DirectoryPage.prototype.deleteGroup = function(deletedGroupName) {
  this.openEditPopup();
  this.browser.$('button[ng-click="goToDeleteGroup()"]').click();
  expect(this.browser.$('.popin-dialog').isPresent()).toBe(true);
  this.browser.$('.popin-dialog .btn-primary').click();
  helper.hasSuccess('', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/u\/directory/);
  expect(this.browser.$('.left-column-block').getText()).not.toContain(deletedGroupName);
};

DirectoryPage.prototype.addUserToGroup = function(userToAdd) {
  var self = this;
  var deferred = protractor.promise.defer();
  var globalDeferred = protractor.promise.defer();
  this.browser.$('.vertical-button-group .btn-primary').click();
  var users = this.browser.element.all(by.repeater('user in formattedUsers')).filter(function(el) {
    return el.getAttribute('class').then(function(className) {
      return className.indexOf('separator') < 0;
    });
  });
  users.each(function(user) {
    user.$('.directory-item-table-cell-info').getText().then(function(info) {
      self.browser.sleep(200);
      if (info.indexOf(helper.user.username(userToAdd)) > -1) {
        // user.$('.directory-listing-item-checkbox').click()
        self.browser.executeScript('$(\'.directory-listing-item-checkbox input\').click()')
          .then(function() {
            self.browser.sleep(1000);
            deferred.fulfill();
          });
      }
    });
  });
  deferred.promise.then(function() {
    self.browser.$('a[ng-click="sendMultipleAdd()"].btn-primary').click();
    self.browser.sleep(200);
    helper.hasSuccess('Les membres ont été ajoutés avec succès.');
    var users = self.browser.element.all(by.repeater('user in formattedUsers')).filter(function(el) {
      return el.getAttribute('class').then(function(className) {
        return className.indexOf('separator') < 0;
      });
    });
    expect(users.get(0).getText()).toContain(helper.user.username(userToAdd));
    globalDeferred.fulfill();
  });
  return globalDeferred.promise;
};

DirectoryPage.prototype.tryInvite = function(firstName, lastName, email) {
  this.browser.element(by.model('user.lastName')).clear().sendKeys(lastName);
  this.browser.element(by.model('user.firstName')).clear().sendKeys(firstName);
  this.browser.element(by.model('user.email')).clear().sendKeys(email + '\n');
};

DirectoryPage.prototype.invite = function(firstName, lastName, email) {
  expect(this.browser.getCurrentUrl()).toMatch(/\/u\/directory\/add/);
  this.tryInvite(firstName, lastName, email);
  expect(this.browser.getCurrentUrl()).toMatch(/\/u\/directory\/add/);
  helper.hasSuccess('Invitation envoyée avec succès.', this.browser);
};

DirectoryPage.prototype.fillAdd = function(user) {
  this.browser.element(by.model('user.lastName')).clear().sendKeys(user.lastName);
  this.browser.element(by.model('user.firstName')).clear().sendKeys(user.firstName);
  this.browser.element(by.model('user.email')).clear().sendKeys(user.email);
};

DirectoryPage.prototype.add = function(user) {
  expect(this.browser.getCurrentUrl()).toMatch(/\/u\/directory\/add/);
  this.fillAdd(user);
  this.browser.$('a[data-submit-method="addContact()"]').click();
  expect(this.browser.getCurrentUrl()).toMatch(/\/u\/directory\/add/);
  helper.hasSuccess('Le contact a été créé avec succès.', this.browser);
};

DirectoryPage.prototype.hasBeenInvited = function(user, options) {
  options = options || {};
  options.checkName = options.checkName != null ? options.checkName : true;
  this.get();
  this.browser.$('.fa-eye').click();
  expect(this.browser.getCurrentUrl()).toMatch(/\/u\/directory\/sent-invitations/);
  var invitedUsers = this.browser.element.all(by.repeater('user in formattedUsers'));
  var currentYear = new Date().getFullYear();
  if (options.checkName) {
    expect(invitedUsers.get(0).getText()).toContain(user.firstName + user.lastName.toUpperCase());
  }
  expect(invitedUsers.get(0).getText()).toContain(user.email.toLowerCase());
  expect(invitedUsers.get(0).getText()).toContain(currentYear);
};

DirectoryPage.prototype.openEditPopup = function() {
  this.menu.click(0);
  expect(this.browser.$('.popin-dialog').isPresent()).toBe(true);
};

module.exports = function(customBrowser) {
  return new DirectoryPage(customBrowser || browser);
};
