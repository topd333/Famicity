angular.module('famicity')
  .factory('Event', function($resource, $moment, configuration, resourceTransformer) {
  'use strict';
  return $resource(configuration.api_url + '/users/:user_id/events/:event_id', {event_id: '@id'}, {
    get: {
      transformResponse(data) {
        data = resourceTransformer.transform(data, 'event');
        if (data && data.end_date) {
          data.isAfterDate = $moment().isAfter(data.end_date * 1000) !== false;
        }
        return data;
      }
    },
    get_events: {
      url: configuration.api_url + '/users/:user_id/events/calendar'
    },
    get_events_allday: {
      url: configuration.api_url + '/users/:user_id/events/all_day'
    },
    show_event: {
      url: configuration.api_url + '/users/:user_id/events/:event_id'
    },
    edit_event: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/edit'
    },
    create_event: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/events'
    },
    albums_event: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/albums'
    },
    create_event_album: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/events/:event_id/albums'
    },
    answer_event_yes: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/events/:event_id/attend'
    },
    answer_event_maybe: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/events/:event_id/maybe'
    },
    answer_event_no: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/events/:event_id/decline'
    },
    event_invit_yes: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/attend_list'
    },
    event_invit_maybe: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/maybe_list'
    },
    event_invit_no: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/decline_list'
    },
    event_invit_no_answer: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/no_answer_list'
    },
    update_event: {
      method: 'PUT',
      url: configuration.api_url + '/users/:user_id/events/:event_id'
    },
    delete_event: {
      method: 'DELETE',
      url: configuration.api_url + '/users/:user_id/events/:event_id'
    },
    create_reminder: {
      method: 'POST',
      url: configuration.api_url + '/users/:user_id/events/:event_id/reminders'
    },
    index_reminder: {
      url: configuration.api_url + '/users/:user_id/events/:event_id/reminders'
    },
    update_reminder: {
      method: 'PUT',
      url: configuration.api_url + '/users/:user_id/events/:event_id/reminders/:reminder_id'
    },
    delete: {
      method: 'DELETE',
      url: configuration.api_url + '/users/:user_id/events/:event_id'
    }
  });
});
