'use strict';

var helper = require('../../helper');
var calendar = require('../../pages/CalendarPage')();
var header = require('../../pages/HeaderComponent')();
var directory = require('../../pages/DirectoryPage')();
var moment = require('moment');
var faker = require('faker');
var user;
var user2;
var browser2;
var feed2;
var calendar2;
var ev;

moment.locale('fr');
var groupName = faker.lorem.sentence().slice(0, 10).trim();

describe('Event invitations', function() {
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

  xdescribe('create an event with invitations', function() {
    beforeEach(function() {
      feed2 = require('../../pages/FeedPage')(browser2);
      calendar2 = require('../../pages/CalendarPage')(browser2);

      var eventName = faker.lorem.sentence().slice(0, 20);
      var start = moment()
        .year(faker.random.number({min: moment().year() + 1, max: 2500}))
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

      var permissions = {users: [user2]};

      ev = {
        name: eventName, start: start, end: end, location: eventLocation, allDay: false,
        reminder: reminder, description: description, color: color, permissions: permissions
      };
    });

    it('the invitation block is displayed on the feed', function() {
      calendar.get();
      calendar.addEventButton.click();
      calendar.write(ev);

      feed2.get();
      expect(feed2.events.get(0).$('.f-block-content-type3.hidden-xs').isDisplayed()).toBe(true);
    });

    it('there is no invitation block for an old event', function() {

      ev.start.year(faker.random.number({min: 1900, max: 2014}));

      calendar.get();
      calendar.addEventButton.click();
      calendar.write(ev);

      feed2.get();
      expect(feed2.events.get(0).$('.f-block-content-type3.hidden-xs').isDisplayed()).toBe(false);
    });
  });

  describe('provide an answer to an invitation', function() {
    it('create an event with permissions', function() {
      feed2 = require('../../pages/FeedPage')(browser2);
      calendar2 = require('../../pages/CalendarPage')(browser2);

      var eventName = faker.lorem.sentence().slice(0, 20);
      var start = moment()
        .year(faker.random.number({min: moment().year() + 1, max: 2500}))
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

      var permissions = {users: [user2]};

      ev = {
        name: eventName, start: start, end: end, location: eventLocation, allDay: false,
        reminder: reminder, description: description, color: color, permissions: permissions
      };

      calendar.get();
      calendar.addEventButton.click();
      calendar.write(ev);
      calendar.validateInvitationLeftBlock(0, 0, 0, 1);
    });

    it('accept the invitation', function() {
      feed2.get();
      feed2.events.get(0).$('.f-block-content-type3.hidden-xs .btn-primary.green-button').click();
      helper.hasSuccess('Votre réponse a bien été prise en compte', browser2);
      browser.refresh();
      calendar.validateInvitationLeftBlock(1, 0, 0, 0);
    });

    it('change the answser: maybe', function() {
      feed2.events.get(0).$('.f-block-content-type3.hidden-xs .btn-primary').click();
      browser2.$('a[ng-click="eventAnswer(\'maybe\'); $close()"]').click();
      helper.hasSuccess('Votre réponse a bien été prise en compte', browser2);
      browser.refresh();
      calendar.validateInvitationLeftBlock(0, 1, 0, 0);
    });

    it('change the answser: no', function() {
      feed2.events.get(0).$('.f-block-content-type3.hidden-xs .btn-primary').click();
      browser2.$('a[ng-click="eventAnswer(\'no\'); $close()"]').click();
      helper.hasSuccess('Votre réponse a bien été prise en compte', browser2);
      browser.refresh();
      calendar.validateInvitationLeftBlock(0, 0, 1, 0);
    });

    it('change the answser: yes', function() {
      feed2.events.get(0).$('.f-block-content-type3.hidden-xs .btn-primary').click();
      browser2.$('a[ng-click="eventAnswer(\'yes\'); $close()"]').click();
      helper.hasSuccess('Votre réponse a bien été prise en compte', browser2);
      browser.refresh();
      calendar.validateInvitationLeftBlock(1, 0, 0, 0);

    });
  });

  it('sign out', function() {
    header.signOut();
    browser2.quit();
  });
});
