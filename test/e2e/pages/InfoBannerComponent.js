'use strict';

function InfoBannerComponent(browser) {
  this.browser = browser;
  this.el = this.browser.$('.info-banner').isDisplayed();
}

InfoBannerComponent.prototype.isPresent = function() {
  expect(this.el.isPresent()).toBe(true);
};

module.exports = function(customBrowser) {
  return new InfoBannerComponent(customBrowser || browser);
};
