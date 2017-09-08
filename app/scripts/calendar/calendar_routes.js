angular.module('famicity.calendar', [])
  .config(function($stateProvider) {
    'use strict';

    $stateProvider
      .state('u.calendar', {
        url: '/u/calendar',
        views: {
          '@': {
            controller(windowSizeNotification, navigation) {
              if (windowSizeNotification.isMobile() === false) {
                navigation.go('u.calendar.week', {week: moment().isoWeek(), year: moment().year()});
              } else {
                navigation.go('u.calendar.month', {month: moment().month(), year: moment().year()});
              }
            }
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'HEADER.DIARY\' |translate }}'
        }
      })
      .state('u.calendar.week', {
        url: '/year/:year/week/:week?day',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/week/CalendarWeek.html',
            controller: 'CalendarWeekController'
          }
        },
        resolve: {
          menu: (Album, $stateParams, navigation, menuBuilder, $q, $moment) => {
            return $q((resolve) => {
              const userId = $stateParams.user_id;
              const addAction = {
                onActive: () => navigation.go('u.event-add', {user_id: userId}),
                label: '+'
              };
              const todayAction = {
                onActive: () => navigation.go('u.calendar.week', {week: $moment().week(), year: $moment().year()}),
                icon: 'fa fa-calendar-o'
              };
              resolve(menuBuilder.newMenu().withTitle('HEADER.DIARY').withAction(todayAction).withAction(addAction).build()
              );
            });
          }
        },
        data: {
          stateClass: 'calendar'
        }
      })
      .state('u.calendar.month', {
        url: '/year/:year/month/:month',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/month/CalendarMonth.html',
            controller: 'CalendarMonthController'
          }
        },
        resolve: {
          menu($stateParams, navigation, menuBuilder, $q, $moment) {
            return $q(function(resolve) {
              const userId = $stateParams.user_id;
              const addAction = {
                onActive() {
                  navigation.go('u.event-add', {user_id: userId});
                },
                label: '+'
              };
              const todayAction = {
                onActive() {
                  navigation.go('u.calendar.month', {month: $moment().month(), year: $moment().year()});
                },
                icon: 'fa fa-calendar-o'
              };
              resolve(menuBuilder.newMenu().withTitle('HEADER.DIARY').withAction(todayAction).withAction(addAction).build());
            });
          }
        },
        data: {
          stateClass: 'calendar'
        }
      })
      .state('u.event-add', {
        url: '/events/add?day&hour&week&all_day',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/events/add/EventAdd.html',
            controller: 'EventAddController'
          }
        },
        resolve: {
          menu: (menuBuilder, pubsub, PUBSUB) => menuBuilder.newMenu().withAction({
            label: 'Ok',
            style: 'action-add',
            onActive: () => pubsub.publish(PUBSUB.CALENDAR.ADD.SUBMIT)
          }).build()
        },
        ncyBreadcrumb: {
          parent: 'u.calendar',
          label: '{{ \'NEW_EVENT\' |translate }}'
        },
        data: {
          stateClass: 'calendar event add',
          authorizedFormRoutes: ['add_event']
        }
      })
      .state('u.event-show', {
        url: '/events/:event_id?back_action',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/events/show/EventShow.html',
            controller: 'EventShowController'
          }
        },
        resolve: {
          event: (
            me, calendarService, $stateParams, $q, menuBuilder, navigation, notification,
            yesnopopin, Event) => $q((resolve) => {
              const userId = me.id;
              calendarService.getEvent($stateParams.event_id, userId).then((event) => {
                const menu = menuBuilder.newMenu();
                if (event.permissions.is_updatable) {
                  const commentAction = {
                    style: 'fc-comments-count',
                    templateUrl: '/scripts/common/toolbar/choice/comment/commentToolbarChoice.html',
                    scope: {
                      object: event
                    },
                    onActive: () => {
                      // navigation.go('u.albums-update', {user_id: userId, album_id: event.id});
                    }
                  };
                  menu.withAction(commentAction);

                  const likeAction = {
                    style: 'fc-like',
                    templateUrl: '/scripts/common/toolbar/choice/like/likeToolbarChoice.html',
                    scope: {
                      object: event
                    }
                  };
                  menu.withAction(likeAction);

                  const editAction = {
                    tooltip: 'calendar.SHOW.EDIT',
                    icon: 'fa fa-pencil-square-o',
                    onActive: () => navigation.go('u.event-edit', {user_id: userId, event_id: event.id})
                  };
                  menu.withAction(editAction);

                  const addAlbumAction = {
                    tooltip: 'calendar.SHOW.ADD_ALBUM',
                    label: '+',
                    onActive: () => navigation.go('u.albums-create', {user_id: userId, event_id: event.id})
                  };
                  menu.withAction(addAlbumAction);

                  const deleteAction = {
                    tooltip: 'calendar.SHOW.DELETE',
                    icon: 'fa fa-trash-o',
                    onActive: () => {
                      yesnopopin.open('DELETE_EVENT_CONFIRMATION_POPUP_TITLE').then(() => {
                        Event.delete({user_id: userId, event_id: event.id}).$promise.then(() => {
                          notification.add('EVENT_DELETED_SUCCESS_MSG');
                          navigation.go('u.calendar', {user_id: userId});
                        });
                      });
                    },
                    style: 'wcs-g-icon-red-rollover'
                  };
                  menu.withAction(deleteAction);
                }
                menu.build();
                resolve(event);
              });
            })
        },
        ncyBreadcrumb: {
          parent: 'u.calendar',
          label: '{{ \'EVENT\' |translate }}'
        }
      }).state('u.event-likes', {
        url: '/events/:event_id/likes',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/events/likes/EventLikes.html',
            controller: 'EventLikesController'
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.event-show',
          label: '{{ \'THEY_LIKE_EVENT\' |translate }}'
        }
      })
      .state('u.event-edit', {
        url: '/events/:event_id/edit?tab',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/events/edit/EventEdit.html',
            controller: 'EventEditController'
          }
        },
        resolve: {
          menu: (menuBuilder, pubsub, PUBSUB) => menuBuilder.newMenu().withAction({
            label: 'Ok',
            style: 'action-edit',
            onActive: () => pubsub.publish(PUBSUB.CALENDAR.EDIT.SUBMIT)
          }).build()
        },
        ncyBreadcrumb: {
          parent: 'u.calendar',
          label: '{{ \'EDIT_EVENT\' |translate }}'
        },
        data: {
          stateClass: 'calendar event edit',
          authorizedFormRoutes: ['edit_event']
        }
      })
      .state('u.event-list-invitations', {
        url: '/events/:event_id/invitations?invit_type',
        views: {
          '@': {
            templateUrl: '/scripts/calendar/events/invited/EventInvited.html',
            controller: 'EventInvitedController'
          }
        },
        resolve: {
          menu(menuBuilder, calendarService, $stateParams, navigation, me) {
            const userId = me.id;
            calendarService.getEvent($stateParams.event_id, userId).then((event) => {
              const menu = menuBuilder.newMenu();
              if (event.permissions.is_updatable) {
                menu.withAction({
                  label: '+',
                  onActive: () => navigation.go('u.event-edit', {event_id: event.id})
                });
              }
              menu.build();
            });
          }
        },
        ncyBreadcrumb: {
          parent: 'u.event-show',
          label: '{{ \'EVENT_GUESTS_\' + invitType.toUpperCase() |translate }}'
        }
      });
  });
