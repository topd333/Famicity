
'use strict';

var helper = require('../../helper');
var faker = require('faker');
var moment = require('moment');
var feed = require('../../pages/FeedPage')();
var calendar = require('../../pages/CalendarPage')();
var CommentFormComponent = require('../../pages/CommentFormComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var commentForm;

describe('Event comments', function() {
  describe('Create an event', function() {
    it('sign up', function() {
      helper.createUser();
    });

    it('create an event', function() {
      var eventName = faker.lorem.sentence().slice(0, 20);
      var start = moment()
        .year(faker.random.number({min: 1900, max: 2500}))
        .month(faker.random.number({min: 1, max: 12}))
        .day(faker.random.number({min: 1, max: 29}))
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));
      var end = start.clone()
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
      var eventLocation = faker.lorem.sentence().slice(0, 20);
      var reminder = false;
      var description = faker.lorem.paragraph();
      var color = faker.random.array_element([null, 'green', 'blue', 'purple']);

      var ev = {
        name: eventName, start: start, end: end, location: eventLocation, allDay: false,
        reminder: reminder, description: description, color: color
      };

      calendar.get();
      calendar.addEventButton.click();
      calendar.write(ev);
    });
  });

  describe('Create a comment', function() {
    it('the comment form has been created', function() {
      feed.get();
      var commentElement = feed.events.get(0).$('.comment');
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
      var createdComment = new CommentFormComponent(feed.events.get(0).$$('.comment').get(0));
      expect(createdComment.element.isDisplayed()).toBe(true);
      expect(createdComment.htmlContent.getText()).toBe(content.trim().replace(/ +/g, ' '));
    });
  });

  describe('Edit a comment', function() {
    var editedComment;

    beforeEach(function() {
      helper.scrollToBottom();
      editedComment = new CommentFormComponent(feed.events.get(0).$$('.comment').get(0));
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
      var toDeleteComment = new CommentFormComponent(feed.events.get(0).$$('.comment').get(0));
      toDeleteComment.editButton.click();
      toDeleteComment.deleteButton.click();
      $('.popin-dialog .btn-danger').click();
      helper.hasSuccess('Le commentaire a été supprimé avec succès.');
    });

    it('it is not present anymore', function() {
      expect(feed.events.get(0).$$('.comment').count()).toBe(1);
    });
  });

  it('signs out', function() {
    header.signOut();
  });
});
