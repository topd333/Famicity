angular.module('famicity.tree')
  .controller('FillAnonymousController', function(
    $timeout, $scope, $location, $state, $q, $filter, ModalManager,
    configuration, userService, Tree, profileService, Invitation, notification, sessionManager,
    $moment, someForm, treeService, pubsub, PUBSUB) {
    'use strict';
    const log = debug('fc-fillAnonymousController');

    angular.extend($scope.currentForm, someForm);

    if (!$scope.currentForm.user) {
      log('No user to fill. Redirecting to add');
      $state.go('u.tree.detail.add');
    }
    $scope.currentForm.user = $scope.currentForm.user || {};
    $scope.currentForm.user.birthDateValid = null;
    $scope.currentForm.user.deathDateValid = null;

    let uploader = null;
    $scope.isValid = true;
    $timeout(function() {
      angular.element('#last_name').focus();
    });

    function addUpdateDone(response) {
      const promises = [];
      if (!$scope.autocompleteUserId) {
        if ($scope.invitationFormHolder.mail_address) {
          $scope.invitationFormHolder.user_concerned_id = response.user.id;
          const invitation = new Invitation({invitation: $scope.invitationFormHolder, type: 'I'});
          promises.push(invitation.$save({user_id: $scope.userId}));
        }
        if (uploader.getUploads() && uploader.getUploads().length) {
          uploader.setEndpoint(configuration.api_url + '/users/' + response.user.id + '/avatars');
          const avatarPromise = $q((resolve) => {
            pubsub.subscribe(PUBSUB.UPLOADER.ON_COMPLETE, () => {
              resolve();
            });
          }, $scope);
          uploader.uploadStoredFiles();
          promises.push(avatarPromise);
        }
      }
      if (!promises.length) {
        notification.add($scope.isUpdate ? 'PARENT_FILLED_SUCCESS_MSG' : 'RELATIVE_ADDED_SUCCESS_MSG');
        $scope.success({user_id: $scope.treeUserProfile.id});
      } else {
        $q.all(promises)
          .then(function() {
            notification.add('PARENT_FILLED_WITH_INVITATION_SUCCESS_MSG');
            $scope.success({user_id: $scope.treeUserProfile.id});
          })
          .catch(() => $scope.fail({user_id: $scope.treeUserProfile.id}));
      }
      return $q.all(promises);
    }

    function defaultLastName(parentLink, currentUser) {
      let lastName;
      switch (parentLink) {
        // Parent
        case 'P':
        // Brother/sister
        case 'B':
          if (currentUser.maiden_name) {
            lastName = currentUser.maiden_name;
          } else if (currentUser.last_name) {
            lastName = currentUser.last_name;
          }
          break;
          // Child
        case 'S':
          if (currentUser.last_name) {
            lastName = currentUser.last_name;
          }
          break;
        default:
      }
      return lastName;
    }

    $scope.autocompleteUserId = null;
    $scope.formInProgress = false;
    $scope.tab = 'basic';

    $scope.invitationFormHolder = {};
    $scope.form = {};
    $scope.submitted = false;
    $scope.currentForm.user.last_name = defaultLastName($scope.currentForm.parentLink, $scope.treeUserProfile);

    Tree.isTreeBlocked({user_id: $scope.treeUserProfile.id}).$promise.then(function(response) {
      if (response.info_tree.tree_is_lock) {
        notification.add('PROFILE_EDIT_TREE_LOCKED_ERROR_MSG', {warn: true});
      }
    });

    $scope.deleteRelativePhoto = function() {
      $scope.isUploadedPhoto = false;
      uploader.reset();
    };

    $scope.isUploadedPhoto = false;
    uploader = new qq.FineUploaderBasic({
      button: document.getElementById('tree-popup-photo'),
      multiple: false,
      autoUpload: false,
      validation: {
        acceptFiles: '.png, .jpg, .jpeg, .gif, .tiff',
        allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'tiff']
      },
      request: {
        endpoint: '',
        customHeaders: {
          Authorization: 'Bearer ' + sessionManager.getToken()
        },
        params: {
          from: 'upload'
        }
      },
      callbacks: {
        onStatusChange(id, oldStatus, newStatus) {
          if (newStatus === 'submitted') {
            $scope.$applyAsync(function() {
              uploader.drawThumbnail(id, document.getElementById('thumb-uploader-directive-img'), 200, false);
              $scope.isUploadedPhoto = true;
            });
          }
        },
        onComplete() {
          pubsub.publish(PUBSUB.UPLOADER.ON_COMPLETE);
        }
      },
      scaling: {
        sendOriginal: false,
        includeExif: true,
        orient: true,
        sizes: {
          name: 'original',
          maxSize: 2400
        }
      }
    });

    $scope.autocompleteSuccess = function($item, $model) {
      [$scope.currentForm.user, $scope.autocompleteUserId, $scope.autocompleteUserName] = treeService.autocompleteSuccess($model);
    };

    $scope.cancelAutocompleteSelect = function() {
      [$scope.currentForm.user, $scope.autocompleteUserId, $scope.autocompleteUserName] = treeService.cancelAutocompleteSelect();
    };

    const cleanWatch = $scope.$watch('currentForm.user.is_deceased', function(newValue) {
      log('change: %o', newValue);
      if (newValue === true && $scope.autocompleteUserId != null) {
        $scope.cancelAutocompleteSelect();
      }
    });

    $scope.$on('$destroy', function() {
      cleanWatch();
    });

    $scope.getUsers = function(q, field) {
      return userService.treeAutocomplete(q, field).$promise;
    };

    $scope.submitBasicForm = function() {
      let userId;
      $scope.currentForm.user.user_info_attributes = $scope.currentForm.user.user_info_attributes || {};
      if ($scope.currentForm.user_info_attributes) {
        userId = $scope.currentForm.user.user_info_attributes.id;
      }
      $scope.currentForm.promises = [];
      $scope.submitted = true;
      $scope.currentForm.sex = $filter('capitalize')($scope.currentForm.sex);
      if ($scope.treeUserProfile.user_info.id && !userId) {
        $scope.currentForm.user.user_info_attributes.id = $scope.treeUserProfile.user_info.id;
      }
      const updatePromise = profileService.updateProfile(userId || $scope.treeUserProfile.id, {user: $scope.currentForm.user})
        .then(function(response) {
          notification.add('RELATIVE_ADDED_SUCCESS_MSG');
          return addUpdateDone(response);
        });
      $scope.currentForm.promises.push(updatePromise);
      return $scope.currentForm.promises;
    };
    $scope.$on('$destroy', function() {
      uploader = null;
    });
  });
