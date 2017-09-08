angular.module('famicity')
  .controller('EventEditController', function(
    $scope, $location, $state, $stateParams, $moment,
    $q, ModalManager, EventResourceService, calendarManager,
    pendingFormsManagerService, Permission, notification, me,
    yesnopopin, Event, permissionService, util, pubsub, PUBSUB) {
    'use strict';

    const eventService = new EventResourceService();

    $scope.userId = me.id;
    $scope.viewedUserId = me.id;
    $scope.submitted = false;
    $scope.isCurrentUser = $scope.userId === $scope.viewedUserId;
    $scope.objectType = 'event';
    $scope.objectId = $stateParams.event_id;
    $scope.formInProgress = false;
    $scope.formKey = 'edit_event';
    $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'config', {
      objectType: 'event',
      objectId: $stateParams.event_id
    });

    if (!$scope.formData.event) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'event', {});
      eventService.editEvent($scope.userId, $stateParams.event_id).$promise.then(function(response) {
        const beginDate = response.event.start_date;
        const endDate = response.event.end_date;
        response.event.start_date = $moment(beginDate, 'X').toDate();
        response.event.end_date = $moment(endDate, 'X').toDate();
        if (response.event.all_day !== true) {
          response.event.start_hour = $moment(beginDate, 'X').format('LT');
          response.event.end_hour = $moment(endDate, 'X').format('LT');
        }
        if (angular.isUndefined(response.event.color)) {
          response.event.color = '#c1e4f7';
        }
        response.event.description = util.htmlToUTFParagraphs(response.event.description);
        $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'event', response.event);
        return eventService.indexEventReminder($scope.userId, $stateParams.event_id).$promise.then(function(reminderResponse) {
          if (reminderResponse.reminders.length > 0) {
            response.event.reminder_email = true;
            response.event.reminder = reminderResponse.reminders[0];
          } else {
            response.event.reminder_email = false;
            response.event.reminder = {};
          }
          $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'event', response.event);
        });
      });
      Permission.get({
        object_type: 'event',
        object_id: $stateParams.event_id
      }).$promise.then(function(response) {
        $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'permissions', response.permissions);
      });
    }

    $scope.locationType = 'calendar';

    if ($stateParams.tab === 'permission') {
      $scope.tabActive = 'permission';
    } else {
      $scope.tabActive = 'info';
    }

    $scope.status = {
      isopen: false
    };

    $scope.$on('$stateChangeStart', function() {
      if (pendingFormsManagerService.getForm($scope.formKey)) {
        pendingFormsManagerService.addForm($scope.formKey, 'event', $scope.formData.event);
        return pendingFormsManagerService.addForm($scope.formKey, 'permissions', $scope.formData.permissions);
      }
    });

    $scope.$watch('formData.event.reminder_email', function(newVal, oldVal) {
      if (newVal === true || oldVal === true) {
        if (Object.keys($scope.formData.event.reminder).length === 0) {
          $scope.formData.event.reminder.unit = 'Mi';
          $scope.formData.event.reminder.number = 15;
        }
      }
    });

    $scope.toggleDropdown = function() {
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.updateEvent = function() {
      let attrsReminder;
      let eventEditCopy;
      let sameStartAndEndTime;
      const promises = [];
      const defer = $q.defer();
      const formData = $scope.formData;
      const undefinedHours =
        formData.event.start_hour == null && formData.event.end_hour == null || (formData.event.start_hour === '' || formData.event.end_hour === '');
      sameStartAndEndTime =
        formData.event.start_date === formData.event.end_date && formData.event.start_hour === formData.event.end_hour;
      $scope.submitted = true;
      if ($scope.eventForm.$valid && (formData.event.all_day || undefinedHours || !sameStartAndEndTime)) {
        promises.push(defer.promise);
        eventEditCopy = angular.copy(formData.event);
        eventEditCopy = calendarManager.formatDateForm(eventEditCopy, undefinedHours);
        if (undefinedHours) {
          eventEditCopy.all_day = true;
        }
        attrsReminder = {
          number: eventEditCopy.reminder.number,
          unit: eventEditCopy.reminder.unit
        };
        // Update event
        const updateEventPromise = eventService.updateEvent($scope.userId, eventEditCopy.id, {
          name: eventEditCopy.name,
          description: eventEditCopy.description,
          start_at: eventEditCopy.start_date,
          end_at: eventEditCopy.end_date,
          location: eventEditCopy.location,
          color: eventEditCopy.color,
          all_day: eventEditCopy.all_day
        });
        // After event update, we set permissions
        updateEventPromise.then(function() {
          const permissions = permissionService.getFormattedPermissions($scope.formData.permissions.user_permissions, $scope.formData.permissions.group_permissions);
          const exclusions = permissionService.getFormattedPermissions($scope.formData.permissions.user_exclusions, $scope.formData.permissions.group_exclusions);
          const invitations = pendingFormsManagerService.getFormattedInvitations($scope.formData.permissions.email_permissions);
          return new Permission({
            permissions,
            exclusions,
            invitations
          }).$save({
            object_type: 'event',
            object_id: eventEditCopy.id
          })
          // After setting permissions, set the reminder, if necessary
          .then(function() {
            const resolve = function() {
              pendingFormsManagerService.removeForm($scope.formKey);
              notification.add('EVENT_UPDATED_SUCCESS_MSG');
              $state.go('u.calendar');
              defer.resolve();
            };
            // Set the reminder, if it does not exist yet
            if (attrsReminder.number && attrsReminder.unit && !eventEditCopy.reminder.id) {
              eventService.createEventReminder($scope.userId, eventEditCopy.id, attrsReminder)
              .then(resolve).catch(() => defer.reject());
              // Update the reminder, if necessary
            } else if (eventEditCopy.reminder.id) {
              eventService.updateEventReminder($scope.userId, eventEditCopy.id, eventEditCopy.reminder.id, {
                number: eventEditCopy.reminder.number,
                unit: eventEditCopy.reminder.unit
              })
              .then(resolve).catch(() => defer.reject());
            } else {
              resolve();
            }
          }).catch(() => defer.reject());
        }).catch(() => defer.reject());
      } else {
        notification.add('INVALID_FORM');
      }
      return promises;
    };
    pubsub.subscribe(PUBSUB.CALENDAR.EDIT.SUBMIT, $scope.updateEvent, $scope);

    $scope.deleteEvent = function() {
      yesnopopin.open('DELETE_EVENT_CONFIRMATION_POPUP_TITLE').then(function() {
        Event.delete({user_id: $scope.userId, event_id: $stateParams.event_id}).$promise.then(function() {
          notification.add('EVENT_DELETED_SUCCESS_MSG');
          pendingFormsManagerService.removeForm($scope.formKey);
          $state.go('u.calendar', {user_id: $scope.userId});
        });
      });
      return [];
    };

    $scope.setColor = function(color) {
      $scope.formData.event.color = color;
    };
  });
