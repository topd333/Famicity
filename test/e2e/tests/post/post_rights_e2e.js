'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var directory = require('../../pages/DirectoryPage')();
var PostFormComponent = require('../../pages/PostFormComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var title;
var user;
var postForm;
var browser2;
var feed2;
var user2;

var groupName = faker.lorem.sentence().slice(0, 10).trim();

describe('Post rights', function() {
  describe('create users and group', function() {
    it('the two users sign up', function() {
      user = helper.createUser();
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
      var directory = require('../../pages/DirectoryPage')(browser2);
      directory.get();
      browser2.$('.fa-eye').click();
      browser2.$('.directory-item-table-cell-invit-buttons .accept').click();
      helper.hasSuccess(helper.user.username(user) + ' fait maintenant partie de votre groupe "Tous mes proches".', browser2);
    });

    it('the first user creates a group', function() {
      directory.get();
      directory.createGroup(groupName);
    });

    it('and adds the second user to it', function() {
      directory.addUserToGroup(user2);
    });
  });

  describe('create a post with permissions', function() {
    beforeEach(function() {
      postForm = new PostFormComponent($('fc-post-add'));
    });

    afterEach(function() {
      postForm = new PostFormComponent(feed.firstElement);
      postForm.delete();
    });

    it('group permissions', function() {
      // User 1
      feed.get();
      postForm.initiateCreation();
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 49);
      postForm.write({content: content, title: title, permissions: {groups: [groupName]}});

      // User 2
      feed2 = require('../../pages/FeedPage')(browser2);
      feed2.get();
      var post = feed2.firstElement;
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.$('.form-fields .center-text').getText();
      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });

    it('user permissions', function() {
      // User 1
      feed.get();
      postForm.initiateCreation();
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 49);
      postForm.write({content: content, title: title, permissions: {users: [user2]}});

      // User 2
      feed2 = require('../../pages/FeedPage')(browser2);
      feed2.get();
      var post = feed2.firstElement;
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.$('.form-fields .center-text').getText();
      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
    });
  });

  describe('create a post with exclusions', function() {
    beforeEach(function() {
      postForm = new PostFormComponent($('fc-post-add'));
    });

    afterEach(function() {
      postForm = new PostFormComponent(feed.firstElement);
      postForm.delete();
    });

    it('group permissions and user exclusions', function() {
      // User 1
      feed.get();
      postForm.initiateCreation();
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 49);
      postForm.write({
        content: content,
        title: title,
        permissions: {groups: ['Tous mes proches']},
        exclusions: {users: [user2]}
      });

      // User 2
      feed2 = require('../../pages/FeedPage')(browser2);
      feed2.get();
      feed2.hasPost(false);
    });

    it('group permissions and group exclusions', function() {
      // User 1
      feed.get();
      postForm.initiateCreation();
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 49);
      postForm.write({
        content: content,
        title: title,
        permissions: {groups: ['Tous mes proches']},
        exclusions: {groups: [groupName]}
      });

      // User 2
      feed2 = require('../../pages/FeedPage')(browser2);
      feed2.get();
      feed2.hasPost(false);
    });

    it('user permissions and group exclusions', function() {
      // User 1
      feed.get();
      postForm.initiateCreation();
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 49);
      postForm.write({
        content: content,
        title: title,
        permissions: {users: [user2]},
        exclusions: {groups: [groupName]}
      });

      // User 2
      feed2 = require('../../pages/FeedPage')(browser2);
      feed2.get();
      feed2.hasPost(false);

      browser2.quit();
    });
  });

  describe('first user signs out', function() {
    it('signs out', function() {
      header.signOut();
    });
  });
});
