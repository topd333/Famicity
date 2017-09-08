angular.module('famicity')
  .controller('ProfileEditController', function(
    $scope, $state, $rootScope, $location, $translate,
    $translateMessageFormatInterpolation, $stateParams, $filter, $moment, profileService,
    Tree, notification, me, profile, sessionManager, pubsub, PUBSUB) {
    'use strict';

    $scope.userId = me.id;
    $scope.viewedUserId = parseInt($stateParams.user_id, 10);
    $scope.submitted = false;
    $scope.formInProgress = false;
    $scope.breadcrumbTitle = '';
    $scope.locale = sessionManager.getLocale();
    $scope.birthDateValid = null;
    $scope.deathDateValid = null;
    // $scope.locationType = 'profile';

    profile.birth_date = profile.birth_date ? $moment.fromServer(profile.birth_date).toDate() : null;
    profile.death_date = profile.death_date ? $moment.fromServer(profile.death_date).toDate() : null;

    if (profile.id === me.id) {
      $scope.breadcrumbTitle = $translate.instant('PROFILE_EDIT_PAGE_TITLE');
    } else {
      $scope.breadcrumbTitle =
        $translateMessageFormatInterpolation.interpolate($translate.instant('OTHER_PROFILE_EDIT_PAGE_TITLE', {
          GENDER: profile.sex
        }));
    }
    if (profile.global_state !== 'directory') {
      Tree.isTreeBlocked({user_id: $scope.viewedUserId}).$promise.then(function(response) {
        if (response.info_tree.tree_is_lock) {
          $state.go('u.profile', {user_id: $scope.viewedUserId});
          notification.add('PROFILE_EDIT_TREE_LOCKED_ERROR_MSG', {warn: true});
        }
      });
    }

    $scope.user = profile;

    $scope.submitBasicData = function() {
      let promises = [];
      $scope.submitted = true;

      let data = {
        user: {
          is_deceased: $scope.user.is_deceased,
          first_name: $scope.user.first_name ? $scope.user.first_name : '',
          last_name: $scope.user.last_name ? $scope.user.last_name : '',
          sex: $scope.user.sex,
          user_info_attributes: {
            id: $scope.user.user_info.id,
            maiden_name: $scope.user.maiden_name,
            middle_name: $scope.user.middle_name,
            death_place: $scope.user.death_place,
            job: $scope.user.job,
            company: $scope.user.company,
            birth_place: $scope.user.birth_place
          }
        }
      };
      if ($scope.user.birth_date) {
        data.user.birth_date = $moment($scope.user.birth_date).forServer();
      } else {
        data.user.birth_date = $scope.birthDateValid !== false ? null : 'Invalid date';
      }
      if ($scope.user.death_date) {
        data.user.death_date = $moment($scope.user.death_date).forServer();
      } else {
        data.user.death_date = $scope.deathDateValid !== false ? null : 'Invalid date';
      }
      if (data.user.sex === 'Male') {
        data.user.user_info_attributes.maiden_name = '';
      }
      promises.push(profileService.updateProfile($scope.viewedUserId, data)
        .then(function() {
          notification.add('INFORMATIONS_MODIFIED_SUCCESS_MSG');
          $state.go('u.profile', {user_id: $scope.viewedUserId});
          $scope.submitted = false;
        }));

      return promises;
    };
    pubsub.subscribe(PUBSUB.PROFILE.EDIT.SUBMIT, $scope.submitBasicData, $scope);
  });
