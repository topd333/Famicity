angular.module('famicity').directive('fcBuildCalendar', function(
  $compile, $http, $templateCache, calendarManager, windowSizeNotification,
  $translate, sessionManager, $moment) {
  'use strict';
  let compileTemplate;
  let getTemplate;
  getTemplate = function(contentType) {
    const baseUrl = '/scripts/calendar/';
    const template = {
      month: 'month/month_calendar.html',
      week: 'week/week_calendar.html',
      monthMobile: 'month/month_mobile.html',
      weekMobile: 'week/week_mobile.html'
    };
    const templateUrl = baseUrl + template[contentType];
    return $http.get(templateUrl, {
      cache: $templateCache
    });
  };
  compileTemplate = function(scope, element, template) {
    const loader = getTemplate(template);
    return loader.success(function(newHtml) {
      return element.html(newHtml);
    }).then(function() {
      return element.html($compile(element.html())(scope));
    });
  };
  return {
    restrict: 'AE',
    replace: true,
    link(scope, element) {
      let onChangeResolution;
      let tempWeek;
      scope.$moment = $moment;
      if (scope.calendarTemplate === 'week') {
        tempWeek = scope.daysWeek;
      } else {
        tempWeek = scope.daysWeek[0];
      }
      scope.daysName = tempWeek.map(function(day) {
        const weekday = $moment().year(day.year).month(day.month).date(day.day).day();
        return $moment.weekdays()[weekday];
      });
      onChangeResolution = function(message) {
        scope.isMobileView = message.mobile;
        if (scope.calendarTemplate === 'month') {
          calendarManager.getEventMonth(scope, scope.userId);
          if (scope.isMobileView === true) {
            scope.monthsMobile = calendarManager.getMonthMobile();
          }
        } else {
          if (scope.isMobileView === true) {
            if (scope.currentDayUnix === null) {
              const date = calendarManager.getCurrentDate(scope);
              scope.currentDayIndex = date.dayIndex;
              scope.currentDayUnix = date.dayUnix;
              calendarManager.getEventAllDay(scope, date.day, date.day);
            } else {
              calendarManager.getEventAllDay(scope, $moment(scope.currentDayUnix * 1000).format('YYYY-MM-DD'), $moment(scope.currentDayUnix * 1000).format('YYYY-MM-DD'));
            }
          }
          calendarManager.getEventWeek(scope, scope.userId).$promise.then(function() {
            scope.dayEvents = scope.weekEvents[scope.currentDayIndex];
          });
        }
        return scope.$evalAsync();
      };
      windowSizeNotification.onWindowChange(scope, onChangeResolution);
      scope.$watch('isMobileView', function(newValue) {
        if (newValue === false) {
          compileTemplate(scope, element, scope.calendarTemplate);
        } else {
          compileTemplate(scope, element, scope.calendarTemplate + 'Mobile');
          scope.weekIndex = calendarManager.getCurrentWeekMonthIndex();
        }
      });
      scope.$on('$destroy', function() {
        scope.$watch('isMobileView', function() {});
      });
      scope.range = function(n) {
        return new Array(n);
      };
      scope.selectDay = function(d, index) {
        window.scrollTo(0, 0);
        const date = $moment().year(d.year).month(d.month).isoWeek(d.week).date(d.day);
        scope.currentDayIndex = index;
        scope.currentDayUnix = date.format('X');
        scope.isCurrentWeek = calendarManager.isCurrentWeek();
        if (scope.weekEvents) {
          scope.dayEvents = scope.weekEvents[index];
        }
        return calendarManager.getEventAllDay(scope, date.format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
      };
      scope.getColorText = function(color) {
        switch (color) {
          case '#DBEBAD':
          default:
            return 'color-green-event';
          case '#c1e4f7':
            return 'color-blue-event';
          case '#C8ADD0':
            return 'color-purple-event';
        }
      };
    }
  };
});
