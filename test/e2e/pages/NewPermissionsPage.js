
'use strict';

function OldPermissionsPage(element, browser) {
  this.browser = browser;
  this.element = element;
  // Permissions
  this.permissions = this.element.$('.permission-edit[selected-permissions="permissions.allowed"]');
  this.permissionsList = this.permissions.$('.permission-list');
  this.permissionsInput = this.permissions.$('input');
  this.permissionsProposals = this.permissions.$('.proposals');
  // Exclusions
  this.exclusions = this.element.$('.permission-edit[selected-permissions="permissions.disallowed"]');
  this.exclusionsList = this.exclusions.$('.permission-list');
  this.exclusionsInput = this.exclusions.$('input');
  this.exclusionsProposals = this.exclusions.$('.proposals');
}

OldPermissionsPage.prototype.addPermissions = function(permissions) {
  if (permissions.users) {

  }
  if (permissions.groups) {

  }
  if (permissions.emails) {

  }
};

module.exports = function(customBrowser) {
  return new OldPermissionsPage(customBrowser || browser);
};
