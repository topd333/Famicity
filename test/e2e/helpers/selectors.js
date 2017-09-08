/* globals document: false */

'use strict';

module.exports = function(protractor) {
  var originalElementAllMethod;

  var By = protractor.By;
  var ElementFinder = protractor.ElementFinder;
  var ElementArrayFinder = protractor.ElementArrayFinder;

  By.addLocator('what', function(what) {
    var elements;
    var firstOnly;
    var parent;
    if (arguments.length === 4) {
      parent = arguments[2];
      firstOnly = arguments[3];
    } else {
      parent = arguments[1];
      firstOnly = false;
    }
    elements = (parent || document).querySelectorAll('[what="' + what + '"]');
    if (firstOnly) {
      return [elements[0]];
    }
    return elements;
  });
  ElementFinder.prototype.get = function(what) {
    var element;
    if (typeof what === 'string') {
      element = this.element(By.what(what));
    } else {
      element = this.element(what);
    }
    return element;
  };
  ElementFinder.prototype.select = function(selector) {
    return this.element(By.css(selector));
  };
  ElementFinder.prototype.parent = function() {
    return this.element(By.xpath('..'));
  };
  originalElementAllMethod = ElementFinder.prototype.all;
  ElementFinder.prototype.all = function(what) {
    var elements;
    if (typeof what === 'string') {
      elements = this.all(By.what(what));
    } else {
      elements = originalElementAllMethod.apply(this, arguments);
    }
    return elements;
  };
  ElementArrayFinder.prototype.which = function(which) {
    var filter;
    filter = function(element) {
      return element.getAttribute('which').then(function(value) {
        return which === value;
      });
    };
    return this.filter(filter).toElementFinder_();
  };
};
