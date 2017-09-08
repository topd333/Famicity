angular.module('famicity')
  .controller('DirectoryProfileGroupsController', function ($scope, $window, $rootScope, $location, $timeout,
                                                            directoryService, groupService, profileService, userService,
                                                            pendingFormsManagerService, ModalManager, $stateParams, notification,
                                                            LoadingAnimationUtilService, InvitationService, navigation, me, pubsub, PUBSUB) {
    'use strict';

    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    $scope.$parent.hideLeftColumnBlock = true;
    LoadingAnimationUtilService.activate();
    const groupPromise = groupService.getGroups($scope.userId, $scope);
    LoadingAnimationUtilService.addPromises(groupPromise);
    groupPromise.then((groups) => {
      $timeout(() => {
        $scope.groups = groups;
        const servicePromise = profileService.get($scope.viewedUserId, $scope);
        LoadingAnimationUtilService.addPromises(servicePromise);
        servicePromise.then(function (profile) {
          $scope.user = profile;
          LoadingAnimationUtilService.validateList();
          $scope.groups = $scope.groups.map((group) => {
            const groupIds = profile.in_groups.map(viewUserGroup => viewUserGroup.id);
            if (groupIds.indexOf(group.id) >= 0) {
              group.selected = true;
            }
            return group;
          });
        });
      });
    });

    const stateChangeStartEvent = $scope.$on('$stateChangeStart', function (event, toState) {
      const _ref = toState.data;
      if ((_ref != null ? _ref.hideLeftColumnBlock : undefined) !== true) {
        $scope.$parent.hideLeftColumnBlock = false;
      }
      return stateChangeStartEvent();
    });

    $scope.submit = function () {
      LoadingAnimationUtilService.activate();
      const selectedGroups = $scope.groups.reduce(function (sGroups, group) {
        if (group.selected != null && group.selected) {
          sGroups.push(group.id);
        }
        return sGroups;
      }, []);
      const userPromise = userService.changeGroupMembership($scope.viewedUserId, selectedGroups).$promise;
      LoadingAnimationUtilService.addPromises(userPromise);
      userPromise.then(() => navigation.go('u.profile', {user_id: $scope.viewedUserId}));
    };
    pubsub.subscribe(PUBSUB.DIRECTORY.GROUPS.PROFILE.SUBMIT, function () {
      $scope.submit();
    });
  });
