angular.module('famicity')
  .controller('BirthdaysController', function(
    $scope, $state, $stateParams, userService, pendingFormsManagerService, me) {
    'use strict';

    $scope.userId = me.id;
    $scope.page = 1;
    $scope.infiniteScrollLoading = false;
    $scope.infiniteScrollDisabled = true;
    $scope.todayBirthdaysList = [];
    $scope.birthdaysList = [];

    userService.todayBirthdays($scope.userId).$promise.then(function(response) {
      $scope.todayBirthdaysList = response.users;
    });

    userService.yearBirthdays($scope.userId).$promise.then(function(response) {
      $scope.addToBirthdaysList(response.birthdays);
      $scope.infiniteScrollDisabled = false;
    });

    $scope.addToBirthdaysList = function(birthdays) {
      if (!$scope.birthdaysList.length) {
        $scope.birthdaysList = birthdays;
      } else {
        $scope.birthdaysList = $scope.birthdaysList.concat(birthdays);
      }
      $scope.groupList();
    };

    $scope.groupList = function() {
      let prev_user = null;
      const new_field = 'group_by_CHANGED';
      angular.forEach($scope.birthdaysList, function(user) {
        user[new_field] = true;
        if (prev_user !== null) {
          if (prev_user.group_date === user.group_date) {
            user[new_field] = false;
          }
        }
        prev_user = user;
      });
    };

    $scope.loadMoreElements = function() {
      $scope.infiniteScrollLoading = true;
      $scope.page += 1;
      return userService.yearBirthdays($scope.userId, $scope.page).$promise.then(function(response) {
        $scope.infiniteScrollLoading = false;
        if (response.birthdays.length === 0) {
          $scope.infiniteScrollDisabled = true;
        } else {
          $scope.addToBirthdaysList(response.birthdays);
        }
      });
    };
  });
