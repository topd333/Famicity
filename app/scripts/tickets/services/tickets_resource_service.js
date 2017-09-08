angular.module('famicity').factory('Ticket', function($resource, configuration, resourceTransformer) {
  'use strict';
  var Ticket;
  Ticket = $resource(configuration.api_url + '/view_ticket/:ticket_id/:token', {
    'ticket_id': '@ticket_id'
  }, {
    send_contact: {
      method: 'POST',
      url: configuration.api_url + '/contacts'
    },
    create_ticket: {
      method: 'POST',
      params: {
        ticket_id: '@ticket_id',
        token: '@token'
      },
      url: configuration.api_url + '/view_ticket/:ticket_id/:token',
      transformRequest: function(data) {
        var attrs;
        attrs = {};
        attrs.ticket = angular.copy(data);
        return angular.toJson(attrs);
      }
    },
    view_ticket: {
      method: 'GET',
      params: {
        ticket_id: '@ticket_id',
        token: '@token'
      },
      url: configuration.api_url + '/view_ticket/:ticket_id/:token',
      transformResponse: (data, headers, status) => resourceTransformer.transformResponse(data, 'show_ticket', status)
    }
  });
  return Ticket;
});
