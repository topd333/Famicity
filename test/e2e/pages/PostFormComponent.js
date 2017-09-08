/* global protractor:false */
'use strict';

var helper = require('../helper');

function PostFormComponent(element, browser) {
  this.element = element;
  this.browser = browser;
  this.initElements();
}

PostFormComponent.prototype.initElements = function() {
  this.showMoreOptions = this.element.$('.show-more-options');
  // Basic inputs
  this.content = this.element.element(by.model('model.textValue'));
  this.title = this.element.element(by.model('object[key]'));
  this.file = this.element.$('input[type="file"]');
  this.img = this.element.$('.blog-post-add-picture-lc img');
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
  // Buttons
  //this.editButton =
  this.validateButton = this.element.$('.end .btn-primary');
  this.cancelButton = this.element.$('.end .btn-secondary');
}

PostFormComponent.prototype.isPresent = function() {
  expect(this.element.isPresent()).toBe(true);
};

PostFormComponent.prototype.initiateCreation = function() {
  this.content.click();
  expect(helper.hasClass(this.element.$('.inline'), 'creating')).toBe(true);
};

PostFormComponent.prototype.hasDefaultPermissions = function(defaultPermissions) {
  defaultPermissions = defaultPermissions || 'Tous mes proches';
  expect(this.permissions.getText()).toContain(defaultPermissions);
  expect(this.exclusions.isPresent()).toBe(false);
};

PostFormComponent.prototype.hasPermission = function(permission) {
  expect(this.permissionsList.getText()).toContain(permission);
};

PostFormComponent.prototype.hasNoPermission = function() {
  expect(this.permissionsList.getText()).toBe('');
};

PostFormComponent.prototype.fillForm = function(post) {
  var self = this;
  this.element.element(by.model('object.event_date')).isPresent()
    .then(function(isPresent) {
      if (!isPresent) {
        self.showMoreOptions.click();
      }
      self.content.clear();
      self.title.clear();

      post.content &&
      self.content.sendKeys(post.content);

      post.title &&
      self.title.sendKeys(post.title);

      ['permissions', 'exclusions'].forEach(function(el) {
        var type = post[el];
        var input = self[el + 'Input'];
        var proposals = self[el + 'Proposals'];

        if (type) {
          if (el === 'permissions' && type.emails) {
            type.emails.forEach(function(email) {
              input.sendKeys(protractor.Key.BACK_SPACE);
              input.sendKeys(email);
              input.sendKeys(protractor.Key.TAB);
            });
          }
          if (type.groups) {
            type.groups.forEach(function(group) {
              input.sendKeys(protractor.Key.BACK_SPACE);
              input.sendKeys(protractor.Key.ESCAPE);
              input.sendKeys(group);
              self.browser.wait(function() { return proposals.isDisplayed(); }, 2000).then(function() {
                self.browser.sleep(200);
                input.sendKeys(protractor.Key.ARROW_DOWN);
              });
              input.sendKeys(protractor.Key.ENTER);
            });
          }
          if (type.users) {
            type.users.forEach(function(user) {
              input.sendKeys(protractor.Key.BACK_SPACE);
              input.sendKeys(protractor.Key.ESCAPE);
              input.sendKeys(helper.user.username(user));
              self.browser.wait(function() { return proposals.isDisplayed(); }, 2000).then(function() {
                self.browser.sleep(200);
                input.sendKeys(protractor.Key.ARROW_DOWN);
              });
              input.sendKeys(protractor.Key.ENTER);
            });
          }
        }
      });

      if (post.picture) {
        self.file.sendKeys(helper.imgPath);
      }
    });
};

PostFormComponent.prototype.write = function(post, edit) {
  this.fillForm(post);
  this.validateButton.click();
  post.picture && this.browser.sleep(1000);
  if (edit) {
    helper.hasSuccess('La nouvelle a été modifiée', this.browser);
  } else {
    helper.hasSuccess('La nouvelle a été créée', this.browser);
  }
};

PostFormComponent.prototype.delete = function() {
  this.element.$$('.inline .button-edit[tooltip="Modifier"] .fa-pencil-square-o').get(0).click();
  this.element.$('.deletion').click();
  var yesnopopin = require('./YesNoPopinComponent')(this.browser);
  expect(yesnopopin.isDisplayed()).toBe(true);
  yesnopopin.yes();
  helper.hasSuccess('La nouvelle a été supprimée', this.browser);
};

module.exports = function(element, customBrowser) {
  return new PostFormComponent(element, customBrowser || browser);
};
