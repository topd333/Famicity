'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var PostFormPage = require('../../pages/PostFormComponent');
var LikeComponent = require('../../pages/LikeComponent');
var header = require('../../pages/HeaderComponent')();
var postForm;
var like;

describe('Post likes', function() {
  describe('Create a post', function() {
    it('sign up', function() {
      helper.createUser();
    });

    it('create a post', function() {
      feed.get();
      postForm = new PostFormPage($('fc-post-add'));
      postForm.initiateCreation();
      var content = faker.lorem.paragraph();
      var title = faker.lorem.sentence().slice(0, 10);
      postForm.write({content: content, title: title});
    });
  });

  describe('The like component is initialized', function() {
    var likeElement = feed.posts.get(0).$('fc-like');
    like = new LikeComponent(likeElement);

    it('the like button has been created', function() {
      expect(like.element.isDisplayed()).toBe(true);
    });

    it('there is no \'like\' yet', function() {
      like.hasNoLike();
    });
  });

  describe('Like the post', function() {
    it('click on the heart icon', function() {
      like.like();
      like.hasLikes(1);
    });
  });

  describe('Unlike the post', function() {
    it('click on the heart icon', function() {
      like.unlike();
      like.hasNoLike();
    });
  });

  describe('Visit the list of likes page', function() {
    it('like the post', function() {
      like.like();
      like.hasLikes(1);
    });

    it('open the page', function() {
      like.link.click();
      like.hasLiked('Vous');
    });
  });

  describe('', function() {
    it('sign out', function() {
      header.signOut();
    });
  });
});
