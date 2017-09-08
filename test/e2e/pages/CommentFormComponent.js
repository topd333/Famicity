'use strict';

var helper = require('../helper');

function CommentFormComponent(element, browser) {
  this.browser = browser;
  this.element = element;
  this.content = this.element.element(by.model('model.textValue'));
  this.htmlContent = this.element.element(by.binding('model.htmlValue | trustedHtml'));
  this.validateButton = this.element.$('.end .btn-primary');
  this.editButton = this.element.$('.fa-pencil-square-o');
  this.deleteButton = this.element.$('.fa-trash-o');
  this.cancelButton = this.element.$('.end .btn-secondary');
}

CommentFormComponent.prototype.initiateCreation = function() {
  this.content.click();
  expect(helper.hasClass(this.element.$('.inline'), 'creating')).toBe(true);
};

CommentFormComponent.prototype.fillForm = function(comment) {
  this.content.clear().sendKeys(comment.content);
};

CommentFormComponent.prototype.write = function(comment, edit) {
  this.fillForm(comment);
  helper.scrollToElement(this.validateButton, this.browser);
  this.validateButton.click();
  if (edit) {
    helper.hasSuccess('Le commentaire a été modifié avec succès.', this.browser);
  } else {
    helper.hasSuccess('Le commentaire a été ajouté avec succès.', this.browser);
  }
};

module.exports = function(element, customBrowser) {
  return new CommentFormComponent(element, customBrowser || browser);
};
