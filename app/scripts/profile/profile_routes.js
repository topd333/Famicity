angular.module('famicity').config(function($stateProvider) {
  'use strict';
  // User state: needs authentication
  // All user states need to inherit this state

  const avatarPromise = (Avatar, $stateParams) => Avatar.get({
    user_id: $stateParams.user_id,
    avatar_id: $stateParams.photo_id
  }).$promise;
  const profilePromise = ($stateParams, profileService) => profileService.get($stateParams.user_id);

  $stateProvider
    .state('u.profile', {
      url: '/profile/:user_id',
      views: {
        '@': {
          templateUrl: '/scripts/profile/show/ProfileShow.html',
          controller: 'ProfileShowController'
        }
      },
      resolve: {
        profile: (menuBuilder, navigation, profileService, $stateParams, $q) => {
          return $q(function(resolve) {
            const userId = $stateParams.user_id;
            profilePromise($stateParams, profileService).then((basicProfile) => {
              const menu = menuBuilder.newMenu().withTitle('PROFILE.TITLE');
              const isUpdatable = basicProfile.permissions && basicProfile.permissions.is_updatable;
              if (isUpdatable) {
                menu.withAction({
                  onActive: () => navigation.go('u.profile-edit', {user_id: userId}),
                  icon: 'fa fa-edit'
                });
              }
              menu.build();
              resolve(basicProfile);
            });
          });
        }
      },
      data: {
        stateClass: 'profile'
      },
      ncyBreadcrumb: {
        label: '{{ basicProfile.user_name }}'
      }
    })
    .state('u.profile-comments', {
      url: '/users/:user_id/comments?show_comments',
      views: {
        '@': {
          templateUrl: '/views/profile/user_comments.html',
          controller: 'UserCommentsController'
        }
      },
      ncyBreadcrumb: {
        label: '{{ \'COMMENTS_LINK\' | translate }}'
      }
    })
    .state('u.profile-edit', {
      url: '/profile/:user_id/edit',
      views: {
        '@': {
          templateUrl: '/scripts/profile/edit/ProfileEdit.html',
          controller: 'ProfileEditController'
        }
      },
      resolve: {
        profile: ($stateParams, Profile, menuBuilder, PUBSUB, pubsub) => {
          const confirmEditAction = {
            label: 'SUBMIT',
            style: 'action-submit',
            onActive: () => pubsub.publish(PUBSUB.PROFILE.EDIT.SUBMIT)
          };
          menuBuilder.newMenu().withAction(confirmEditAction);
          return Profile.edit({user_id: $stateParams.user_id}).$promise;
        }
      },
      ncyBreadcrumb: {
        label: '{{ breadcrumbTitle }}'
      },
      data: {
        stateClass: 'profile edit'
      }
    })
    .state('u.profile-photos', {
      parent: 'u',
      url: '/profile/:user_id/photos',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/ProfilePhotos.html',
          controller: 'ProfilePhotosController'
        }
      },
      resolve: {
        profile: ($q, $rootScope, menuBuilder, $stateParams, me, profileService, ModalManager, PUBSUB, pubsub) => {
          return $q((resolve) => {
            profilePromise($stateParams, profileService).then((profile) => {
              const menu = menuBuilder.newMenu().withAction({
                // tooltip: 'profile.SHOW.PHOTO.SLIDE_SHOW',
                icon: 'fa fa-play-circle-o',
                onActive: () => pubsub.publish(PUBSUB.PROFILE.SHOW.PHOTO.SLIDE_SHOW)
              });
              if (profile.permissions.is_updatable) {
                menu.withAction({
                  label: '+',
                  onActive() {
                    const photoAddScope = $rootScope.$new();
                    photoAddScope.viewedUserId = $stateParams.user_id;
                    ModalManager.open({
                      templateUrl: '/scripts/profile/photo/add/ProfilePhotoAdd.html',
                      controller: 'ProfilePhotoAddController',
                      scope: photoAddScope
                    });
                  }
                });
              }
              menu.build();
              resolve(profile);
            });
          });
        }
      },
      ncyBreadcrumb: {
        label: '{{ \'PROFILE_PHOTOS\' | translate }}'
      }
    })
    .state('u.profile-photos-item', {
      url: '/profile/:user_id/photos/item/:photo_id?show_comments',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/item/ProfilePhotosItem.html',
          controller: 'ProfilePhotosItemController'
        }
      },
      resolve: {
        profile: profilePromise,
        avatar: (
          $q, Avatar, $stateParams, photoMenuService, PUBSUB, me, profile) => $q(function(resolve) {
            avatarPromise(Avatar, $stateParams).then((photo) => {
              photoMenuService.build(photo, PUBSUB.PROFILE.SHOW.PHOTO, profile.permissions.is_updatable);
              resolve(photo);
            });
          })
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos',
        label: '{{ \'PHOTO\' | translate }}'
      }
    })
    .state('u.profile-photos-item-fullscreen', {
      url: '/profile/:user_id/photos/item/:photo_id/fullscreen{root:(?:/[^/]+)?}',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/item/ProfilePhotosItem.html',
          controller: 'ProfilePhotosItemController'
        }
      },
      resolve: {
        avatar: avatarPromise
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos',
        label: '{{ \'PHOTO\' | translate }}'
      }
    })
    .state('u.profile-photos-item-comments', {
      url: '/profile/:user_id/photos/item/:photo_id/comments?show_comments',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/item/ProfilePhotosItem.html',
          controller: 'ProfilePhotosItemController'
        }
      },
      resolve: {
        avatar: avatarPromise
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos',
        label: '{{ \'PROFILE_PHOTOS\' |translate }}'
      }
    })
    .state('user-avatars-likes', {
      parent: 'u',
      url: '/users/:user_id/avatars/:photo_id/likes',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/likes/ProfilePhotoLikes.html',
          controller: 'ProfilePhotoLikesController'
        }
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos-item',
        label: '{{ \'THEY_LIKE_AVATAR\' |translate }}'
      }
    })
    .state('u.profile-photos-crop', {
      url: '/profile/:user_id/photos/crop/:photo_id',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/crop/ProfilePhotoCrop.html',
          controller: 'ProfilePhotoCropController'
        }
      },
      resolve: {
        avatar: avatarPromise,
        redirect: (avatar, avatarService, navigation, $stateParams, $q, LoadingAnimationUtilService) => {
          const userId = $stateParams.user_id;
          if (!avatar.used_avatar) {
            avatarService.setAsProfileImage(userId, $stateParams.photo_id)
            .then(function() {
              navigation.go('u.profile-photos', {user_id: userId}, {reload: true});
            });
          } else {
            navigation.go('u.profile-photos', {user_id: userId}, {reload: true});
          }
          LoadingAnimationUtilService.deactivate();
          return $q.reject({cause: 'redirect'});
        }
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos',
        label: '{{ \'ADJUSTMENTS\' |translate }}'
      }
    })
    .state('u.profile-photos-webcam', {
      url: '/users/:user_id/profile/photos/webcam',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/webcam/ProfilePhotosWebcam.html',
          controller: 'ProfilePhotosWebcamController'
        }
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos',
        label: '{{ \'WEBCAM\' |translate }}'
      }
    })
    .state('u.profile-photos-gallery', {
      url: '/profile/:user_id/photos/gallery',
      views: {
        '@': {
          templateUrl: '/scripts/profile/photo/gallery/ProfilePhotosGallery.html',
          controller: 'ProfilePhotosGalleryController'
        }
      },
      ncyBreadcrumb: {
        parent: 'u.profile-photos',
        label: '{{ \'MY_GALLERY\' |translate }}'
      }
    })
    .state('u.profile-passions', {
      url: '/profile/:user_id/passions',
      views: {
        '@': {
          templateUrl: '/scripts/users/infos/views/user_infos_update.html',
          controller: 'UserInfosUpdateController'
        }
      },
      ncyBreadcrumb: {
        label: '{{ \'PROFILE_PASSIONS_EDIT_PAGE_TITLE\' | translate }}'
      }
    });
});
