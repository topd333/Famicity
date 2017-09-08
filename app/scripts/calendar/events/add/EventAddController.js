angular.module('famicity')
  .controller('EventAddController', function(
    $q, $scope, $location, $state, $stateParams,
    $translate, ModalManager, EventResourceService, calendarManager,
    pendingFormsManagerService, notification, Permission, me,
    permissionService, menu, yesnopopin, pubsub, PUBSUB) {
    'use strict';

    $scope.formInProgress = false;
    $scope.userId = $scope.viewedUserId = me.id;
    $scope.submitted = false;
    $scope.minDateEnd = null;
    const eventService = new EventResourceService();
    $scope.formKey = 'add_event';
    $scope.formData = pendingFormsManagerService.getForm($scope.formKey, 'event');
    if (!$scope.formData.event) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'event', {});
      if (!$scope.formData.event.color) {
        $scope.formData.event.color = '#c1e4f7';
      }
      if ($stateParams.all_day) {
        $scope.formData.event.all_day = true;
      }
      if ($stateParams.day) {
        calendarManager.fillDate($scope.formData.event, $stateParams.week, $stateParams.day, $stateParams.hour);
      }
    }
    if (!$scope.formData.permissions) {
      $scope.formData = pendingFormsManagerService.addForm($scope.formKey, 'permissions', {
        email_permissions: [],
        group_permissions: [],
        group_exclusions: [],
        user_permissions: [],
        user_exclusions: []
      });
    }
    if ($stateParams.tab === 'permission' || $location.search().tab === 'permission') {
      $scope.tabActive = 'permission';
    } else {
      $scope.tabActive = 'info';
    }
    $scope.locationType = 'calendar';
    $scope.status = {
      isopen: false
    };

    $scope.$on('$stateChangeStart', function() {
      if (pendingFormsManagerService.getForm($scope.formKey)) {
        pendingFormsManagerService.addForm($scope.formKey, 'event', $scope.formData.event);
        return pendingFormsManagerService.addForm($scope.formKey, 'permissions', $scope.formData.permissions);
      }
    });

    $scope.$watch('formData.event.reminder_email', function(newVal) {
      if (newVal === true) {
        if (!$scope.formData.event.reminder_unit) {
          $scope.formData.event.reminder_unit = 'Mi';
        }
        if (!$scope.formData.event.reminder_number) {
          $scope.formData.event.reminder_number = 15;
        }
      }
    });

    $scope.toggleDropdown = function() {
      $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.setStartDate = function(start_date) {
      $scope.minDateEnd = start_date;
      if (!$scope.formData.event.end_date) {
        $scope.formData.event.end_date = start_date;
      }
    };

    $scope.addEvent = function() {
      const promises = [];
      $scope.submitted = true;
      const formData = $scope.formData;
      const undefinedHours = formData.event.start_hour == null && formData.event.end_hour == null || (formData.event.start_hour === '' || formData.event.end_hour === '');
      const sameStartAndEndTime = formData.event.start_date === formData.event.end_date && formData.event.start_hour === formData.event.end_hour;
      if ($scope.eventForm.$valid && (formData.event.all_day || undefinedHours || !sameStartAndEndTime)) {
        if (!formData.permissions.email_permissions.length && !formData.permissions.user_permissions.length && !formData.permissions.group_permissions.length && !formData.permissions.user_exclusions.length && !formData.permissions.group_exclusions.length) {
          const defer = $q.defer();
          promises.push(defer.promise);
          yesnopopin.open('EMPTY_INVITATIONS_ALERT', {yes: 'YES', no: 'NO'})
            .catch(function() {
              $scope.proceed(undefinedHours).then(function() {
                return defer.resolve();
              }).catch(function() {
                return defer.reject();
              });
            })
            .then(function() {
              $scope.tabActive = 'permission';
              defer.reject();
            });
        } else {
          promises.push($scope.proceed(undefinedHours));
        }
      } else {
        notification.add('INVALID_FORM', {warn: true});
      }
      return promises;
    };

    pubsub.subscribe(PUBSUB.CALENDAR.ADD.SUBMIT, $scope.addEvent, $scope);

    $scope.proceed = function(undefinedHours) {
      const defer = $q.defer();
      let event = angular.copy($scope.formData.event);
      event = calendarManager.formatDateForm(event, undefinedHours);
      if (undefinedHours) {
        event.all_day = true;
      }
      let attrsReminder = null;
      const attrs = {
        name: event.name,
        description: event.description,
        start_at: event.start_date,
        end_at: event.end_date,
        location: event.location,
        color: event.color,
        all_day: event.all_day
      };
      if ($scope.formData.event.reminder_email != null && $scope.formData.event.reminder_email) {
        attrsReminder = {
          number: event.reminder_number,
          unit: event.reminder_unit
        };
      }
      eventService.createEvent($scope.userId, attrs).then(function(result) {
        const objectId = result.event.id;
        const permissions =
          permissionService.getFormattedPermissions($scope.formData.permissions.user_permissions, $scope.formData.permissions.group_permissions);
        const exclusions =
          permissionService.getFormattedPermissions($scope.formData.permissions.user_exclusions, $scope.formData.permissions.group_exclusions);
        const invitations = pendingFormsManagerService.getFormattedInvitations($scope.formData.permissions.email_permissions);
        if (permissions || exclusions || invitations) {
          new Permission({
            permissions,
            exclusions,
            invitations
          }).$save({
              object_type: 'event',
              object_id: objectId
            }).then(function() {
              if (attrsReminder) {
                eventService.createEventReminder($scope.userId, objectId, attrsReminder).then(function() {
                  pendingFormsManagerService.removeForm($scope.formKey);
                  $state.go('u.event-show', {
                    event_id: objectId
                  });
                  notification.add('EVENT_CREATED_SUCCESS_MSG');
                  defer.resolve();
                }).catch(function() {
                  defer.reject();
                });
              } else {
                pendingFormsManagerService.removeForm($scope.formKey);
                notification.add('EVENT_CREATED_SUCCESS_MSG');
                $state.go('u.event-show', {event_id: objectId});
                defer.resolve();
              }
            }).catch(function() {
              defer.reject();
            });
        } else {
          pendingFormsManagerService.removeForm($scope.formKey);
          notification.add('EVENT_CREATED_SUCCESS_MSG');
          $state.go('u.event-show', {
            event_id: objectId
          });
          return defer.resolve();
        }
      }).catch(function() {
        return defer.reject();
      });
      return defer.promise;
    };

    $scope.setColor = function(color) {
      $scope.formData.event.color = color;
    };
  });
