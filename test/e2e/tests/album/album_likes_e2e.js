'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var albumPage = require('../../pages/AlbumPage')();
var LikeComponent = require('../../pages/LikeComponent');
var header = require('../../pages/HeaderComponent')();
var like;

describe('Album likes', function() {
  describe('Create an album', function() {
    it('sign up', function() {
      helper.createUser();
    });

    it('create an album', function() {
      albumPage.get();
      albumPage.initiateCreation();
      var title = faker.lorem.sentence().slice(0, 49);
      var description = faker.lorem.paragraph();
      albumPage.createAlbum({title: title, description: description, pictures: 1});
    });
  });

  describe('The like component is initialized', function() {
    var likeElement = feed.albums.get(0).$('fc-like');
    like = new LikeComponent(likeElement);

    it('the like button has been created', function() {
      feed.get();
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
