angular.module('famicity.calendar')
  .service('calendarService', (Event) => {
    'use strict';

    const getEvent = (eventId, userId) => new Event({id: eventId}).$get({user_id: userId});
    return {
      getEvent
    };
  });
