angular.module('famicity').controller('CalendarMonthController', function(
  $scope, $state, $stateParams, calendarManager, windowSizeNotification,
  me, $moment) {
  'use strict';
  calendarManager.initMoment();
  calendarManager.setMoment({
    year: $stateParams['year'],
    month: $stateParams['month'],
    isMobile: windowSizeNotification.isMobile()
  });
  $scope.userId = me.id;
  $scope.init = function() {
    this.calendarTemplate = 'month';
    calendarManager.setDefaultValue($scope);
    calendarManager.setViewMonth($scope);
  };
  $scope.showEvent = function(eventId) {
    $state.go('u.event-show', {'event_id': eventId});
  };
  $scope.showBirthDay = function(userId) {
    $state.go('u.profile', {'user_id': userId});
  };
  $scope.createEvent = function() {
    $state.go('u.event-add', {'user_id': $scope.userId});
  };
  $scope.createEventInterval = function(week, day) {
    $state.go('u.event-add', {'day': day, 'week': week});
  };
  $scope.nextMonth = function() {
    const nextMonth = calendarManager.nextMonth();
    $state.go('u.calendar.month', {'month': nextMonth.month(), 'year': nextMonth.year()});
  };
  $scope.prevMonth = function() {
    const prevMonth = calendarManager.prevMonth();
    $state.go('u.calendar.month', {'month': prevMonth.month(), 'year': prevMonth.year()});
  };
  $scope.getCurrentDay = function() {
    $state.go('u.calendar.month', {'month': $moment().month(), 'year': $moment().year()});
  };
  $scope.viewWeek = function() {
    const currentWeek = calendarManager.getViewWeek();
    $state.go('u.calendar.week', {'week': currentWeek.week(), 'year': currentWeek.year()});
  };
  $scope.viewWeekMobile = function(d, index) {
    $state.go('u.calendar.week', {'week': d.week, 'year': d.year, 'day': index});
  };
});
