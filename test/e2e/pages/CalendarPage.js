'use strict';

var moment = require('moment');
var helper = require('../helper');

function CalendarPage(browser) {
  this.browser = browser;
  // Calendar page
  this.currentWeekInfo = this.browser.$('.calendar-week-monthyear');
  this.showMonthButton = this.browser.$('.hidden-xs a[ng-click="viewMonth()"]');
  this.showWeekButton = this.browser.$('.hidden-xs a[ng-click="viewWeek()"]');
  this.prevWeek = this.browser.$('.hidden-xs a[ng-click="prevWeek()"]');
  this.nextWeek = this.browser.$('.hidden-xs a[ng-click="nextWeek()"]');
  this.prevMonth = this.browser.$('.hidden-xs a[ng-click="prevMonth()"]');
  this.nextMonth = this.browser.$('.hidden-xs a[ng-click="nextMonth()"]');
  this.addEventButton = this.browser.$('.hidden-xs a[ng-click="createEvent()"]');
  // Week view
  this.weekDayEvents = this.browser.element.all(by.repeater('dayEvents in weekEvents'));
  this.weekAllDayEvents = this.browser.element(by.repeater('e in allDays'));
  // Month view
  this.weeks = this.browser.element.all(by.repeater('days in daysWeek'));
  // Event form
  this.name = this.browser.element(by.model('formData.event.name'));
  this.location = this.browser.element(by.model('formData.event.location'));
  this.startDate = this.browser.element(by.model('formData.event.start_date'));
  this.startHour = this.browser.element(by.model('formData.event.start_hour'));
  this.endDate = this.browser.element(by.model('formData.event.end_date'));
  this.endHour = this.browser.element(by.model('formData.event.end_hour'));
  this.allDay = this.browser.$('label[for="all_day"]');
  this.description = this.browser.element(by.model('formData.event.description'));
  this.colorSelector = this.browser.$('.create-event-color-selector');
  // this.reminder = this.browser.element(by.model('formData.event.reminder_email'));
  this.validateButton = this.browser.$('button[data-fc-form-submit]');
  this.showPermissions = this.browser.$('a[ng-click="showPermission()"]');
  this.showAlbums = this.browser.$('a[ng-click="showFormContent(\'album\')"]');
  // Event left block
  this.leftBlockDetails = this.browser.$('.event-details-left-column');
  this.leftBlock = {
    name: this.leftBlockDetails.element(by.binding('event.name')),
    location: this.leftBlockDetails.element(by.binding('event.location')),
    start: this.leftBlockDetails.$('div[ng-if="event.start_date != 0"]'),
    end: this.leftBlockDetails.$('div[ng-if="event.end_date != 0"]'),
    description: this.leftBlockDetails.element(by.binding('event.description'))
  };
}

CalendarPage.prototype.get = function() {
  var header = require('./HeaderComponent')(this.browser);
  return header.get('calendar');
};

CalendarPage.prototype.displaysCorrectWeekInfo = function(moment) {
  var monday = moment.clone().weekday(0);
  var sunday = moment.clone().weekday(6);
  expect(this.currentWeekInfo.getText()).toBe(monday.format('D MMMM') + ' - ' + sunday.format('D MMMM YYYY'));
};

CalendarPage.prototype.getWeek = function(year, week) {
  this.browser.get('/u/calendar/year/' + year + '/week/' + week);
  var day = moment().year(year).week(week);
  this.displaysCorrectWeekInfo(day);
};

CalendarPage.prototype.displaysCorrectMonthInfo = function(moment) {
  expect(this.currentWeekInfo.getText()).toBe(helper.capitalize(moment.format('MMMM YYYY')));
};

CalendarPage.prototype.getMonth = function(year, month) {
  this.browser.get('/u/calendar/year/' + year + '/month/' + month);
  var day = moment().year(year).month(month);
  this.displaysCorrectMonthInfo(day);
};

CalendarPage.prototype.tryWrite = function(event) {
  event.name &&
  this.name.sendKeys(event.name);
  event.location &&
  this.location.sendKeys(event.location);
  event.description &&
  this.description.sendKeys(event.description);
  event.allDay &&
  this.allDay.click();
  if (event.start) {
    this.startDate.sendKeys(helper.dateFr(event.start.toDate()));
    !event.allDay && this.startHour.sendKeys(event.start.format('HH:mm'));
  }
  if (event.end) {
    this.endDate.clear().sendKeys(helper.dateFr(event.end.toDate()));
    !event.allDay && this.endHour.clear().sendKeys(event.end.format('HH:mm'));
  }
  if (event.permissions || event.exclusions) {
    var permissions = require('./OldPermissionsPage')();
    if (event.permissions) {
      this.showPermissions.click();
      this.browser.$('a[ng-click="addPermission()"]').click();
      permissions.addPermissions(event.permissions);
    }
    if (event.exclusions) {
      this.showPermissions.click();
      this.browser.$('a[ng-click="addExclusion()"]').click();
      permissions.addPermissions(event.exclusions);
    }
  }
  event.color && event.color === 'green' && this.colorSelector.$('.create-event-color-selector-green').click();
  event.color && event.color === 'blue' && this.colorSelector.$('.create-event-color-selector-blue').click();
  event.color && event.color === 'purple' && this.colorSelector.$('.create-event-color-selector-purple').click();
};

CalendarPage.prototype.validateLeftBlock = function(event) {
  if (event.start.weekday() !== event.end.weekday()) {
    event.allDay = true;
  }
  event.name &&
  expect(this.leftBlock.name.getText()).toBe(event.name.trim().replace(/ +/g, ' '));
  event.location &&
  expect(this.leftBlock.location.getText()).toBe(event.location.trim().replace(/ +/g, ' '));
  event.description &&
  expect(this.leftBlock.description.getText()).toBe(event.description.trim().replace(/ +/g, ' '));
  if (event.start) {
    !event.allDay &&
    expect(this.leftBlock.start.getText()).toContain('Le ' + event.start.format('dddd') + ' ' + event.start.format('LL') + ' à ' + event.start.format('HH:mm'));
    event.allDay &&
    expect(this.leftBlock.start.getText()).toContain('Le ' + event.start.format('dddd') + ' ' + event.start.format('LL'));
  }
  if (event.end) {
    !event.allDay &&
    expect(this.leftBlock.end.getText()).toContain('Le ' + event.end.format('dddd') + ' ' + event.end.format('LL') + ' à ' + event.end.format('HH:mm'));
    event.allDay &&
    expect(this.leftBlock.end.getText()).toContain('Le ' + event.end.format('dddd') + ' ' + event.end.format('LL'));
  }
};

CalendarPage.prototype.validateInvitationLeftBlock = function(yes, maybe, no, waiting) {
  yes && expect(this.browser.$('a[ng-if="event.attend_count"] .pull-right').getText()).toBe(yes.toString());
  !yes && expect(this.browser.$('a[ng-if="event.attend_count == 0"] .pull-right').getText()).toBe('0');
  maybe && expect(this.browser.$('a[ng-if="event.maybe_count"] .pull-right').getText()).toBe(maybe.toString());
  !maybe && expect(this.browser.$('a[ng-if="event.maybe_count == 0"] .pull-right').getText()).toBe('0');
  no && expect(this.browser.$('a[ng-if="event.decline_count"] .pull-right').getText()).toBe(no.toString());
  !no && expect(this.browser.$('a[ng-if="event.decline_count == 0"] .pull-right').getText()).toBe('0');
  waiting && expect(this.browser.$('a[ng-if="event.no_answer_count"] .pull-right').getText()).toBe(waiting.toString());
  !waiting && expect(this.browser.$('a[ng-if="event.no_answer_count == 0"] .pull-right').getText()).toBe('0');
};

CalendarPage.prototype.validateFeedEvent = function(event, el) {
  if (event.start.weekday() !== event.end.weekday()) {
    event.allDay = true;
  }
  var feedEvent = {
    name: el.$('div[ng-if="::object.name"]'),
    location: el.$('div[ng-if="::object.location"]'),
    start: el.$('div[ng-if="::object.start_date != 0"]'),
    end: el.$('div[ng-if="::object.end_date != 0"]'),
    description: el.$('div[ng-if="::object.description"]')
  };
  event.name &&
  expect(feedEvent.name.getText()).toContain(event.name.trim().replace(/ +/g, ' '));
  event.location &&
  expect(feedEvent.location.getText()).toContain(event.location.trim().replace(/ +/g, ' '));
  event.description &&
  expect(feedEvent.description.getText()).toContain(event.description.trim().replace(/ +/g, ' '));
  if (event.start) {
    !event.allDay &&
    expect(feedEvent.start.getText()).toContain('Le ' + event.start.format('dddd') + ' ' + event.start.format('LL') + ' à ' + event.start.format('HH:mm'));
    !event.allDay &&
    expect(feedEvent.start.getText()).toContain('Le ' + event.start.format('dddd') + ' ' + event.start.format('LL'));
  }
  if (event.end) {
    !event.allDay &&
    expect(feedEvent.end.getText()).toContain('Le ' + event.end.format('dddd') + ' ' + event.end.format('LL') + ' à ' + event.end.format('HH:mm'));
    event.allDay &&
    expect(feedEvent.end.getText()).toContain('Le ' + event.end.format('dddd') + ' ' + event.end.format('LL'));
  }
};

CalendarPage.prototype.validateCalendarWeekEvent = function(event) {
  if (event.start.weekday() !== event.end.weekday()) {
    event.allDay = true;
  }
  var weekDay = event.start.weekday();
  var el;
  var duration;
  if (!event.allDay) {
    duration = event.end.diff(event.start, 'minutes') / 60;
    var index_hour = ((event.start.hour() * 60 + event.start.minute()) / 60).toFixed(2);
    var top = parseFloat(index_hour * 4.17).toFixed(2);
    var height = parseFloat(duration * 4.17).toFixed(2);
    var eventWeek = this.weekDayEvents.get(weekDay);
    el = eventWeek.$('.week-event');
    expect(el.isDisplayed()).toBe(true);
    // parseFloat removes trailing 0
    expect(el.getAttribute('style')).toContain('height: ' + parseFloat(height) + '%');
    expect(el.getAttribute('style')).toContain('top: ' + parseFloat(top) + '%');
    expect(el.getText()).toContain(event.start.format('HH:mm'));
  } else {
    var remainingDuration = event.end.dayOfYear() - event.start.dayOfYear() + 1;
    var currentWeekDay = event.start.weekday();
    var currentDay = event.start.dayOfYear();
    while (remainingDuration > 0) {
      duration = 7 - currentWeekDay <= remainingDuration ? 7 - currentWeekDay : remainingDuration;
      console.log('\t  ' + 'remaining: ' + remainingDuration + ', duration: ' + duration + ', currentDay: ' + currentDay + ', currentWeekDay: ' + currentWeekDay);
      remainingDuration -= duration;
      currentDay += duration;
      el = this.weekAllDayEvents.$('.week-event-allday:not(week-event-birthday)');
      var left = parseFloat(currentWeekDay * 14.3).toFixed(1);
      var width = parseFloat(duration * 14.3).toFixed(1);
      currentWeekDay !== 0 && expect(el.getAttribute('style')).toContain('left: ' + left + '%');
      currentWeekDay === 0 && expect(el.getAttribute('style')).not.toContain('left');
      expect(el.getAttribute('style')).toContain('width: ' + width + '%');
      currentWeekDay = 0;
      remainingDuration && this.nextWeek.click();
    }
    // this.browser.sleep(10000);
  }
  expect(el.getText()).toContain(event.name.trim().replace(/ +/g, ' '));
  !event.color || event.color === 'blue' && expect(el.getCssValue('background-color')).toBe('rgba(193, 228, 247, 1)');
  event.color && event.color === 'green' && expect(el.getCssValue('background-color')).toBe('rgba(219, 235, 173, 1)');
  event.color && event.color === 'purple' && expect(el.getCssValue('background-color')).toBe('rgba(200, 173, 208, 1)');
};

CalendarPage.prototype.validateCalendarMonthEvent = function(event) {
  if (event.start.weekday() !== event.end.weekday()) {
    event.allDay = true;
  }
  var week = event.start.week() - event.start.clone().startOf('month').startOf('week').week() + 1;
  var weekDay = event.start.weekday();

  var el;
  var position;
  var eventWeek;
  if (!event.allDay) {
    position = weekDay === 0 ? 0 : 1;
    eventWeek = this.weeks.get(week - 1);
    el = eventWeek.all(by.repeater('e in line')).get(position);
    expect(el.isDisplayed()).toBe(true);
    // parseFloat removes trailing 0
    expect(el.getAttribute('colspan')).toBe('1');
    expect(el.getAttribute('padding')).toBe(weekDay.toString());
    expect(el.getText()).toContain(event.start.format('HH:mm'));
    expect(el.getText()).toContain(event.name.trim().replace(/ +/g, ' '));
  } else {
    var duration;
    var remainingDuration = event.end.dayOfYear() - event.start.dayOfYear() + 1;
    var currentWeekDay = event.start.weekday();
    var currentDay = event.start.dayOfYear();
    while (remainingDuration > 0) {
      position = currentWeekDay === 0 ? 0 : 1;
      eventWeek = this.weeks.get(week - 1);
      duration = 7 - currentWeekDay <= remainingDuration ? 7 - currentWeekDay : remainingDuration;
      console.log('\t  ' + 'week in month: ' + week + ', remaining: ' + remainingDuration + ', duration: ' + duration + ', currentDay: ' + currentDay + ', currentWeekDay: ' + currentWeekDay);
      remainingDuration -= duration;
      currentDay += duration;

      el = eventWeek.all(by.repeater('e in line')).get(position);
      expect(el.isDisplayed()).toBe(true);
      // parseFloat removes trailing 0
      expect(el.getAttribute('colspan')).toBe(duration.toString());
      expect(el.getAttribute('padding')).toBe(weekDay.toString());
      expect(el.getText()).toContain(event.name.trim().replace(/ +/g, ' '));
      currentWeekDay = 0;
      week++;
      // Change month if necessary
      var nextMonth = event.start.clone().week(week).weekday(6).month();
      if (nextMonth !== event.start.month()) {
        this.nextMonth.click();
      }
      // !event.color || event.color === 'blue' && expect(el.getCssValue('background-color')).toBe('rgba(193, 228, 247, 1)');
      // event.color && event.color === 'green'  && expect(el.getCssValue('background-color')).toBe('rgba(219, 235, 173, 1)');
      // event.color && event.color === 'purple'  && expect(el.getCssValue('background-color')).toBe('rgba(200, 173, 208, 1)');
    }
    // this.browser.sleep(10000);
  }
};

CalendarPage.prototype.write = function(event) {
  var self = this;
  this.tryWrite(event);
  this.validateButton.click();
  if (!event.permissions) {
    self.browser.$('.popin-dialog .btn-secondary').click();
  }
  helper.hasSuccess('L\'événement a été créé avec succès.', this.browser);
  expect(this.browser.getCurrentUrl()).toMatch(/\/events\/\d+/);
  this.validateLeftBlock(event);
};

module.exports = function(customBrowser) {
  return new CalendarPage(customBrowser || browser);
};
