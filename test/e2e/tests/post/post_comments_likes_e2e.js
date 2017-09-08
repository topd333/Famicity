
'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var PostFormComponent = require('../../pages/PostFormComponent');
var CommentFormComponent = require('../../pages/CommentFormComponent');
var LikeComponent = require('../../pages/LikeComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var like;
var postForm;
var commentForm;

describe('Post comment likes', function() {
  describe('Create a comment', function() {
    it('sign up', function() {
      helper.createUser();
    });

    it('create a post', function() {
      feed.get();
      postForm = new PostFormComponent($('fc-post-add'));
      postForm.initiateCreation();
      var content = faker.lorem.paragraph();
      var title = faker.lorem.sentence().slice(0, 10);
      postForm.write({content: content, title: title});
    });

    it('create a comment', function() {
      commentForm = new CommentFormComponent(feed.posts.get(0).$('.comment'));
      content = faker.lorem.paragraph();
      helper.scrollToBottom();
      commentForm.initiateCreation();
      commentForm.write({content: content});
    });
  });

  describe('The like component is initialized', function() {
    var likeElement = feed.posts.get(0).$$('fc-like').get(0);
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

  it('signs out', function() {
    header.signOut();
  });
});
