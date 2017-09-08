angular.module('famicity')
.controller('HomeController', function(
$scope, $rootScope, $q, $state, Session,
$moment, sessionManager, userService, profileService,
LoadingAnimationUtilService, isFeedPage, EventResourceService,
directoryService, elements, me, $timeout, counters, currentStory,
pubsub, PUBSUB, birthdays, nextEvents, lastConnected, $document) {
  'use strict';

  $document.trigger('fc-scroll:destroy');

  $scope.isFeedPage = isFeedPage;
  const eventService = new EventResourceService();

  $scope.unreadMessages = counters.getUnreadMessages();
  $scope.unreadInvitations = counters.getUnreadInvitations();

  // Resolved variables
  $scope.me = me;
  $scope.currentStory = currentStory;
  $scope.elements = elements.elements ? elements.elements : [];

  $scope.logout = function() {
    Session.logout($scope);
  };

  $scope.eventAnswer = function(answer, eventId) {
    if (answer === 'yes') {
      eventService.answerEventYes($scope.userId, eventId, $scope).then(function() {
        $state.go('u.event-show', {event_id: eventId});
      });
    } else if (answer === 'maybe') {
      eventService.answerEventMaybe($scope.userId, eventId, $scope).then(function() {
        $state.go('u.event-show', {event_id: eventId});
      });
    } else if (answer === 'no') {
      eventService.answerEventNo($scope.userId, eventId, $scope).then(function() {
        $state.go('u.event-show', {event_id: eventId});
      });
    }
  };

  pubsub.subscribe(PUBSUB.MESSAGES.READ, function() {
    $timeout(function() {
      $scope.unreadMessages--;
    });
  }, $scope);

  pubsub.subscribe(PUBSUB.MESSAGES.UNREADCOUNT, function(event, unreadCount) {
    $timeout(function() {
      $scope.unreadMessages = unreadCount;
    });
  }, $scope);

  pubsub.subscribe(PUBSUB.INVITATIONS.UNREADCOUNT, function(event, unreadCount) {
    $timeout(function() {
      $scope.unreadInvitations = unreadCount;
    });
  }, $scope);

  LoadingAnimationUtilService.resetPromises();
  LoadingAnimationUtilService.activate();
  $scope.userId = me.id;
  $scope.settingsId = me.settings.id;
  $rootScope.pageType = 'private';
  $scope.nextBirthdayMaxDisplay = 2;
  LoadingAnimationUtilService.validateList();
  let promises = [];
  const userProfilePromise = profileService.getBasicProfile(me.id);
  promises.push(userProfilePromise);
  userProfilePromise.then(function(profile) {
    $scope.basicProfile = profile;
    directoryService.counters({
      state: 'active'
    }).then(function(response) {
      $scope.hasFewContacts = response.total < 5;
      $scope.hasNoContact = response.total === 0;
      if ($scope.hasFewContacts && profile.contact_directory_imported) {
        var suggestionsPromise = userService.invitationSuggestions().$promise;
        suggestionsPromise.then(function(suggestions) {
          $scope.suggestions = suggestions.map(suggestion => {
            suggestion.global_state = 'directory';
            return suggestion;
          });
        });
        return promises.concat([suggestionsPromise]);
      }
    });
  });
  $q.all(promises).then(function() {
    $scope.initialized = true;
  });
  LoadingAnimationUtilService.addPromises(promises);
  $scope.$moment = $moment;
  // var _ref1 = sessionManager.getLocale();
  // $scope.$moment.locale(_ref1 != null ? _ref1 : 'fr');
  $scope.nextBirthdays = birthdays.users;
  $scope.nextEvents = nextEvents.next_events;
  $scope.lastConnected = lastConnected.users;
});
