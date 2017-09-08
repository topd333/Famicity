angular.module('famicity')
  .controller('AlbumPhotosOrderController', (
    $rootScope, $scope, $stateParams, navigation, $moment,
    Album, Photo, Permission, oldPermissionService, notification, me, pubsub, PUBSUB) => {
      'use strict';

      $scope.userId = me.id;
      $scope.viewedUserId = $stateParams.user_id;
      $scope.albumId = $stateParams.album_id;
      $scope.album = Album.get({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId
      });
      $scope.photos = Photo.query({
        user_id: $scope.viewedUserId,
        album_id: $scope.albumId
      });
      $scope.sortableOptions = {
        change() {}
      };
      $scope.goToEditPage = function() {
        navigation.go('u.albums-update', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
      };
      $scope.goToEditRightsPage = function() {
        navigation.go('u.albums-update', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
      };
      if (oldPermissionService.isInit() === false) {
        oldPermissionService.init('album', 'show', $stateParams.album_id);
      }
      Permission.get({
        object_type: 'album',
        object_id: $stateParams.album_id
      }).$promise.then((result) => {
        $scope.permissions = result.permissions.user_permissions.concat(result.permissions.group_permissions);
        $scope.exclusions = result.permissions.user_exclusions.concat(result.permissions.group_exclusions);
      });

      $scope.confirmOrder = function() {
        console.log($scope.photos);
        let orderedString = '';
        angular.forEach($scope.photos, function(value) {
          if (orderedString !== '') {
            orderedString += ',';
          }
          orderedString += value.id;
        });
        Album.confirm_order({
          user_id: $scope.viewedUserId,
          album_id: $scope.albumId
        }, {
          order: orderedString
        }).$promise.then(function() {
            notification.add('ALBUM_SORTED_SUCCESS_MSG');
            navigation.go('u.albums-show', {user_id: $scope.viewedUserId, album_id: $scope.albumId});
          });
      };
      pubsub.subscribe(PUBSUB.ALBUM.REORDER.SUBMIT, $scope.confirmOrder, $scope);
    });
