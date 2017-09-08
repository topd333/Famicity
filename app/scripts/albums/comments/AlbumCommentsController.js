// @flow weak

angular.module('famicity')
  .controller('AlbumsCommentsController', function(
    $rootScope, $scope, $stateParams, ModalManager, $state,
    Album, permissionService, oldPermissionService, me, album) {
    'use strict';

    // TODO: Remove
    $scope.userId = me.id;
    $scope.user = me;

    $scope.viewedUserId = $stateParams.user_id;
    $scope.albumId = album.id;

    // TODO: Remove
    $scope.objectId = album.id;
    // TODO: Remove
    $scope.objectType = 'album';

    $scope.album = album;
    $scope.album.type = $scope.objectType;

    $scope.object = $scope.album;

    $scope.showCommentsView = true;
    if (oldPermissionService.isInit() === false) {
      oldPermissionService.init('album', 'show', $stateParams.album_id);
    }
    permissionService.getPermissions('album', $stateParams.album_id).then(function(result) {
      $scope.permissions = result.user_permissions.concat(result.group_permissions);
      $scope.exclusions = result.user_exclusions.concat(result.group_exclusions);
    });

    $scope.openAddPhotoOptionsPopup = function() {
      return ModalManager.open({
        templateUrl: '/scripts/albums/add/AlbumAddPhotos.html',
        controller: 'AlbumAddPhotosController',
        scope: $scope
      });
    };

    $scope.goToEditPage = function() {
      $state.go('u.albums-update', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
    };

    $scope.goToEditRightsPage = function() {
      $state.go('u.albums-update', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
    };
  });
