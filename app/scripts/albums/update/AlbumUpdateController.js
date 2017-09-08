angular.module('famicity.album')
  .controller('AlbumUpdateController', function(
    $scope, $state, $stateParams, ModalManager,
    $location, $filter, $q, Album, EventResourceService, yesnopopin,
    Permission, notification, me, permissionService, postService, $moment) {
    'use strict';
    const log = debug('fc-AlbumUpdateController');

    $scope.me = me;
    const authorId = me.id;
    const editedAlbumId = $stateParams.album_id;

    $scope.formStatus = {isEditing: true, show: {formTypes: false, photo: false}};
    $scope.viewedUserId = $stateParams.user_id;
    $scope.submitted = false;
    $scope.formInProgress = false;

    $scope.requiredFields = {
      title: 'album.REQUIRED.TITLE'
    };

    /**
     * Start editing an album.
     *
     * @param albumId The id of the album
     * @param userId The id of the editing user
     * @returns {*}
     */
    const editAlbum = (albumId, userId) => {
      const defer = $q.defer();
      Album.edit({
        // TODO: Remove once removed on backend
        user_id: userId,
        album_id: albumId
      }).$promise.then((editCopy) => {
        log('editPost: ok %o', editCopy);
        if (editCopy.event_date) {
          editCopy.event_date = $moment.fromServer(editCopy.event_date).toDate();
        }
        Permission.get({
          object_type: 'album',
          object_id: albumId
        }).$promise.then((response) => {
          log('Permission;get: ok %o', response.permissions);
          editCopy.send_notifications = false;
          editCopy.permissions = permissionService.toPermissionList(response.permissions);
          defer.resolve({object: editCopy});
        });
      });
      return defer.promise;
    };
    // Immediate edition
    editAlbum(editedAlbumId, authorId)
      // Get latest editable state
      .then((response) => {
        $scope.object = response.object;
        // TODO: Unify property names
        $scope.object.textValue = $scope.object.description;
        $scope.object.htmlValue = $scope.object.description;
        $scope.editCopy = angular.extend({}, $scope.object);
        $scope.album = $scope.object;
      });

    /**
     * Commits an album edition.
     *
     * @param inlineData
     * @param textVal
     * @param userId
     * @param required
     * @returns {*}
     */
    $scope.updateAlbum = (inlineData, textVal, userId, required) => {
      const deferred = $q.defer();
      $scope.submitted = true;
      const album = {
        id: inlineData.id,
        description: textVal,
        title: inlineData.title,
        location: inlineData.location,
        send_notifications: inlineData.send_notifications,
        event_date: inlineData.event_date && $moment(inlineData.event_date).forServer(),
        permissions: inlineData.permissions,
        type: 'album'
      };
      const albumId = album.id;
      postService.warnAbout(album, required).then((album) => {
        $q.all([
          Album.update({user_id: userId, album_id: albumId}, album).$promise,
          permissionService.update(album, inlineData.permissions)
        ]).then((results) => {
          const updatedAlbum = results[0];
          log('Album.update: ok %o', updatedAlbum);
          updatedAlbum.htmlValue = updatedAlbum.description;

          // const permissionResponse = results[2];
          inlineData.permissions = angular.extend(inlineData.permissions, album.permissions);

          notification.add('ALBUM_EDITED_SUCCESS_MSG');
          deferred.resolve(updatedAlbum);
          $state.go('u.albums-show', {user_id: $scope.viewedUserId, album_id: albumId}, {reload: true});
        }).catch(function(errors) {
          log('updateAlbum: failed %o', errors);
          notification.add('fc-feed-album.EDIT_FAILED', {warn: true});
          deferred.reject(errors);
        });
      }).catch(function(error) {
        log('Could not update album: %o', error);
        deferred.reject();
      });
      return deferred.promise;
    };

    /**
     * Commits an album deletion.
     */
    $scope.deleteAlbum = () => {
      yesnopopin.open('DELETE_ALBUM_CONFIRMATION_POPUP_TITLE', {
        yes: 'album.DELETE.CONFIRMATION_POPUP.SUBMIT',
        yesClass: 'btn-danger'
      }).then(() => {
        const albumId = $scope.album.id;
        Album.delete({
          user_id: me.id,
          album_id: albumId
        })
          .$promise.then(() => {
            log('deletePost ok');
            notification.add('ALBUM_DELETED_SUCCESS_MSG');
            if ($scope.onRemove) {
              $scope.onRemove({postId: albumId});
            }
            $state.go('u.albums-index', {user_id: $scope.viewedUserId});
          })
          .catch(function(error) {
            log('deletePost failed %o', error);
            notification.add('fc-feed-album.DELETE_FAILED');
          });
      });
    };
  });
