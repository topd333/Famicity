'use strict';

var helper = require('./../../helper');
var directory = require('./../../pages/DirectoryPage')();
var faker = require('faker');
var header = require('./../../pages/HeaderComponent')();
var users;

function generateUser(firstName, lastName) {
  return {
    firstName: firstName,
    lastName: lastName,
    email: faker.internet.email(firstName.toLowerCase(), lastName.toLowerCase()).replace('@', '_' + faker.random.number({max: 999}) + '@')
  };
}

users = [
  generateUser(faker.name.firstName(), 'Aaaaaa'),
  generateUser(faker.name.firstName(), 'Àbbbbb'),
  generateUser(faker.name.firstName(), '☆Acccc'),
  //generateUser(faker.name.firstName(), 'B Aaaa'),
  generateUser(faker.name.firstName(), 'Baaaa'),
  generateUser(faker.name.firstName(), 'Bàbbb'),
  generateUser(faker.name.firstName(), 'Baccc')
];

describe('Directory search', function() {
  it('[user signs up]', function() {
    helper.createUser();
  });

  it('[add users to the directory]', function() {
    directory.get();
    directory.menu.click(2);
    users.forEach(function(user) {
      directory.add(user);
      browser.sleep(500);
    });
  });

  it('should sort users', function() {
    browser.sleep(5000);
    directory.get();
    var domUsers = directory.users.filter(function(el) {
      return el.getAttribute('class').then(function(className) {
        return className.indexOf('separator') < 0;
      });
    });
    users.forEach(function(user, i) {
      expect(domUsers.get(i).getText()).toContain(helper.user.username(user));
      expect(domUsers.get(i).getText()).toContain(user.email);
    });
  });

  it('should return a user when entering his last name', function() {
    users.forEach(function(user) {
      directory.search(user.lastName);
      expect(directory.users.get(1).getText()).toContain(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(user.email);
      header.search(user.lastName);
      expect(header.searchResults.get(0).getText()).toContain(helper.user.username(user));
      expect(header.searchResults.get(0).getText()).toContain(user.email);
    });
  });

  it('should return a user when entering his first name', function() {
    users.forEach(function(user) {
      directory.search(user.firstName);
      expect(directory.users.get(1).getText()).toContain(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(user.email);
      header.search(user.firstName);
      expect(header.searchResults.get(0).getText()).toContain(helper.user.username(user));
      expect(header.searchResults.get(0).getText()).toContain(user.email);
    });
  });

  it('should return a user when entering his user name', function() {
    users.forEach(function(user) {
      directory.search(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(user.email);
      header.search(helper.user.username(user));
      expect(header.searchResults.get(0).getText()).toContain(helper.user.username(user));
      expect(header.searchResults.get(0).getText()).toContain(user.email);
    });
  });

  it('should return a user when entering his email, but not in global search', function() {
    users.forEach(function(user) {
      directory.search(user.email);
      expect(directory.users.get(1).getText()).toContain(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(user.email);
      header.search(user.email);
      // We have no result (2 because we have some decorative blocks)
      expect(header.searchResults.count()).toBe(2);
    });
  });

  it('should be case insensitive', function() {
    users.forEach(function(user) {
      directory.search(user.lastName.toUpperCase());
      expect(directory.users.get(1).getText()).toContain(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(user.email);
      header.search(user.lastName.toUpperCase());
      expect(header.searchResults.get(0).getText()).toContain(helper.user.username(user));
      expect(header.searchResults.get(0).getText()).toContain(user.email);
    });
  });

  it('should be accent insensitive', function() {
    users.forEach(function(user) {
      directory.search(helper.removeDiacritics(user.lastName));
      expect(directory.users.get(1).getText()).toContain(helper.user.username(user));
      expect(directory.users.get(1).getText()).toContain(user.email);
      header.search(helper.removeDiacritics(user.lastName));
      expect(header.searchResults.get(0).getText()).toContain(helper.user.username(user));
      expect(header.searchResults.get(0).getText()).toContain(user.email);
    });
  });

  it('[signs out]', function() {
    header.signOut();
  });
});
