'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var PostFormComponent = require('../../pages/PostFormComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var title;
var invitedUser;
var user;
var postForm;
var browser2;
var home2;
var feed2;

describe('Post email rights', function() {
  describe('the first user', function() {
    it('signs up', function() {
      user = helper.createUser();
    });

    it('creates a post with an email permission', function() {
      feed.get();
      postForm = new PostFormComponent($('fc-post-add'));
      postForm.initiateCreation();
      invitedUser = helper.user.generate('post_rights');
      content = faker.lorem.paragraph();
      title = faker.lorem.sentence().slice(0, 10);

      postForm.write({content: content, title: title, permissions: {emails: [invitedUser.email]}});
    });

    it('the invitation has been sent', function() {
      var directory = require('./../../pages/DirectoryPage')();
      directory.hasBeenInvited(invitedUser, {checkName: false});
    });
  });

  describe('the second user', function() {
    it('the other user registers', function() {
      browser2 = browser.forkNewDriverInstance();
      expect(browser2).not.toEqual(browser);
      helper.setTestCookie(browser2);
      home2 = require('./../../pages/HomePage')(browser2);
      home2.signUp(invitedUser.email, invitedUser.password);
    });

    it('can fill the wizard, and accept the invitation', function() {
      var wizard2 = require('./../../pages/WizardPage')(browser2);
      wizard2.goThrough(invitedUser, {acceptAll: true, inviter: user});
    });

    it('has access the the post created by the first user', function() {
      feed2 = require('./../../pages/FeedPage')(browser2);
      feed2.get();
      feed2.hasPost(true);

      var post = browser2.$('div[object="post"]');
      // #12962
      expect(post.isDisplayed()).toBe(true);
      var contentText = post.all(by.binding('model.htmlValue | trustedHtml')).get(0).getText();
      var titleText = post.$('.form-fields .center-text').getText();

      expect(contentText).toBe(content.trim().replace(/ +/g, ' '));
      expect(titleText).toBe(title.trim().replace(/ +/g, ' '));
      browser2.quit();
    });
  });

  describe('first user signs out', function() {
    it('signs out', function() {
      header.signOut();
    });
  });
});
