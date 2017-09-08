angular.module('famicity').controller('CalendarWeekController', function(
  $scope, $state, $stateParams, calendarManager, windowSizeNotification, me, $moment, menu) {
  'use strict';
  calendarManager.initMoment();
  calendarManager.setMoment({
    year: $stateParams['year'],
    week: $stateParams['week'],
    day: $stateParams['day'],
    isMobile: windowSizeNotification.isMobile()
  });
  $scope.init = function() {
    var $moment;
    $scope.userId = me.id;
    this.calendarTemplate = 'week';
    calendarManager.setDefaultValue($scope);
    $moment = moment;
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
  $scope.createEventInterval = function(day, hour) {
    $state.go('u.event-add', {'day': day, 'hour': hour, 'week': $stateParams['week']});
  };
  $scope.createEventAllDay = function(day) {
    $state.go('u.event-add', {'day': day, 'week': $stateParams['week'], 'all_day': true});
  };
  $scope.nextWeek = function() {
    const nextWeek = calendarManager.nextWeek();
    $state.go('u.calendar.week', {'week': nextWeek.week(), 'year': nextWeek.weekYear()});
  };
  $scope.prevWeek = function() {
    const prevWeek = calendarManager.prevWeek();
    $state.go('u.calendar.week', {'week': prevWeek.week(), 'year': prevWeek.weekYear()});
  };
  $scope.viewMonth = function() {
    const currentDay = calendarManager.getCurrentDay();
    $state.go('u.calendar.month', {'month': currentDay.month(), 'year': currentDay.year()});
  };
  $scope.getCurrentDay = function() {
    $state.go('u.calendar.week', {year: $moment().year(), week: $moment().week()});
  };
});
