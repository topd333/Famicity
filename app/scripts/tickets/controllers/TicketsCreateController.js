
angular.module('famicity').controller('TicketsCreateController', function(
  $scope, $timeout, $http, $state, $stateParams,
  $rootScope, $translate, Ticket, notification, locale) {
  'use strict';

  $scope.locale = locale;
  $rootScope.notifications = notification.list;
  $scope.submitted = false;
  $scope.formInProgress = false;
  $scope.statuses = [
    {id: 0, key: 'MAIL_TITLE_SPECIAL_REQUEST'},
    {id: 1, key: 'MAIL_TITLE_PRIVACY'},
    {id: 2, key: 'MAIL_TITLE_ERASE_DATA'}
  ];
  $scope.selected_status = 0;
  $scope.contact = {};

  $scope.send = function() {
    const promises = [];
    $scope.submitted = true;
    const tmp = $translate.instant($scope.contact.reason);
    const ticket = new Ticket({
      email: $scope.contact.userEmail,
      reason: tmp,
      content: $scope.contact.contactContent
    });
    promises.push(ticket.$send_contact({locale}).then(function() {
      $state.go('public.base', {locale});
      notification.add('MESSAGE_SENT_CONFIRMATION');
    }));
    return promises;
  };
});
