angular.module('famicity').controller('TicketsIndexController', function(
  $scope, $rootScope, $translate, Session, $stateParams,
  notification, Ticket) {
  'use strict';
  $scope.message = {};
  $scope.init = function() {
    $rootScope.notifications = notification.list;
    Ticket.view_ticket({
      ticket_id: $stateParams.ticket_id,
      token: $stateParams.token
    }).$promise.then(function(response) {
        $scope.first_ticket = {
          id: response.id,
          created_at: response.created_at,
          email: response.email,
          subject: response.subject,
          message_html: response.message_html
        };
        $scope.tickets = response.children;
      });
    $scope.submitted = false;
    $scope.nbTicketsToShow = 5;
  };
  $scope.send = function() {
    let ticket;
    $scope.submitted = true;
    if ($scope.newMessageForm.$valid) {
      ticket = new Ticket({
        message: $scope.message.newMessageContent
      });
      ticket.$create_ticket({
        ticket_id: $stateParams.ticket_id,
        token: $stateParams.token
      }).then(function() {
        return $scope.addMessage();
      });
    } else {
      notification.add('MESSAGE_CANNOT_BE_EMPTY', {warn: true});
    }
    return null;
  };
  $scope.addMessage = function() {
    const message = {
      created_at: Math.round(Date.now() / 1000),
      email: $scope.first_ticket.email,
      message_html: $scope.message.newMessageContent.replace(/\r?\n/g, '<br />')
    };
    $scope.tickets.push(message);
    $scope.message.newMessageContent = '';
  };
  $scope.showMoreMessages = function() {
    $scope.nbTicketsToShow += 5;
  };
});
