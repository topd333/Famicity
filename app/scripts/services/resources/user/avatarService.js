angular.module('famicity')
  .service('avatarService', function(
    $rootScope, $location, $filter, notification,
    LoadingAnimationUtilService, $state, Avatar, userInitializerManager) {
    'use strict';
    return {
      getAvatars(user_id, $scope, successCallback) {
        return Avatar.query({user_id}, function(response) {
          $scope.avatars = response;
          if (successCallback) {
            successCallback(response);
          }
        });
      },
      getPreviousAvatar(user_id, avatar_id, $scope, successCallback) {
        return Avatar.get_previous_avatar({user_id, id: avatar_id
        }, function(response) {
          successCallback(response.avatar);
        });
      },
      getNextAvatar(user_id, avatar_id) {
        return Avatar.get_next_avatar({user_id, id: avatar_id}).$promise;
      },
      // showAvatar (user_id, avatar_id) {
      //   return Avatar.get({user_id, avatar_id}).$promise;
      // },
      editAvatar(user_id, avatar_id) {
        return Avatar.edit({user_id, id: avatar_id});
      },
      crop(user_id, avatar_id, coordinates, $scope, successCallback) {
        return new Avatar({
          x: coordinates.x,
          y: coordinates.y,
          w: coordinates.width,
          h: coordinates.height
        }).$crop({
            user_id,
            id: avatar_id
          }, function(response) {
            notification.add('AVATAR_CROPPED_SUCCESS_MSG');
            if (successCallback) {
              return successCallback(response);
            }
          }, function() {
            return LoadingAnimationUtilService.deactivate();
          });
      },
      setAsProfileImage(user_id, avatar_id) {
        return new Avatar().$set_current({
          user_id,
          id: avatar_id
        }, function(response) {
          userInitializerManager.updateAvatar(user_id, response.avatar_url);
          notification.add('AVATAR_SET_AS_PROFILE_IMG');
        });
      },
      update(user_id, avatar_id, attrs, $scope, successCallback) {
        return new Avatar(attrs).$update({user_id, avatar_id}, function(response) {
          notification.add('AVATAR_UPDATED_SUCCESS_MSG');
          $scope.avatar = response.avatar;
          if (successCallback) {
            return successCallback(response);
          }
        }, function() {
          return LoadingAnimationUtilService.deactivate();
        });
      },
      deleteAvatar(user_id, avatar_id) {
        return new Avatar().$delete({user_id, id: avatar_id}, function() {
          notification.add('AVATAR_DELETED_SUCCESS_MSG');
          $state.go('u.profile-photos', {user_id});
        });
      },
      loadSlideshow(user_id, $scope, successCallback) {
        return Avatar.load_slideshow({user_id}, function(response) {
          if (successCallback) {
            return successCallback(response);
          }
        });
      }
    };
  });
