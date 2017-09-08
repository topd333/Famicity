'use strict';

function YesNoPopinComponent(browser) {
  this.browser = browser;
  this.element = this.browser.element(by.css('.yes-no-popin'));
}

YesNoPopinComponent.prototype.isDisplayed = function() {
  return this.element.isDisplayed();
};

YesNoPopinComponent.prototype.yes = function() {
  return this.element.$('.yes-no-popin [ng-click="yes()"]').click();
};

YesNoPopinComponent.prototype.no = function() {
  return this.element.$('.yes-no-popin [ng-click="no()"]').click();
};

module.exports = function(customBrowser) {
  return new YesNoPopinComponent(customBrowser || browser);
};
