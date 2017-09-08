const newAlbumCreation = {
  templateUrl: '/scripts/albums/create/AlbumCreate.html',
  controller: 'AlbumCreateController'
};
const newAlbumUpdate = {
  templateUrl: '/scripts/albums/update/AlbumUpdate.html',
  controller: 'AlbumUpdateController'
};

angular.module('famicity.album', [])
  .constant('appConfig', {
    album: {
      create: newAlbumCreation,
      update: newAlbumUpdate
    }
  })
  .service('photoMenuService', (menuBuilder, pubsub) => {
    'use strict';

    return {
      build(photo, rootMessage, isUpdatable) {
        const menu = menuBuilder.newMenu();
        const commentAction = {
          style: 'fc-comments-count',
          templateUrl: '/scripts/common/toolbar/choice/comment/commentToolbarChoice.html',
          scope: {
            object: photo
          },
          onActive: () => {
            // navigation.go('u.albums-update', {user_id: userId, album_id: album.id});
          }
        };
        menu.withAction(commentAction);

        const likeAction = {
          style: 'fc-like',
          templateUrl: '/scripts/common/toolbar/choice/like/likeToolbarChoice.html',
          scope: {
            object: photo
          }
        };
        menu.withAction(likeAction);

        const previousAction = {
          // tooltip: 'album.SHOW.PHOTO.PREVIOUS',
          icon: 'fa fa-angle-left',
          onActive: () => pubsub.publish(rootMessage.PREVIOUS)
        };
        menu.withAction(previousAction);

        const nextAction = {
          // tooltip: 'album.SHOW.PHOTO.NEXT',
          icon: 'fa fa-angle-right',
          onActive: () => pubsub.publish(rootMessage.NEXT)
        };
        menu.withAction(nextAction);

        const slideShowAction = {
          tooltip: 'album.SHOW.PHOTO.SLIDE_SHOW',
          icon: 'fa fa-play-circle-o',
          onActive: () => pubsub.publish(rootMessage.SLIDE_SHOW)
        };
        menu.withAction(slideShowAction);

        if (isUpdatable) {
          const rotateLeftAction = {
            tooltip: 'album.SHOW.PHOTO.ROTATE_LEFT',
            icon: 'fa fa-reply',
            onActive: () => pubsub.publish(rootMessage.ROTATE_LEFT)
          };
          menu.withAction(rotateLeftAction);

          const rotateRightAction = {
            tooltip: 'album.SHOW.PHOTO.ROTATE_RIGHT',
            icon: 'fa fa-share',
            onActive: () => pubsub.publish(rootMessage.ROTATE_RIGHT)
          };
          menu.withAction(rotateRightAction);

          const deleteAction = {
            tooltip: 'album.SHOW.PHOTO.DELETE',
            icon: 'fa fa-trash-o',
            onActive: () => pubsub.publish(rootMessage.DELETE),
            style: 'wcs-g-icon-red-rollover'
          };
          menu.withAction(deleteAction);
        }
        return menu.build();
      }
    };
  })
  .config(function($stateProvider, appConfig) {
    'use strict';

    const albumPromise = function(Album, $stateParams) {
      return Album.get({
        user_id: $stateParams.user_id,
        album_id: $stateParams.album_id
      }).$promise;
    };

    const photoPromise = function(Photo, $stateParams) {
      return Photo.get({
        user_id: $stateParams.user_id,
        album_id: $stateParams.album_id,
        photo_id: parseInt($stateParams.photo_id, 10)
      }).$promise;
    };

    function albumMenu(menuBuilder, albums, basicProfile, navigation, userId) {
      const menu = menuBuilder.newMenu();
      if (albums.length > 0 && basicProfile.permissions.is_updatable) {
        const addAction = {
          onActive() {
            navigation.go('u.albums-create', {user_id: userId});
          },
          label: '+',
          tooltip: 'ADD_ALBUM'
        };
        menu.withAction(addAction);
      }
      return menu.build();
    }

    return $stateProvider
      .state('u.albums-index', {
        url: '/users/:user_id/albums',
        views: {
          '@': {
            templateUrl: '/scripts/albums/controllers/AlbumsIndex.html',
            controller: 'AlbumsIndexController'
          }
        },
        resolve: {
          albums(Album, $stateParams, navigation, menuBuilder, profileService, $q) {
            return $q(function(resolve) {
              const userId = $stateParams.user_id;

              let basicProfile;
              profileService.getShortProfile(userId).then((shortUser) => {
                if (shortUser && shortUser.sex) {
                  shortUser.sex = shortUser.sex.toLowerCase();
                }
                basicProfile = shortUser;
                Album.query({
                  user_id: userId
                }).$promise.then((albums) => {
                  albumMenu(menuBuilder, albums, basicProfile, navigation, userId);
                  resolve(albums);
                });
              });
            });
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'ALBUMS_LINK\' | translate }}'
        }
      })
      .state('u.albums-show', {
        url: '/users/:user_id/albums/:album_id/show',
        views: {
          '@': {
            templateUrl: '/scripts/albums/show/AlbumShow.html',
            controller: 'AlbumShowController'
          }
        },
        resolve: {
          album: (
            $q, menuBuilder, Album, $stateParams, yesnopopin, navigation, notification, ModalManager,
            $rootScope, pubsub, PUBSUB) => $q(function(
            resolve) {
              const userId = $stateParams.user_id;
              albumPromise(Album, $stateParams).then((album) => {
                const menu = menuBuilder.newMenu();
                const commentAction = {
                  style: 'fc-comments-count',
                  templateUrl: '/scripts/common/toolbar/choice/comment/commentToolbarChoice.html',
                  scope: {
                    object: album
                  },
                  onActive: () => {
                    // navigation.go('u.albums-update', {user_id: userId, album_id: album.id});
                  }
                };
                menu.withAction(commentAction);

                const likeAction = {
                  style: 'fc-like',
                  templateUrl: '/scripts/common/toolbar/choice/like/likeToolbarChoice.html',
                  scope: {
                    object: album
                  }
                };
                menu.withAction(likeAction);

                const slideShowAction = {
                  tooltip: 'album.SHOW.SLIDE_SHOW',
                  icon: 'fa fa-play-circle-o',
                  onActive: () => pubsub.publish(PUBSUB.ALBUM.SHOW.SLIDE)
                };
                menu.withAction(slideShowAction);

                if (album.permissions.is_updatable) {
                  const editAction = {
                    tooltip: 'album.EDIT.TOOLTIP',
                    icon: 'fa fa-pencil-square-o',
                    style: 'hidden-xs',
                    onActive: () => navigation.go('u.albums-update', {user_id: userId, album_id: album.id})
                  };
                  menu.withAction(editAction);

                  const addPhotoAction = {
                    tooltip: 'ADD_PICTURES_TITLE',
                    label: '+',
                    onActive: () => {
                      const addPhotoScope = $rootScope.$new();
                      addPhotoScope.viewedUserId = userId;
                      addPhotoScope.albumId = album.id;
                      ModalManager.open({
                        templateUrl: '/scripts/albums/add/AlbumAddPhotos.html',
                        controller: 'AlbumAddPhotosController',
                        scope: addPhotoScope
                      });
                    }
                  };
                  menu.withAction(addPhotoAction);

                  const deleteAction = {
                    tooltip: 'album.DELETE.TOOLTIP',
                    icon: 'fa fa-trash-o',
                    onActive: () => {
                      yesnopopin.open('DELETE_ALBUM_CONFIRMATION_POPUP_TITLE').then(() => {
                        Album.delete({user_id: userId, album_id: album.id}).$promise.then(() => {
                          notification.add('ALBUM_DELETED_SUCCESS_MSG');
                          navigation.go('u.albums-index', {user_id: userId});
                        });
                      });
                    },
                    style: 'wcs-g-icon-red-rollover'
                  };
                  menu.withAction(deleteAction);
                }
                menu.build();
                resolve(album);
              });
            })
        },
        ncyBreadcrumb: {
          parent: 'u.albums-index',
          label: '{{ albumTitle || album.title }}'
        },
        data: {
          stateClass: 'album album-show'
        }
      })
      .state('u.albums-comments', {
        url: '/users/:user_id/albums/:album_id/comments?show_comments',
        views: {
          '@': {
            templateUrl: '/scripts/albums/comments/AlbumComments.html',
            controller: 'AlbumsCommentsController'
          }
        },
        resolve: {
          album: albumPromise
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'COMMENTS.TITLE\' | translate }}'
        }
      })
      .state('u.albums-order', {
        url: '/users/:user_id/albums/:album_id/order',
        views: {
          '@': {
            templateUrl: '/scripts/albums/order/AlbumPhotosOrder.html',
            controller: 'AlbumPhotosOrderController'
          }
        },
        resolve: {
          menu(menuBuilder, pubsub, PUBSUB) {
            return menuBuilder.newMenu().withAction({
              label: 'Ok',
              style: 'action-reorder',
              onActive: () => pubsub.publish(PUBSUB.ALBUM.REORDER.SUBMIT)
            }).build();
          }
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'CHANGE_PHOTOS_ORDER\' | translate }}'
        },
        data: {
          stateClass: 'album reorder'
        }
      })
      .state('u.albums-likes', {
        url: '/users/:user_id/albums/:album_id/likes',
        views: {
          '@': {
            templateUrl: '/scripts/albums/likes/AlbumsLikes.html',
            controller: 'AlbumsLikesController'
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'THEY_LIKE_ALBUM\' | translate }}'
        }
      })
      .state('u.albums-upload', {
        url: '/users/:user_id/albums/:album_id/upload',
        views: {
          '@': {
            templateUrl: '/scripts/albums/add/upload/AlbumsUpload.html',
            controller: 'AlbumsUploadController'
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'PHOTOS_UPLOAD\' | translate }}'
        }
      })
      .state('u.albums-photos-show', {
        url: '/users/:user_id/albums/:album_id/photos/:photo_id',
        views: {
          '@': {
            templateUrl: '/scripts/albums/show/photo/AlbumPhotoShow.html',
            controller: 'AlbumPhotoShowController'
          }
        },
        resolve: {
          album: albumPromise,
          photo: (
            $q, Photo, $stateParams, photoMenuService, PUBSUB, album) => $q(function(resolve) {
              photoPromise(Photo, $stateParams).then((photo) => {
                photoMenuService.build(photo, PUBSUB.ALBUM.SHOW.PHOTO, album.permissions.is_updatable);
                resolve(photo);
              });
            })
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'PHOTO\' | translate }}'
        }
      })
      .state('u.albums-photos-show-fullscreen', {
        url: '/users/:user_id/albums/:album_id/photos/:photo_id/fullscreen?root',
        views: {
          '@': {
            templateUrl: '/scripts/albums/show/photo/AlbumPhotoShow.html',
            controller: 'AlbumPhotoShowController'
          }
        },
        resolve: {
          album: albumPromise,
          photo: photoPromise
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'PHOTO\' | translate }}'
        }
      })
      .state('u.albums-photos-comments', {
        url: '/users/:user_id/albums/:album_id/photos/:photo_id/comments?show_comments',
        views: {
          '@': {
            templateUrl: '/scripts/albums/show/photo/AlbumPhotoShow.html',
            controller: 'AlbumPhotoShowController'
          }
        },
        resolve: {
          album: albumPromise,
          photo: photoPromise
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'COMMENTS.TITLE\' | translate }}'
        }
      })
      .state('u.albums-photos-likes', {
        url: '/users/:user_id/albums/:album_id/photos/:photo_id/likes',
        views: {
          '@': {
            templateUrl: '/scripts/albums/show/photo/likes/AlbumPhotoLikes.html',
            controller: 'AlbumPhotoLikesController'
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.albums-photos-show',
          label: '{{ \'THEY_LIKE_PHOTO\' | translate }}'
        }
      })
      .state('u.albums-create', {
        url: '/users/:user_id/albums/add?event_id',
        views: {
          '@': {
            templateUrl: appConfig.album.create.templateUrl,
            controller: appConfig.album.create.controller
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.albums-index',
          label: '{{ \'CREATE_ALBUM\' | translate }}'
        },
        data: {
          authorizedFormRoutes: ['add_album'],
          stateClass: 'album add'
        }
      })
      .state('u.albums-update', {
        url: '/users/:user_id/albums/:album_id/edit?tab',
        views: {
          '@': {
            templateUrl: appConfig.album.update.templateUrl,
            controller: appConfig.album.update.controller
          }
        },
        ncyBreadcrumb: {
          parent: 'u.albums-show',
          label: '{{ \'EDIT_ALBUM\' | translate }}'
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        data: {
          authorizedFormRoutes: ['edit_album'],
          stateClass: 'album update'
        }
      });
  });
