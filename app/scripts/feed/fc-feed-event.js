angular.module('famicity')
  .directive('fcFeedEvent', function(
    $location, $state, ModalManager, EventResourceService,
    $moment, sessionManager, $timeout) {
    'use strict';

    return {
      restrict: 'EA',
      scope: {
        object: '=',
        user: '=',
        answer: '&'
      },
      templateUrl: '/scripts/feed/fc-feed-event.html',
      controller($scope) {
        $scope.object.type = 'event';
        $scope.$moment = $moment;

        $scope.listPageUrl = $state.href('u.event-likes', {
          user_id: $scope.object.author_id,
          event_id: $scope.object.id
        });

        $scope.isAfterDate = function(date) {
          return $moment().isAfter(date * 1000);
        };

        $scope.showMoreComments = function() {
          $state.go('u.event-show', {
            event_id: $scope.object.id,
            show_comments: true
          });
        };

        $scope.eventAnswer = function(answer) {
          const eventService = new EventResourceService();
          if (answer === 'yes') {
            eventService.answerEventYes($scope.user.id, $scope.object.id, $scope)
              .then(() => $timeout(() => $scope.object.answer = 'attend'));
          } else if (answer === 'maybe') {
            eventService.answerEventMaybe($scope.user.id, $scope.object.id, $scope)
              .then(() => $timeout(() => $scope.object.answer = 'maybe'));
          } else if (answer === 'no') {
            eventService.answerEventNo($scope.user.id, $scope.object.id, $scope)
              .then(() => $timeout(() => $scope.object.answer = 'decline'));
          }
        };

        $scope.editAnswer = function() {
          return ModalManager.open({
            templateUrl: '/views/popup/popup_change_answer_event.html',
            scope: $scope
          });
        };
      }
    };
  });
