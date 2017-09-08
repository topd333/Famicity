angular.module('famicity')
  .config(function($stateProvider, ROUTE) {
    'use strict';

    function messageMenu(
      message, menuBuilder, navigation, pubsub, PUBSUB, yesnopopin, notification, Message, messageId,
      userId) {
        const menu = menuBuilder.newMenu();

        const addAction = {
          tooltip: 'WRITE_MESSAGE',
          onActive: () => navigation.go('u.messages.add'),
          label: '+'
        };
        menu.withAction(addAction);

        if (message) {
          menu.withAction({
            tooltip: 'ANSWER_MESSAGES',
            onActive: () => pubsub.publish(PUBSUB.MESSAGES.SHOW.REPLY),
            icon: 'fa fa-reply'
          });
          if (message.recipients.length > 1) {
            const showParticipantsAction = {
              tooltip: 'PARTICIPANTS_TOOLTIP_MESSAGES',
              onActive: () => pubsub.publish(PUBSUB.MESSAGES.SHOW_DISCUSSION_PARTICIPANTS),
              icon: 'fa fa-eye'
            };
            menu.withAction(showParticipantsAction);
          }

          const deleteAction = {
            tooltip: 'DELETE_TOOLTIP_MESSAGES',
            onActive: () => {
              yesnopopin.open('DELETE_MESSAGE_CONFIRMATION_POPUP_TITLE').then(() => {
                Message.remove({
                  message_id: messageId,
                  user_id: userId
                }).$promise.then(() => {
                  notification.add('MESSAGE_DELETED_SUCCESS_MSG');
                  navigation.go(ROUTE.MESSAGE.WELCOME, null, {reload: true});
                });
              });
            },
            icon: 'fa fa-trash-o',
            style: 'wcs-g-icon-red-rollover'
          };
          menu.withAction(deleteAction);
        }
        return menu.build();
      }

    $stateProvider
      .state(ROUTE.MESSAGE.ABSTRACT, {
        url: '/messages',
        abstract: true,
        views: {
          '@': {
            templateUrl: '/scripts/messages/messages.html',
            controller: 'MessagesAbstractController'
          }
        }
      })
      .state(ROUTE.MESSAGE.WELCOME, {
        url: '',
        views: {
          message: {
            templateUrl: '/scripts/messages/welcome/MessagesWelcome.html',
            controller: 'MessagesWelcomeController'
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'MY_MESSAGES_TITLE\' | translate }}'
        },
        resolve: {
          menu: (menuBuilder, pubsub, PUBSUB) => {
            menuBuilder.newMenu().withAction({
              tooltip: 'ANSWER_MESSAGES',
              onActive: () => pubsub.publish(PUBSUB.MESSAGES.WRITE),
              icon: 'fc fc-plus'
            }).build();
          }
        }
      })
      .state(ROUTE.MESSAGE.CREATE, {
        url: '/add?groups&users&storyId&defaultPermissions',
        views: {
          message: {
            templateUrl: '/scripts/messages/add/MessageAdd.html',
            controller: 'MessageAddController'
          }
        },
        resolve: {
          story: ($stateParams, Story) => $stateParams.storyId ? Story.get({id: $stateParams.storyId}).$promise : false,
          defaultPermissions: ($stateParams, Permission, me) =>
            $stateParams.defaultPermissions ? Permission.getDefault({user_id: me.id}).$promise : false,
          users: ($stateParams, User) =>
            $stateParams.users ? User.getNames({user_ids: $stateParams.users.toString()}).$promise : false,
          groups: ($stateParams, Group) =>
            $stateParams.groups ? Group.getGroupNames({group_ids: $stateParams.groups.toString()}).$promise : false,
          menu: (menuBuilder) => menuBuilder.newMenu().withTitle('WRITE_MESSAGE').build()
        },
        ncyBreadcrumb: {
          parent: 'u.messages',
          label: '{{ \'WRITE_MESSAGE\' | translate }}'
        },
        data: {
          authorizedFormRoutes: ['add_msg']
        }
      })
      .state(ROUTE.MESSAGE.EMPTY, {
        url: '/empty',
        views: {
          message: {
            templateUrl: '/scripts/messages/empty/MessagesEmpty.html',
            controller: 'MessagesEmptyController'
          }
        },
        resolve: {
          menu: (
            menuBuilder, navigation, pubsub, PUBSUB, yesnopopin,
            notification) => messageMenu(null, menuBuilder, navigation, pubsub, PUBSUB, yesnopopin, notification)
        },
        ncyBreadcrumb: {
          label: '{{ \'MY_MESSAGES_TITLE\' | translate }}'
        },
        data: {
          stateClass: 'empty'
        }
      })
      .state(ROUTE.MESSAGE.GET, {
        url: '/:message_id',
        views: {
          message: {
            templateUrl: '/scripts/messages/show/MessagesShow.html',
            controller: 'MessagesShowController'
          }
        },
        resolve: {
          message: (
            $q, $stateParams, me, navigation, menuBuilder, Message, pubsub, PUBSUB, yesnopopin, notification
            ) => $q(function(resolve) {
                const userId = me.id;
                const messageId = parseInt($stateParams.message_id, 10);
                Message.get({
                  user_id: userId,
                  message_id: messageId
                }).$promise.then(function(response) {
                    const message = response.message;
                    messageMenu(message, menuBuilder, navigation, pubsub, PUBSUB, yesnopopin, notification, Message, messageId,
                      userId);
                    resolve(message);
                  });
              })
        },
        ncyBreadcrumb: {
          label: '{{ \'MY_MESSAGES_TITLE\' | translate }}'
        }
      });
  });
