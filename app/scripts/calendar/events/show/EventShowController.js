angular.module('famicity')
  .controller('EventShowController', function(
    $scope, $location, $state, $stateParams, ModalManager,
    EventResourceService, calendarManager, me,
    event, Event, yesnopopin, notification, $moment) {
    'use strict';

    $scope.$moment = $moment;
    // TODO: Remove
    $scope.userId = me.id;
    $scope.user = me;

    $scope.viewedUserId = $stateParams.user_id;
    if ($stateParams.back_action) {
      $scope.tabActive = $stateParams['back_action'];
    } else {
      $scope.tabActive = 'info';
    }
    const eventService = new EventResourceService();
    // eventService.showEvent($scope.userId, $stateParams['event_id'], $scope);
    $scope.event = event;
    $scope.event.type = 'event';
    $scope.listPageUrl = $state.href('u.event-likes', {
      user_id: $scope.viewedUserId,
      event_id: $stateParams.event_id
    });

    $scope.$watch('tabActive', function(newVal) {
      if (newVal === 'album') {
        eventService.indexEventAlbums($scope.userId, $stateParams.event_id, $scope);
      }
    });

    $scope.openAddAlbumPopup = function() {
      return ModalManager.open({
        templateUrl: '/scripts/albums/controllers/PopupAlbumsCreate.html',
        controller: 'PopupAlbumsCreateController',
        scope: $scope
      });
    };

    $scope.eventAnswer = function(answer) {
      if (answer === 'yes') {
        eventService.answerEventYes($scope.userId, $scope.event.id, $scope);
      } else if (answer === 'maybe') {
        eventService.answerEventMaybe($scope.userId, $scope.event.id, $scope);
      } else if (answer === 'no') {
        eventService.answerEventNo($scope.userId, $scope.event.id, $scope);
      }
    };

    $scope.changeAnswer = function() {
      return ModalManager.open({
        templateUrl: '/views/popup/popup_change_answer_event.html',
        scope: $scope
      });
    };

    $scope.gotoEditEvent = function(tab) {
      $state.go('u.event-edit', {
        event_id: $scope.event.id,
        tab
      });
    };
  });
