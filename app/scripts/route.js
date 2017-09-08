// @flow weak

angular.module('famicity')
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
  'use strict';
  const log = debug('fc-route');

  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode(true);
  $uiViewScrollProvider.useAnchorScroll();

  const feedPromise = (userService, me) => userService.feed({user_id: me.id});
  const currentStoryPromise = Story => Story.current().$promise;
  const birthdayPromise = (userService, me) => userService.nextBirthdays(me.id);
  const nextEventsPromise = (userService, me) => userService.nextEvents(me.id);
  const lastConnectedPromise = (userService, me) => userService.lastConnected(me.id);

  // User state: needs authentication
  // All user states need to inherit this state
  $stateProvider
  .state('u', {
    abstract: true,
    resolve: {
      me: (sessionManager, $q, userInitializerManager) => $q((resolve, reject) => {
        const user = sessionManager.getUser();
        // $translate.use(sessionManager.getLocale());
        if (user != null) {
          if (!Bugsnag.user || Bugsnag.user.id !== user.userId) {
            Bugsnag.user = {id: user.userId};
          }
          userInitializerManager.initialize()
          .then(function(user) {
            const userFromContent = angular.copy(user.infos);
            Bugsnag.user.name = userFromContent.user_name;
            resolve(userFromContent);
          })
          .catch(function(ex) {
            log('did not initialize: %o', ex);
            resolve({
              id: user.userId,
              settings: {id: user.settingsId}
            });
          });
          // remove afklImageContainer for feed lazy load
          const scroll = angular.element('#scroll');
          angular.element.removeData(scroll, 'afklImageContainer');
        } else {
          reject({
            cause: 'not-authenticated'
          });
        }
      })
    },
    data: {
      auth: true
    }
  })
  .state('u.404', {
    url: '/users/:user_id/404',
    views: {
      '@': {
        templateUrl: '/views/internal/404.html',
        controller: 'Error404PrivateController'
      }
    },
    data: {
      stateClass: 'not_found'
    }
  })
  .state('u.500', {
    url: '/users/:user_id/500',
    views: {
      '@': {
        templateUrl: '/views/internal/500.html',
        controller: 'Error500PrivateController'
      }
    },
    data: {
      stateClass: 'server_error'
    }
  })
  .state('user-likes', {
    parent: 'u',
    url: '/users/:user_id/likes',
    views: {
      '@': {
        templateUrl: '/views/internal/user-likes.html',
        controller: 'UserLikesController'
      }
    },
    ncyBreadcrumb: {
      label: '{{ \'THEY_LIKE_USER_ARRIVAL\' | translate: {gender: user.sex} : \'messageformat\' }}'
    }
  })
  .state('comment-likes', {
    parent: 'u',
    url: '/users/:user_id/comments/:comment_id/likes',
    views: {
      '@': {
        templateUrl: '/views/internal/comment-likes.html',
        controller: 'CommentLikesController'
      }
    },
    ncyBreadcrumb: {
      label: '{{ \'THEY_LIKE_COMMENT\' | translate }}'
    }
  })
  .state('u.search', {
    url: '/search?q',
    views: {
      '@': {
        templateUrl: '/views/home/search.html',
        controller: 'SearchController'
      }
    },
    resolve: {
      isFeedPage: () => false,
      search: (User, $stateParams) => User.search({q: $stateParams.q, page: 1}).$promise,
      menu: (menuBuilder) => menuBuilder.newMenu().build()
    },
    ncyBreadcrumb: {
      label: '{{ \'SEARCH.TITLE\' | translate}}'
    },
    data: {
      stateClass: 'search'
    }
  })
  .state('u.home', {
    url: '/home',
    views: {
      '@': {
        templateUrl: '/scripts/home/home.html',
        controller: 'HomeController'
      }
    },
    resolve: {
      isFeedPage() {
        return !isMobile.phone;
      },
      elements: !isMobile.phone ? feedPromise : () => [],
      currentStory: !isMobile.phone ? currentStoryPromise : () => null,
      birthdays: !isMobile.phone ? birthdayPromise : () => [],
      nextEvents: !isMobile.phone ? nextEventsPromise : () => [],
      lastConnected: !isMobile.phone ? lastConnectedPromise : () => [],
      menu: (menuBuilder) => menuBuilder.newMenu().withTitle(' ').build()
    },
    data: {
      stateClass: 'home'
    }
  })
  .state('u.feed', {
    url: '/feed',
    views: {
      '@': {
        templateUrl: '/scripts/home/home.html',
        controller: 'HomeController'
      }
    },
    resolve: {
      isFeedPage(menuBuilder, $stateParams, navigation) {
        const userId = $stateParams.user_id;
        const addAction = {
          onActive() {
            navigation.go('u.blog-add', {user_id: userId});
          },
          label: '+'
        };
        menuBuilder.newMenu().withTitle('NEWS').withAction(addAction).build();

        return true;
      },
      elements: feedPromise,
      currentStory: currentStoryPromise,
      birthdays: birthdayPromise,
      nextEvents: nextEventsPromise,
      lastConnected: lastConnectedPromise,
      menu: (menuBuilder) => menuBuilder.newMenu().withTitle(' ').build()
    },
    data: {
      stateClass: 'feed'
    }
  })
  .state('delete-user', {
    parent: 'u',
    url: '/users/:user_id/destroy',
    views: {
      '@': {
        templateUrl: '/views/internal/delete-user.html',
        controller: 'InternalDeleteUserController'
      }
    }
  })
  .state('permission-object', {
    parent: 'u',
    url: '/users/:user_id/permission/:location_type/edit?permission_type&form_key&tab',
    views: {
      '@': {
        templateUrl: '/scripts/common/permission/add/OldPermissionAdd.html',
        controller: 'OldPermissionAddController'
      }
    },
    resolve: {
      menu: (menuBuilder, pubsub, PUBSUB) => menuBuilder.newMenu().withAction({
        label: 'OK',
        style: 'action-submit',
        onActive: () => pubsub.publish(PUBSUB.PERMISSION.ADD.SUBMIT)
      }).build()
    },
    ncyBreadcrumb: {
      label: '{{ pageTitleKey | translate}}'
    },
    data: {
      authorizedFormRoutes: [
        'add_post', 'edit_post', 'add_album', 'edit_album', 'add_event', 'edit_event', 'add_msg', 'default_rights',
        'tree_rights'
      ],
      stateClass: 'permissions edit'
    }
  })
  .state('user-birthdays', {
    parent: 'u',
    url: '/users/:user_id/birthdays',
    views: {
      '@': {
        templateUrl: '/scripts/feed/birthdays/Birthdays.html',
        controller: 'BirthdaysController'
      }
    },
    resolve: {
      menu: (menuBuilder) => menuBuilder.newMenu().build()
    },
    ncyBreadcrumb: {
      // label: '<span class="wcs-g-icon wcs-g-icon-green"><i class="fa fa-gift"></i></span> {{ \'BIRTHDAYS_TO_COME\' |translate }}'
      label: '{{ \'BIRTHDAYS_TO_COME\' |translate }}'
    }
  })
  .state('user-notifications', {
    parent: 'u',
    url: '/users/:user_id/notifications',
    views: {
      '@': {
        templateUrl: '/views/internal/notifications-mobile.html',
        controller: 'UserNotificationsController'
      }
    },
    data: {
      stateClass: 'user-notifications'
    }
  })
  .state('u.sign-out', {
    url: '/users/sign-out',
    views: {
      '@': {
        template: 'Déconnexion...',
        controller($scope, sessionManager, navigation, Session) {
          Session.logout().then(function() {
            navigation.go('public.sign-out', {locale: sessionManager.getLocale()});
          });
        }
      }
    },
    data: {
      stateClass: 'private sign-out'
    }
  });
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise(function($injector) {
    $injector.invoke(function($location, $rootScope, $state, sessionManager, notification) {
      const log = debug('fc-router');
      log('404 when entering %o', $location.path());
      Bugsnag.notify('404', 'Trying to access unknown route', {
        route: $location.path(),
        user: sessionManager.getUser()
      }, 'info');
      var userId = sessionManager.getUserId();
      if (sessionManager.getToken() && userId) {
        $rootScope.notifications = notification.list;
        $state.go('u.404', {user_id: userId});
      } else {
        window.location.href = '/404';
      }
    });
  });
});
