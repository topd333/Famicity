'use strict';

var helper = require('../helper.js');
var faker = require('faker');

describe('Browser', function() {
  it('sets test cookie', function() {
    helper.setTestCookie();
  });

  it('sets faker locale', function() {
    faker.locale = 'fr';
  });

  it('set window size', function() {
    browser.driver.manage().window().maximize();
  });
});
