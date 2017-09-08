angular.module('famicity')
  .controller('EventInvitedController', function(
    $scope, navigation, $stateParams, EventResourceService, me, $moment) {
    'use strict';

    $scope.$moment = $moment;
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.isCurrentUser = $scope.userId === $scope.viewedUserId;
    $scope.objectType = 'event';
    $scope.objectId = $stateParams.event_id;
    $scope.invitType = $stateParams.invit_type;
    this.eventService = new EventResourceService();
    this.eventService.showEvent($scope.userId, $stateParams.event_id, $scope);
    this.eventService.getInvitList($scope.userId, $stateParams.event_id, $stateParams.invit_type, $scope);
    $scope.selectionMode = false;
    $scope.selectedUsers = null;

    $scope.gotoEditEvent = function(tab) {
      navigation.go('u.event-edit', {
        event_id: $scope.objectId,
        tab
      });
    };
  });
