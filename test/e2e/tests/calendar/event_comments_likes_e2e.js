
'use strict';

var helper = require('../../helper');
var faker = require('faker');
var moment = require('moment');
var feed = require('../../pages/FeedPage')();
var calendar = require('../../pages/CalendarPage')();
var CommentFormComponent = require('../../pages/CommentFormComponent');
var LikeComponent = require('../../pages/LikeComponent');
var header = require('../../pages/HeaderComponent')();
var content;
var like;
var commentForm;

describe('Event comment likes', function() {
  describe('Create a comment', function() {
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

    it('create a comment', function() {
      feed.get();
      commentForm = new CommentFormComponent(feed.events.get(0).$('.comment'));
      content = faker.lorem.paragraph();
      helper.scrollToBottom();
      commentForm.initiateCreation();
      commentForm.write({content: content});
    });
  });

  describe('The like component is initialized', function() {
    var likeElement = feed.events.get(0).$$('fc-like').get(0);
    like = new LikeComponent(likeElement);

    it('the like button has been created', function() {
      expect(like.element.isDisplayed()).toBe(true);
    });

    it('there is no \'like\' yet', function() {
      like.hasNoLike();
    });
  });

  describe('Like the comment', function() {
    it('click on the heart icon', function() {
      like.like();
      like.hasLikes(1);
    });
  });

  describe('Unlike the comment', function() {
    it('click on the heart icon', function() {
      like.unlike();
      like.hasNoLike();
    });
  });

  describe('Visit the list of likes page', function() {
    it('like the comment', function() {
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
