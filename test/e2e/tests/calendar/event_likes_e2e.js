'use strict';

var helper = require('../../helper');
var faker = require('faker');
var moment = require('moment');
var feed = require('../../pages/FeedPage')();
var calendar = require('../../pages/CalendarPage')();
var LikeComponent = require('../../pages/LikeComponent');
var header = require('../../pages/HeaderComponent')();
var like;

describe('Event likes', function() {
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

  describe('The like component is initialized', function() {
    var likeElement = feed.events.get(0).$('fc-like');
    like = new LikeComponent(likeElement);

    it('the like button has been created', function() {
      feed.get();
      expect(like.element.isDisplayed()).toBe(true);
    });

    it('there is no \'like\' yet', function() {
      like.hasNoLike();
    });
  });

  describe('Like the event', function() {
    it('click on the heart icon', function() {
      like.like();
      like.hasLikes(1);
    });
  });

  describe('Unlike the event', function() {
    it('click on the heart icon', function() {
      like.unlike();
      like.hasNoLike();
    });
  });

  describe('Visit the list of likes page', function() {
    it('like the event', function() {
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
