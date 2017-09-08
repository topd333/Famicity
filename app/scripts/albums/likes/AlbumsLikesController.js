angular.module('famicity')
  .controller('AlbumsLikesController', function(
    $scope, $stateParams, $translate, Like, Permission,
    Album, sessionManager, oldPermissionService, LoadingAnimationUtilService, me) {
    'use strict';

    var object_type;
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    object_type = 'album';
    LoadingAnimationUtilService.resetPromises();
    LoadingAnimationUtilService.activate();
    $scope.albumId = $stateParams['album_id'];
    if ($scope.viewedUserId === $scope.userId) {
      $scope.likeText = 'LIKED_YOUR_ALBUM';
    } else {
      $scope.likeText = 'LIKED_OTHER_ALBUM';
    }
    $scope.likesView = true;
    $scope.likesList = Like.query({
      object_type: object_type,
      object_id: $scope.albumId
    });
    if (oldPermissionService.isInit() === false) {
      oldPermissionService.init(object_type, 'show', $stateParams['album_id']);
    }
    $scope.album = Album.get({
      user_id: $scope.viewedUserId,
      album_id: $scope.albumId
    });
    LoadingAnimationUtilService.addPromises($scope.album.$promise);
    Permission.get({
      object_type: 'album',
      object_id: $stateParams['album_id']
    }).$promise.then(function(result) {
        $scope.permissions = result.permissions.user_permissions.concat(result.permissions.group_permissions);
        $scope.exclusions = result.permissions.user_exclusions.concat(result.permissions.group_exclusions);
      });
    LoadingAnimationUtilService.validateList();
  });
