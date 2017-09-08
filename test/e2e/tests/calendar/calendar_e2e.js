'use strict';

var helper = require('../../helper');
var calendar = require('../../pages/CalendarPage')();
var header = require('../../pages/HeaderComponent')();
var days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
var moment = require('moment');
var faker = require('faker');

moment.locale('fr');

describe('Calendar', function() {
  it('user sign up', function() {
    helper.createUser();
  });

  it('the calendar highlights today', function() {
    calendar.get();
    expect(browser.$$('.calendar-week-view-active-cell').count()).toBeGreaterThan(0);
    expect(browser.$$('.calendar-week-view-active-cell').get(0).getText()).toBe(days[new Date().getDay() - 1]);
  });

  it('shows the current week', function() {
    calendar.get();
    var today = moment();
    var currentWeek = today.week();
    var currentYear = today.year();
    expect(browser.getCurrentUrl()).toContain('/u/calendar/year/' + currentYear + '/week/' + currentWeek);
    calendar.displaysCorrectWeekInfo(today);
  });

  it('shows the current month', function() {
    calendar.get();
    calendar.showMonthButton.click();
    var today = moment();
    var currentMonth = today.month();
    var currentYear = today.year();
    expect(browser.getCurrentUrl()).toContain('/u/calendar/year/' + currentYear + '/month/' + currentMonth);
    calendar.displaysCorrectMonthInfo(today);
  });

  it('always shows correct week information', function() {
    for (var i = 0; i < 10; i++) {
      var year = faker.random.number({min: 2000, max: 2030});
      var week = faker.random.number({min: 1, max: moment({year: year}).weeksInYear()});
      calendar.getWeek(year, week);
    }
  });

  it('always shows correct month information', function() {
    for (var i = 0; i < 10; i++) {
      var year = faker.random.number({min: 2000, max: 2030});
      var month = faker.random.number({min: 1, max: 12});
      calendar.getMonth(year, month);
    }
  });

  it('the user can navigate in the week view', function() {
    calendar.get();
    var date = moment();
    calendar.displaysCorrectWeekInfo(date);
    calendar.nextWeek.click();
    date.add(1, 'week');
    calendar.displaysCorrectWeekInfo(date);
    calendar.prevWeek.click();
    calendar.prevWeek.click();
    date.subtract(2, 'week');
    calendar.displaysCorrectWeekInfo(date);
  });

  it('the user can navigate in the month view', function() {
    calendar.get();
    calendar.showMonthButton.click();
    var date = moment();
    calendar.displaysCorrectMonthInfo(date);
    calendar.nextMonth.click();
    date.add(1, 'month');
    calendar.displaysCorrectMonthInfo(date);
    calendar.prevMonth.click();
    calendar.prevMonth.click();
    date.subtract(2, 'month');
    calendar.displaysCorrectMonthInfo(date);
  });

  it('sign out', function() {
    header.signOut();
  });
});
