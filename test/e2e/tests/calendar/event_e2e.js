'use strict';

var helper = require('../../helper');
var calendar = require('../../pages/CalendarPage')();
var header = require('../../pages/HeaderComponent')();
var feed = require('../../pages/FeedPage')();
var moment = require('moment');
var faker = require('faker');

moment.locale('fr');

describe('Event', function() {

  it('user sign up', function() {
    helper.createUser();
  });

  describe('create an event from the + button', function() {
    var ev;
    var allDay;
    var start;
    var end;
    var eventName;
    var eventLocation;
    var reminder;
    var description;
    var color;

    afterEach(function() {
      console.log('\n\t' + start.format('dddd') + ' ' + start.format('LLL') + ' - ' + end.format('dddd') + ' ' + end.format('LLL'));

      eventName = faker.lorem.sentence().slice(0, 20);
      eventLocation = faker.lorem.sentence().slice(0, 20);
      reminder = faker.random.array_element([true, false]);
      description = faker.lorem.paragraph();
      color = faker.random.array_element([null, 'green', 'blue', 'purple']);

      ev = {
        start: start, end: end, allDay: allDay,
        name: eventName, location: eventLocation,
        reminder: reminder, description: description, color: color
      };

      calendar.get();
      calendar.addEventButton.click();
      calendar.write(ev);
      feed.get();
      calendar.validateFeedEvent(ev, feed.events.get(0));
      calendar.getWeek(start.year(), start.week());
      calendar.validateCalendarWeekEvent(ev);
      calendar.getMonth(start.year(), start.month());
      calendar.validateCalendarMonthEvent(ev);
    });

    it('simple event', function() {
      allDay = false;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(faker.random.number({min: 1, max: 12}))
        .day(faker.random.number({min: 1, max: 29}))
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));

      end = start.clone()
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
    });

    xit('all day event', function() {
      allDay = true;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(faker.random.number({min: 1, max: 12}))
        .day(faker.random.number({min: 1, max: 29}));

      end = start.clone();
    });

    xit('a simple event on more than 1 day becomes an all day event', function() {
      allDay = false;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(faker.random.number({min: 1, max: 12}))
        .day(faker.random.number({min: 1, max: 29}))
        .weekday(faker.random.number({min: 0, max: 5}))
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));

      end = start.clone()
        .add(faker.random.number({min: 1, max: 6 - start.weekday()}), 'day')
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
    });

    xit('and event can overlap on two weeks', function() {
      allDay = true;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(faker.random.number({min: 1, max: 12}))
        .day(faker.random.number({min: 1, max: 15}))
        .weekday(6)
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));

      end = start.clone()
        .add(faker.random.number({min: 1, max: 6}), 'day')
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
    });

    xit('and event can overlap on several weeks', function() {
      allDay = true;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(faker.random.number({min: 1, max: 12}))
        .day(faker.random.number({min: 1, max: 7}))
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));

      end = start.clone()
        .add(2, 'week')
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
    });

    xit('and event can overlap on two months', function() {
      allDay = true;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(faker.random.number({min: 1, max: 11}))
        .day(faker.random.number({min: 28, max: 31}))
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));

      end = start.clone()
        .add(faker.random.number({min: 4, max: 8}), 'days')
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
    });

    xit('and event can overlap on two years', function() {
      allDay = true;

      start = moment()
        .year(faker.random.number({min: 1900, max: 2020}))
        .month(12)
        .day(faker.random.number({min: 29, max: 31}))
        .hour(faker.random.number({min: 0, max: 12}))
        .minutes(faker.random.number({min: 0, max: 59}));

      end = start.clone()
        .add(faker.random.number({min: 3, max: 6}), 'days')
        .hour(faker.random.number({min: 13, max: 23}))
        .minutes(faker.random.number({min: 0, max: 59}));
    });
  });

  it('sign out', function() {
    header.signOut();
  });
});
