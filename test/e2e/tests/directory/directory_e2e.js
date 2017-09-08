'use strict';

var helper = require('./../../helper');
var directory = require('./../../pages/DirectoryPage')();
var faker = require('faker');

describe('Directory', function() {
  var groupId;
  var user2;
  var browser2;

  it('user signs up', function() {
    helper.createUser();
  });

  it('visits his directory page', function() {
    directory.get();
  });

  it('creates a group', function() {
    directory.createGroup('TEST').then(function(id) {
      groupId = id;
    });
  });

  it('updates his group name', function() {
    directory.renameGroup({id: groupId, name: 'TEST'}, 'TEST2');
  });

  it('deletes his group', function() {
    directory.deleteGroup('TEST2');
  });

  describe('Add a user to a group', function() {
    var groupName = faker.lorem.sentence().slice(0, 10).trim();

    it('the two users sign up', function() {
      browser2 = browser.forkNewDriverInstance();
      helper.setTestCookie(browser2);
      user2 = helper.createUser(null, browser2);
    });

    it('the first user invites the second one', function() {
      directory.get();
      directory.menu.click(2);
      directory.invite(user2.firstName, user2.lastName, user2.email);
    });

    it('the second user accepts the invitation', function() {
      var directory = require('./../../pages/DirectoryPage')(browser2);
      directory.get();
      browser2.$('.fa-eye').click();
      browser2.$('.directory-item-table-cell-invit-buttons .accept').click();
    });

    it('the first user creates a group', function() {
      directory.get();
      directory.createGroup(groupName).then(function(id) {
        groupId = id;
      });
    });

    it('and adds the second user to it', function() {
      directory.addUserToGroup(user2);
    });
  });

  xdescribe('Remove a user from a group', function() {
    it('visit the group page', function() {
      directory.get();
      browser.get('/u/directory/groups/' + groupId);
    });
  });

  it('starts contact import', function() {
    directory.get();
    directory.menu.click(1);
    $('.button-import-gmail').click();
    expect(browser.getCurrentUrl()).toMatch(/\/u\/directory\/import\/external/);
    helper.selectWindow(1);
    browser.close().then(function() {
      helper.selectWindow(0);
    });
  });

  it('signs out', function() {
    browser2.quit();
    var header = require('./../../pages/HeaderComponent')();
    header.signOut();
  });
});
