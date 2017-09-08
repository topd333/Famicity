/* global protractor */

'use strict';

var faker = require('faker');
var moment = require('moment');
var path = require('path');

moment.locale('fr');

var hasNotification = function(type, message, customBrowser) {
  var browserToTestOn = customBrowser || browser;
  var notification = browserToTestOn.$('.alert' + type);
  // Wait for notification to be displayed
  browserToTestOn.wait(function() {
    return notification.isPresent().then(function(isPresent) {
      return isPresent;
    });
  }, 5000);
  notification.isDisplayed().then(function(isPresent) {
    expect(isPresent).toBe(true);
    if (message) {
      notification.element(by.binding('notif.text')).getText().then(function(notificationMessage) {
        expect(notificationMessage).toBe(message);
        notification.$('.close').click();
      });
    } else {
      notification.$('.close').click();
    }
  });
};

// is the success notification present
var hasSuccess = function(message, customBrowser) {
  return hasNotification('.alert-success', message, customBrowser);
};

// is the danger notification present
var hasFailure = function(message, customBrowser) {
  return hasNotification('.alert-danger', message, customBrowser);
};

var hasClass = function(element, cssClass) {
  return element.getAttribute('class').then(function(classes) {
    return classes.split(' ').indexOf(cssClass) !== -1;
  });
};

var setTestCookie = function(customBrowser) {
  var browserToTestOn = customBrowser || browser;
  browserToTestOn.get('/').then(function() {
    browserToTestOn.manage().addCookie('fast_animation', 'true', '/', '.famicity.com');
    browserToTestOn.manage().addCookie('locale', 'fr', '/', '.famicity.com');
  });
  browserToTestOn.get('/');
};

var deleteCookie = function(cookie, customBrowser) {
  var browserToTestOn = customBrowser || browser;
  browserToTestOn.get('/').then(function() {
    browserToTestOn.manage().deleteCookie(cookie);
  });
  browserToTestOn.get('/');
};

// var today = new Date();

var user = {
  generate: function(id) {
    var firstName = faker.name.firstName();
    var lastName = faker.name.lastName();
    var generated = {
      email: faker.internet.email(firstName.toLowerCase(), lastName.toLowerCase()).replace('@', '_' + faker.random.number({max: 999}) + '@'),
      password: 'password',
      firstName: firstName,
      lastName: lastName,
      birthDate: faker.date.between(new Date(1880, 1, 1), new Date(new Date().getFullYear() - 1, 1, 1))
    };
    id = id || firstName + faker.random.number({max: 999});
    user[id] = generated;
    return generated;
  },
  username: function(user) {
    return user.firstName + ' ' + user.lastName.toUpperCase();
  }
};

var dateFr = function(date) {
  return moment(date).format('L');
};

var fullDateFr = function(date) {
  return moment(date).format('[Le] dddd D MMMM YYYY');
};

var createUser = function(customUser, customBrowser) {
  customBrowser = customBrowser || browser;
  customUser = customUser || user.generate();
  var home = require('./pages/HomePage')(customBrowser);
  var wizard = require('./pages/WizardPage')(customBrowser);
  home.get();
  home.signUp(customUser.email, customUser.password);
  wizard.goThrough(customUser);
  return customUser;
};

var scrollToBottom = function(customBrowser) {
  var browserToTestOn = customBrowser || browser;
  return browserToTestOn.executeScript('window.scrollTo(0, document.body.scrollHeight);');
};

var scrollToElement = function(element, customBrowser) {
  var browserToTestOn = customBrowser || browser;
  return browserToTestOn.executeScript('arguments[0].scrollIntoView()', element.getWebElement());
};

var wait = function(promiseFn, testFn) {
  browser.wait(function() {
    var deferred = protractor.promise.defer();
    promiseFn().then(function(data) {
      deferred.fulfill(testFn(data));
    });
    return deferred.promise;
  });
};

var selectWindow = function(index) {
  // wait for handles[index] to exists
  browser.driver.wait(function() {
    return browser.driver.getAllWindowHandles().then(function(handles) {
      /**
       * Assume that handles.length >= 1 and index >=0.
       * So when i call selectWindow(index) i return
       * true if handles contains that window.
       */
      if (handles.length > index) {
        return true;
      }
    });
  });
  // here i know that the requested window exists

  // switch to the window
  return browser.driver.getAllWindowHandles().then(function(handles) {
    return browser.driver.switchTo().window(handles[index]);
  });
};

var capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var removeDiacritics = function(value) {
  return value.toLowerCase()
    .replace(new RegExp('\\s', 'g'), '')
    .replace(new RegExp('[àáâãäå]', 'g'), 'a')
    .replace(new RegExp('æ', 'g'), 'ae')
    .replace(new RegExp('ç', 'g'), 'c')
    .replace(new RegExp('[èéêë]', 'g'), 'e')
    .replace(new RegExp('[ìíîï]', 'g'), 'i')
    .replace(new RegExp('ñ', 'g'), 'n')
    .replace(new RegExp('[òóôõö]', 'g'), 'o')
    .replace(new RegExp('œ', 'g'), 'oe')
    .replace(new RegExp('[ùúûü]', 'g'), 'u')
    .replace(new RegExp('[ýÿ]', 'g'), 'y')
    .replace(new RegExp('\\W', 'g'), '');
};

module.exports = {
  hasSuccess: hasSuccess,
  hasFailure: hasFailure,
  hasClass: hasClass,
  setTestCookie: setTestCookie,
  deleteCookie: deleteCookie,
  user: user,
  dateFr: dateFr,
  fullDateFr: fullDateFr,
  createUser: createUser,
  scrollToBottom: scrollToBottom,
  scrollToElement: scrollToElement,
  wait: wait,
  selectWindow: selectWindow,
  capitalize: capitalize,
  removeDiacritics: removeDiacritics,
  imgPath: process.env.IMAGE_PATH || path.resolve(__dirname, 'helpers/image.jpg')
};
