angular.module('famicity').factory('calendarManager', function($injector, sessionManager, $translate, $moment) {
    'use strict';
    const log = debug('fc-calendar-manager');

    let currentMonth;
    let dayIndex = null;
    let isMobile = null;
    let mom = $moment();
    let calendarManager = {};

    /**
     * configure moment object locales
     */
    calendarManager.initMoment = function() {
      if ($moment.locale() === 'en') {
        $moment.locale('en', {
          week: {
            dow: sessionManager.getFirstDay() ? parseInt(sessionManager.getFirstDay(), 10) : 0,
            doy: 4
          }
        });
      } else if ($moment.locale() === 'fr') {
        $moment.locale('fr', {
          week: {
            dow: sessionManager.getFirstDay() ? parseInt(sessionManager.getFirstDay(), 10) : 1,
            doy: 4
          }
        });
      }
    };

    /**
     * set currently viewed date
     */
    calendarManager.setMoment = function(data) {
      isMobile = data.isMobile;
      if (!data) {
        mom = $moment();
      } else if (data.week) {
        mom = $moment().year(data.year).week(data.week);
        if (data.day) {
          dayIndex = data.day;
        }
      } else if (data.month) {
        mom = $moment().year(data.year).month(parseInt(data.month, 10));
      }
      log('-------------------------');
      log('viewed date: %o', mom.format('LL'));
      log('current date is shown: %o', this.isWithinRange());
    };

    calendarManager.setDefaultValue = function(scope) {
      scope.isMobileView = isMobile;
      scope.currentWeek = scope.calendarTemplate === 'week' ? mom.week() : $moment().week();
      scope.currentDate = $moment().date();
      scope.currentMonth = scope.calendarTemplate === 'month' ? mom.month() : $moment().month();
      // mom.year() === $moment().year() && mom.week() === $moment().week() ? $moment().weekday() : null;
      scope.currentDayIndex = this.getCurrentDayIndex();
      scope.currentYear = mom.year();
      scope.currentDayUnix =
        dayIndex !== null ? $moment().year(mom.year()).week(mom.week()).day(parseInt(dayIndex, 10) + 1).format('X') : null;
      scope.isCurrentWeek = this.isCurrentWeek();
      scope.isCurrentMonth = this.isCurrentMonth(scope.currentMonth);
      if (scope.calendarTemplate === 'month') {
        currentMonth = $moment().month();
      } else {
        const timestampWeekInterval = this.getTimeStampIntervalWeek();
        scope.beginWeekDay = timestampWeekInterval.begin;
        scope.endWeekDay = timestampWeekInterval.end;
        scope.daysWeek = this.setDaysWeek();
      }
    };

    calendarManager.getCurrentDate = function(scope) {
      const index = this.getCurrentDayIndex();
      let currentDate;
      if (scope.isCurrentWeek === true) {
        currentDate = {
          dayUnix: $moment().format('X'),
          day: $moment().forServer(),
          dayIndex: index
        };
      } else {
        currentDate = {
          dayUnix: $moment().year(mom.year()).week(mom.week()).day(1).format('X'),
          day: $moment().year(mom.year()).week(mom.week()).day(1).forServer(),
          dayIndex: index
        };
      }
      return currentDate;
    };

    calendarManager.updateValue = function(scope, view) {
      scope.currentWeek = view === 'week' ? mom.week() : $moment().week();
      scope.currentMonth = mom.month();
      scope.currentYear = mom.year();
      scope.isCurrentWeek = this.isCurrentWeek();
      scope.isCurrentMonth = this.isCurrentMonth(scope.currentMonth);
      if (scope.calendarTemplate === 'month') {
        currentMonth = scope.currentMonth;
      }
    };

    /**
     * update displayed moment
     */
    calendarManager.updateMoment = function(year, month, week) {
      mom = mom.year(year).month(month).week(week);
    };

    calendarManager.setDaysWeek = function(week) {
      let countOtherMonth;
      let currentDay;
      let currentMonth;
      const date = [];
      let entry;
      let i = 0;
      let _i;
      let _len;
      countOtherMonth = 0;
      if (angular.isDefined(week)) {
        currentDay = week.weekday(0);
      } else {
        currentDay = angular.copy(mom.weekday(0));
      }
      currentMonth = currentDay.month();
      while (i < 7) {
        if (currentDay.month() === currentMonth) {
          countOtherMonth += 1;
          date.push({
            day: currentDay.date(),
            isOtherMonth: false,
            month: currentDay.month(),
            week: currentDay.week(),
            year: currentDay.year()
          });
        } else {
          date.push({
            day: currentDay.date(),
            isOtherMonth: true,
            month: currentDay.month(),
            week: currentDay.week(),
            year: currentDay.year()
          });
        }
        currentDay.add(1, 'day');
        i++;
      }
      if (countOtherMonth > 3) {
        for (_i = 0, _len = date.length; _i < _len; _i++) {
          entry = date[_i];
          entry.isOtherMonth = !entry.isOtherMonth;
        }
      }
      return date;
    };

    calendarManager.setDaysMonth = function() {
      let beginWeek;
      const date = [];
      let i = 0;
      let numberOfweek;
      let tempStartOfMonth;
      numberOfweek = this.getNumberOfWeek();
      tempStartOfMonth = mom.startOf('month');
      beginWeek = $moment().year(tempStartOfMonth.year()).week(tempStartOfMonth.week());
      while (i < numberOfweek) {
        date.push(this.setDaysWeek($moment(beginWeek)));
        beginWeek.add(1, 'week');
        i++;
      }
      return date;
    };

    /**
     * return the begining and the end of the current viewed 'month'
     * begin and end can extend beyond current month,
     */
    calendarManager.getIntervalMonth = function() {
      const begin = $moment(mom).startOf('month').startOf('week');
      const end = $moment(mom).endOf('month').endOf('week');
      return {begin, end};
    };

    /**
     * return timestamp begin and end of current week
     */
    calendarManager.getTimeStampIntervalWeek = function() {
      return {
        begin: mom.weekday(0).valueOf(),
        end: mom.weekday(6).valueOf()
      };
    };

    /**
     * return events of the week
     */
    calendarManager.getEventWeek = function(scope, user_id) {
      let beginWeek;
      let endWeek;
      const EventResourceService = $injector.get('EventResourceService');
      const timezone = jstz.determine();
      this.eventService = new EventResourceService();
      if (mom !== null) {
        beginWeek = mom.weekday(0).forServer();
        endWeek = mom.weekday(6).forServer();
      }
      return this.eventService.indexEvent(user_id, 'week', beginWeek, endWeek, timezone.name(), scope);
    };

    /**
     * return events of the month
     */
    calendarManager.getEventMonth = function(scope, user_id) {
      let eventMonth;
      let interval;
      const timezone = jstz.determine();
      const EventResourceService = $injector.get('EventResourceService');
      this.eventService = new EventResourceService();
      calendarManager = this; // eslint-disable-line

      if (mom !== null) {
        interval = this.getIntervalMonth();
        log('displayed interval: %o - %o', interval.begin.format('LL'), interval.end.format('LL'));
      }
      if (scope.isMobileView === false) {
        eventMonth = this.eventService.indexEvent(user_id, 'month', interval.begin.format('YYYY-MM-DD'), interval.end.format('YYYY-MM-DD'),
          timezone.name(), scope).$promise
          .then(function() {});
      } else {
        eventMonth = this.eventService.indexEvent(user_id, 'mobile_month', interval.begin.format('YYYY-MM-DD'), interval.end.format('YYYY-MM-DD'),
          timezone.name(), scope);
      }
      return eventMonth;
    };

    /**
     * return all day events
     */
    calendarManager.getEventAllDay = function(scope, startAt, endAt) {
      const EventResourceService = $injector.get('EventResourceService');
      const timezone = jstz.determine();
      this.eventService = new EventResourceService();
      return this.eventService.indexEventAllDay(scope.userId, startAt, endAt, timezone.name(), scope);
    };
    calendarManager.prepareDataMonth = function(index, maxTops, week) {
      let result;
      let _i;
      result = [];
      for (let j = _i = 0, _ref = maxTops[index] - 1; _i <= _ref; j = _i += 1) {
        result.push(calendarManager.eventbyLine(week, j));
      }
      return result;
    };
    calendarManager.eventbyLine = function(week, line) {
      const result = [];
      for (let _i = 0, _len = week.length; _i < _len; _i++) {
        const e = week[_i];
        if (e.event.top === line) {
          result.push(e);
        }
      }
      return result;
    };

    /**
     * fill scope with formated date, used in event form
     */
    calendarManager.fillDate = function(event, week, day, hour) {
      const date = $moment().year(mom.year()).week(week).weekday(day);
      hour = hour ? parseInt(hour, 10) : '';
      event.start_date = date.toDate();
      event.end_date = date.toDate();
      if (hour !== '') {
        event.start_hour = $moment().hour(hour).minute(0).format('LT');
      }
      if (hour !== '') {
        event.end_hour = $moment().hour(hour + 1).minute(0).format('LT');
      }
    };

    /**
     * return number of weeks to be displayed
     */
    calendarManager.getNumberOfWeek = function() {
      const firstDayOfMonth = $moment(mom).startOf('month').startOf('week');
      const lastDayOfMonth = $moment(mom).endOf('month').endOf('week');

      // const startOfMonth = $moment([firstDayOfMonth.year(), firstDayOfMonth.month(), firstDayOfMonth.date()]);
      // const endOfMonth = $moment([lastDayOfMonth.year(), lastDayOfMonth.month(), lastDayOfMonth.date()]);
      return Math.ceil(lastDayOfMonth.diff(firstDayOfMonth, 'weeks', true));
    };
    calendarManager.getMonthMobile = function() {
      const monthsMobile = [];
      monthsMobile.push({
        daysMonth: calendarManager.setDaysMonth(),
        unixMonth: calendarManager.getCurrentMonthUnix(),
        month: mom.month()
      });
      return monthsMobile;
    };

    /**
     * return the unix timestamp of the first day of the month
     */
    calendarManager.getCurrentMonthUnix = function() {
      return mom.date(1).valueOf();
    };

    /**
     * return today's day index
     * ex:
     *   - first day of the week -> week index: 0
     *   - last day of the week -> week index: 6
     * returns null if not applicable
     */
    calendarManager.getCurrentDayIndex = function() {
      const currentDayIndex = this.isWithinRange() ? $moment().weekday() : null;
      log('current day/week index: %o', currentDayIndex);
      return currentDayIndex;
    };

    /**
     * return today's week index
     * ex:
     *   - first day of the month -> week index: 0
     *   - last day of the month -> week index: 5
     *   - first day of the next month -> week index: last index
     * returns null if not applicable
     */
    calendarManager.getCurrentWeekMonthIndex = function() {
      const isWithinRange = this.isWithinRange();
      const currentWeekMonthIndex = (() => {
        let value;
        if (isWithinRange) {
          if ($moment().month() > mom.month()) {
            value = $moment().endOf('month').week() - $moment().startOf('month').week() - 1;
          } else if ($moment().month() < mom.month()) {
            value = 0;
          } else {
            value = $moment().week() - mom.date(1).week();
          }
        } else {
          value = null;
        }
        return value;
      })();
      log('current week/month index: %o', currentWeekMonthIndex);
      return currentWeekMonthIndex;
    };

    /**
     * is today displayed in the caldendar?
     */
    calendarManager.isWithinRange = function() {
      const range = this.getIntervalMonth();
      return $moment().isBetween(range.begin, range.end);
    };

    calendarManager.isCurrentWeek = function() {
      return mom.week() === $moment().week();
    };
    calendarManager.isCurrentMonth = function() {
      return mom.month() === $moment().month();
    };
    calendarManager.nextMonth = function() {
      return $moment(mom).add(1, 'M');
    };
    calendarManager.prevMonth = function() {
      return $moment(mom).subtract(1, 'M');
    };
    calendarManager.nextWeek = function() {
      return $moment(mom).add(1, 'w');
    };
    calendarManager.prevWeek = function() {
      return $moment(mom).subtract(1, 'w');
    };

    /**
     * return currently visited day
     */
    calendarManager.getCurrentDay = () => mom;

    /**
     * return moment to be open from month view
     * if we're visiting today's month, return today's moment
     * else return the first week of the month 's moment
     */
    calendarManager.getViewWeek = function() {
      let viewWeek;
      if ($moment().year() === mom.year() && $moment().month() === mom.month()) {
        viewWeek = $moment();
      } else {
        viewWeek = $moment(mom.startOf('month'));
      }
      return viewWeek;
    };

    calendarManager.setViewMonth = function(scope) {
      scope.daysWeek = this.setDaysMonth();
      scope.weekIndex = this.getCurrentWeekMonthIndex();
      scope.currentMonthUnix = this.getCurrentMonthUnix();
      if (scope.isMobileView === true) {
        scope.monthsMobile = this.getMonthMobile();
      }
    };

    calendarManager.formatDateForm = function(event, undefinedHours) {
      let endHour = null;
      let endMinutes = null;
      let startHour = null;
      let startMinutes = null;
      if (!(event.all_day || undefinedHours)) {
        const startMoment = $moment(event.start_hour, 'LT');
        const endMoment = $moment(event.end_hour, 'LT');
        [startHour, startMinutes] = [startMoment.hours(), startMoment.minutes()];
        [endHour, endMinutes] = [endMoment.hours(), endMoment.minutes()];
      }
      // $moment.locale($translate.use());
      if (!event.all_day && !undefinedHours) {
        event.start_date = $moment(event.start_date).hours(startHour).minutes(startMinutes).unix();
        event.end_date = $moment(event.end_date).hours(endHour).minutes(endMinutes).unix();
      } else {
        event.start_date = $moment(event.start_date).hours(0).minutes(0).unix();
        event.end_date = $moment(event.end_date).hours(0).minutes(0).unix();
      }
      return event;
    };
    return calendarManager;
  }
);
