
'use strict';

var helper = require('../../helper');
var faker = require('faker');
var feed = require('../../pages/FeedPage')();
var albumPage = require('../../pages/AlbumPage')();
var CommentFormComponent = require('../../pages/CommentFormComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var commentForm;

describe('Album comments', function() {
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

  describe('Create a comment', function() {
    it('the comment form has been created', function() {
      feed.get();
      var commentElement = feed.albums.get(0).$('.comment');
      expect(commentElement.isDisplayed()).toBe(true);
      commentForm = new CommentFormComponent(commentElement);
    });

    it('clicking on it initiates comment creation', function() {
      commentForm.initiateCreation();
    });

    it('content size expands when typing long text', function() {
      commentForm.content.getSize().then(function(size) {
        var height = size.height;
        commentForm.fillForm({content: '\n\n\n\n\n\n'});
        commentForm.content.getSize().then(function(expendedSize) {
          expect(expendedSize.height).toBeGreaterThan(height);
        });
      });
    });

    it('create a comment', function() {
      helper.scrollToBottom();
      content = faker.lorem.paragraph();
      commentForm.write({content: content});
    });

    it('the comment has been created, visible and has correct value', function() {
      var createdComment = new CommentFormComponent(feed.albums.get(0).$$('.comment').get(0));
      expect(createdComment.element.isDisplayed()).toBe(true);
      expect(createdComment.htmlContent.getText()).toBe(content.trim().replace(/ +/g, ' '));
    });
  });

  describe('Edit a comment', function() {
    var editedComment;

    beforeEach(function() {
      helper.scrollToBottom();
      editedComment = new CommentFormComponent(feed.albums.get(0).$$('.comment').get(0));
      editedComment.editButton.click();
    });

    it('with standard content', function() {
      content = faker.lorem.paragraph();
      editedComment.write({content: content}, true);
      expect(editedComment.htmlContent.getText()).toBe(content.trim().replace(/ +/g, ' '));
    });

    it('with funky content', function() {
      content = '?,;.\n":/!/<\\$€@\'éèêë<p></p>à âä<ôö\nîï&ù û&nbsp;ü';
      editedComment.write({content: content}, true);
      expect(editedComment.htmlContent.getText()).toBe(content.trim().replace(/ +/g, ' '));
    });

    it('with javascript content', function() {
      content = '<script>alert(\'test\');</script>';
      editedComment.write({content: content}, true);
      expect(editedComment.htmlContent.getText()).toBe(content.trim().replace(/ +/g, ' '));
    });
  });

  describe('Delete a comment', function() {
    it('delete the comment', function() {
      helper.scrollToBottom();
      var toDeleteComment = new CommentFormComponent(feed.albums.get(0).$$('.comment').get(0));
      toDeleteComment.editButton.click();
      toDeleteComment.deleteButton.click();
      $('.popin-dialog .btn-danger').click();
      helper.hasSuccess('Le commentaire a été supprimé avec succès.');
    });

    it('it is not present anymore', function() {
      browser.sleep(500).then(function() {
        expect(feed.albums.get(0).$$('.comment').count()).toBe(1);
      });
    });
  });

  it('signs out', function() {
    header.signOut();
  });
});
