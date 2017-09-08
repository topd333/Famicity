angular.module('famicity').factory('EventResourceService', function(
  $resource, $location, $state, $filter, notification, configuration, calendarManager, $translate,
  $moment, Event) {
  'use strict';

  function EventService() {

  }

  // TODO: remove $scope
  EventService.prototype.indexEvent = function(userId, format, startAt, endAt, zone, $scope) {
    let promiseEventAllDay;
    const promiseEvent = Event.get_events({
      user_id: userId,
      calendar_format: format,
      start_at: startAt,
      end_at: endAt,
      timezone: zone
    }, function(response) {
      if (format === 'week') {
        $scope.weekEvents = response.week.days;
        Object.keys($scope.weekEvents).forEach(function(dayIndex) {
          $scope.weekEvents[dayIndex].map(function(entry) {
            const events = [];
            entry.event.index_hour =
              (($moment(entry.event.start_date * 1000).hour() * 60 + $moment(entry.event.start_date * 1000).minute()) / 60).toFixed(2);
            entry.event.start_hour = $moment(entry.event.start_date, 'X').format('LT');
            entry.event.duration /= 60;
            // Make sure it is always visible
            entry.event.duration = entry.event.duration > 1 ? entry.event.duration : 1;
            entry.event.width = (100 / entry.event.split).toFixed(2);
            entry.event.left = entry.event.padding * (100 / entry.event.split).toFixed(2);
            if (entry.event.split > 2) {
              events.push(entry.event.content_html = entry.event.start_hour + '<br />' + entry.event.name);
            } else {
              events.push(undefined);
            }
            return events;
          });
        });
      } else {
        $scope.monthEvents = response.weeks;
      }
    });
    if (format === 'week' && $scope.isMobileView === false) {
      promiseEventAllDay = this.indexEventAllDay(userId, startAt, endAt, zone, $scope);
    }
    return promiseEvent;
  };

  EventService.prototype.indexEventAllDay = function(userId, startAt, endAt, zone, $scope) {
    return Event.get_events_allday({
      user_id: userId,
      start_at: startAt,
      end_at: endAt,
      timezone: zone
    }, function(response) {
      $scope.allDays = response.all_day_week.week;
      const allTops = $scope.allDays.map(o => o.event.top);
      $scope.maxTop =
        $scope.allDays && $scope.allDays.length ? Math.max(...allTops) : 0;
      if ($scope.maxTop === 0) {
        $scope.maxTop = 42;
      } else {
        $scope.maxTop = 21 * (1 + $scope.maxTop);
      }
    });
  };

  EventService.prototype.indexEventAlbums = function(userId, eventId, $scope) {
    return Event.albums_event({
      user_id: userId,
      event_id: eventId
    }, function(response) {
      $scope.event.albums = response.albums;
    });
  };

  EventService.prototype.indexEventReminder = function(userId, eventId) {
    return Event.index_reminder({
      user_id: userId,
      event_id: eventId
    });
  };

  EventService.prototype.getInvitList = function(userId, eventId, listType, $scope) {
    return Event['event_invit_' + listType]({
      user_id: userId,
      event_id: eventId
    }, function(response) {
      if (listType === 'yes') {
        $scope.users = response.attend_list;
      } else if (listType === 'maybe') {
        $scope.users = response.maybe_list;
      } else if (listType === 'no') {
        $scope.users = response.decline_list;
      } else {
        $scope.users = response.no_answer_list;
      }
    });
  };

  EventService.prototype.showEvent = function(userId, eventId, $scope) {
    return Event.show_event({
      user_id: userId,
      event_id: eventId
    }, function(response) {
      $scope.event = response.event;
      $scope.isAfterDate = $moment().isAfter($scope.event.end_date * 1000) !== false;
    });
  };

  EventService.prototype.editEvent = function(userId, eventId) {
    return Event.edit_event({user_id: userId, event_id: eventId});
  };

  EventService.prototype.createEvent = function(userId, attrs) {
    return new Event({event: attrs}).$create_event({user_id: userId});
  };

  EventService.prototype.createEventAlbum = function(userId, eventId, attrs) {
    return new Event({album: attrs}).$create_event_album({user_id: userId, event_id: eventId});
  };

  EventService.prototype.createEventReminder = function(userId, eventId, attrs) {
    return new Event({reminder: attrs}).$create_reminder({user_id: userId, event_id: eventId});
  };

  EventService.prototype.updateEvent = function(userId, eventId, attrs) {
    return new Event({event: attrs}).$update_event({user_id: userId, event_id: eventId});
  };

  EventService.prototype.updateEventReminder = function(userId, eventId, reminderId, attrs) {
    return new Event({
      reminder: attrs
    }).$update_reminder({
      user_id: userId,
      event_id: eventId,
      reminder_id: reminderId
    });
  };

  EventService.prototype.deleteEvent = function(userId, eventId) {
    return Event.delete_event({user_id: userId, event_id: eventId});
  };

  EventService.prototype.answerEventYes = function(userId, eventId, $scope) {
    return new Event().$answer_event_yes({
      user_id: userId,
      event_id: eventId
    }, function(response) {
      if (angular.isDefined($scope.event)) {
        $scope.event.answer = 'attend';
        $scope.event.attend_count = response.event.attend_count;
        $scope.event.decline_count = response.event.decline_count;
        $scope.event.maybe_count = response.event.maybe_count;
        $scope.event.no_answer_count = response.event.no_answer_count;
      }
      notification.add('EVENT_ANSWER_MSG');
    });
  };

  EventService.prototype.answerEventMaybe = function(userId, eventId, $scope) {
    return new Event().$answer_event_maybe({
      user_id: userId,
      event_id: eventId
    }, function(response) {
      if (angular.isDefined($scope.event)) {
        $scope.event.answer = 'maybe';
        $scope.event.attend_count = response.event.attend_count;
        $scope.event.decline_count = response.event.decline_count;
        $scope.event.maybe_count = response.event.maybe_count;
        $scope.event.no_answer_count = response.event.no_answer_count;
      }
      notification.add('EVENT_ANSWER_MSG');
    });
  };

  EventService.prototype.answerEventNo = function(userId, eventId, $scope) {
    return new Event().$answer_event_no({
      user_id: userId,
      event_id: eventId
    }, function(response) {
      if (angular.isDefined($scope.event)) {
        $scope.event.answer = 'decline';
        $scope.event.attend_count = response.event.attend_count;
        $scope.event.decline_count = response.event.decline_count;
        $scope.event.maybe_count = response.event.maybe_count;
        $scope.event.no_answer_count = response.event.no_answer_count;
      }
      notification.add('EVENT_ANSWER_MSG');
    });
  };

  return EventService;
});
