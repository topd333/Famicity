/* global protractor */
'use strict';

var helper = require('../helper');

function OldPermissionsPage(browser) {
  this.browser = browser;
  this.userTab = this.browser.$('a[ng-click="showUsers()"]');
  this.groupTab = this.browser.$('a[ng-click="showGroups()"]');
  this.emailTab = this.browser.$('a[ng-click="showInvitations()"]');
}

OldPermissionsPage.prototype.addPermissions = function(permissions) {
  var self = this;
  var deferreds = [];

  if (permissions.users) {
    this.userTab.click();
    var users = this.browser.element.all(by.repeater('user in formattedUsers')).filter(function(el) {
      return el.getAttribute('class').then(function(className) {
        return className.indexOf('separator') < 0;
      });
    });
    // Iterate over users that must be added to the permissions, and select them
    permissions.users.forEach(function(userToAdd) {
      var deferred = protractor.promise.defer();
      deferreds.push(deferred.promise);
      users.each(function(user, i) {
        user.$('.directory-item-table-cell-info').getText().then(function(info) {
          self.browser.sleep(200);
          if (info.indexOf(helper.user.username(userToAdd)) > -1) {
            // user.$('.directory-listing-item-checkbox').click()
            self.browser.executeScript('$(\'.directory-listing-item-checkbox:nth(' + i + ') input\').click()')
              .then(function() {
                self.browser.sleep(1000);
                deferred.fulfill();
              });
          }
        });
      });
    });
    protractor.promise.all(deferreds).then(function() {

    });
  }
  if (permissions.groups) {
    this.groupTab.click();
    var groups = this.browser.element.all(by.repeater('group in groups'));
    // Iterate over users that must be added to the permissions, and select them
    permissions.groups.forEach(function(groupToAdd) {
      var deferred = protractor.promise.defer();
      deferreds.push(deferred.promise);
      groups.each(function(group, i) {
        group.$('.directory-listing-item').getText().then(function(info) {
          self.browser.sleep(200);
          if (info.indexOf(groupToAdd) > -1) {
            // user.$('.directory-listing-item-checkbox').click()
            self.browser.executeScript('$(\'.directory-listing-item-checkbox:nth(' + i + ') input\').click()')
              .then(function() {
                self.browser.sleep(1000);
                deferred.fulfill();
              });
          }
        });
      });
    });
    protractor.promise.all(deferreds).then(function() {

    });
  }
  if (permissions.emails) {
    this.emailTab.click();
    if (permissions.emails.length > 3) {
      for (var i = 3; i !== permissions.emails.length; i++) {
        this.browser.$('a[ng-click="addMailField()"]').click();
      }
    }
    permissions.emails.forEach(function(email, id) {
      self.browser.$('#email' + id).sendKeys(email);
    });
  }
  this.browser.$('.directory-listing-invitation-button a[ng-click="submitPermission()"]').click();
};

module.exports = function(customBrowser) {
  return new OldPermissionsPage(customBrowser || browser);
};
