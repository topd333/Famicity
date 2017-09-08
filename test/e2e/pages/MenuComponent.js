'use strict';

function MenuComponent(browser) {
  this.browser = browser;
  this.element = this.browser.element(by.css('fc-toolbar'));
}

MenuComponent.prototype.click = function(number) {
  var toolbar = this.element;
  this.browser.wait(function() {
    return toolbar.all(by.repeater('choice in choices')).count().then(function(count) {
      return count > 0;
    });
  }, 1000);
  this.element.all(by.repeater('choice in choices')).get(number).$('a').click();
};

module.exports = function(customBrowser) {
  return new MenuComponent(customBrowser || browser);
};
