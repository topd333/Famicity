angular.module('famicity.directory', [])
  .config(function($stateProvider) {
    'use strict';
    // User state: needs authentication
    // All user states need to inherit this state

    const groupUsersPromise = (Directory, $stateParams) => Directory.get({
      group_id: $stateParams.group_id
    }).$promise;

    $stateProvider
      .state('u.directory', {
        url: '/u/directory',
        abstract: true,
        views: {
          '@': {
            templateUrl: '/scripts/directory/directory.html',
            controller: 'DirectoryAbstractController'
          }
        },
        resolve: {
          receivedInvitations: (Invitation, me) => Invitation.received({user_id: me.id}).$promise,
          sentInvitations: (Invitation, me) => Invitation.sent({user_id: me.id}).$promise,
          groups: ($q, Group, me) => $q((resolve, reject) => {
            Group.query({user_id: me.id}).$promise.then((groups) => {
              resolve(groups);
            }).catch(function(error) {
              reject(error);
            });
          })
        }
      })
      .state('u.directory.list', {
        url: '',
        views: {
          content: {
            templateUrl: '/views/directory/user-directory.html',
            controller: 'DirectoryController'
          }
          // '@mobile-header': {
          //  templateUrl: '/views/directory/headers/user-directory.html',
          //  controller: 'InternalUserDirectoryHeaderController'
          // }
        },
        resolve: {
          numberOfActives(directoryService, $q, menuBuilder, navigation) {
            const addAction = {
              tooltip: 'ADD_RELATIVE',
              onActive: () => navigation.go('u.directory.add'),
              label: '+'
            };
            const removeAction = {
              tooltip: 'DIRECTORY.DELETE_SEVERAL',
              onActive: () => navigation.go('u.directory.remove-several'),
              icon: 'fa fa-trash-o',
              style: 'wcs-g-icon-red-rollover'
            };
            const importAction = {
              onActive: () => navigation.go('u.directory.import-from-services'),
              icon: 'fc fc-import',
              tooltip: 'IMPORT_ADDRESSES_BOOK'
            };
            const inviteAction = {
              onActive: () => navigation.go('u.directory.invite'),
              icon: 'fc fc-users-plus',
              tooltip: 'INVITE_FROM_MY_DIRECTORY'
            };
            menuBuilder.newMenu()
              .withAction(inviteAction).withAction(importAction).withAction(addAction).withAction(removeAction).build();

            return $q((resolve, reject) => {
              directoryService.counters({
                state: 'active'
              }).then(function(response) {
                resolve(response.total);
              }).catch(function(error) {
                reject(error);
              });
            });
          },
          directory: (Directory) => Directory.get().$promise
        },
        ncyBreadcrumb: {
          label: '{{ \'DIRECTORY_LINK\' | translate }}'
        }
      })
      .state('u.directory.invite', {
        url: '/invite',
        views: {
          content: {
            templateUrl: '/scripts/directory/invite/DirectoryInvite.html',
            controller: 'DirectoryInviteController'
          }
        },
        resolve: {
          id(directoryManagerService) {
            directoryManagerService.data = {
              group: {
                users: []
              },
              groups: {
                list: []
              },
              invitations: {
                users: [],
                emails: [],
                comment: '',
                recipients: ''
              }
            };
          },
          usersToInvite: (Directory, $q) => $q((resolve) => {
            Directory.get({to_invite: true}).$promise.then((response) => {
              resolve(response.users);
            });
          }),
          menu: (menuBuilder, MENU, pubsub, PUBSUB) => {
            const submitAction = MENU['u.directory.invite'].actions.submitAction;
            submitAction.onActive = () => pubsub.publish(PUBSUB.DIRECTORY.INVITATIONS.SUBMIT);
            menuBuilder.newMenu().withAction(submitAction).build();
          }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'INVITE_YOUR_RELATIVES\' | translate }}'
        },
        data: {
          stateClass: 'directory invite',
          authorizedFormRoutes: ['multiple_invitations']
        }
      })
      .state('u.directory.invitations-groups-list', {
        url: '/invite/groups-list?type&invitationId&form_key&inviterUserId',
        views: {
          content: {
            templateUrl: '/scripts/directory/groups/user-directory-invite-groups-list.html',
            controller: 'InternalUserDirectoryInviteGroupsListController'
          },
          'mobile-header': {
            templateUrl: '/scripts/directory/groups/user-directory-invite-groups-list.html',
            controller: 'InternalUserDirectoryInviteGroupsListHeaderController'
          }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'INVITE_YOUR_RELATIVES\' | translate }}'
        },
        data: {
          authorizedFormRoutes: ['send_invitation', 'resend_invitation', 'multiple_invitations', 'create_contact'],
          hideLeftColumnBlock: true
        }
      })
      .state('u.directory.groups', {
        url: '/:user_id/groups',
        views: {
          content: {
            templateUrl: '/scripts/directory/groups/profile/DirectoryProfileGroups.html',
            controller: 'DirectoryProfileGroupsController'
          }
          // 'mobile-header': {
          //  templateUrl: '/scripts/directory/groups/user-directory-invite-groups-list.html',
          //  controller: 'InternalUserDirectoryInviteGroupsListHeaderController'
          // }
        },
        resolve: {
          menu: (menuBuilder, pubsub, PUBSUB) => {
            const profileGroupsSubmitAction = {
              label: 'OK',
              style: 'action-submit',
              onActive: () => pubsub.publish(PUBSUB.DIRECTORY.GROUPS.PROFILE.SUBMIT)
            };
            menuBuilder.newMenu().withAction(profileGroupsSubmitAction).build();
          }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'DIRECTORY.USER_GROUPS\' | translate:{firstName: user.first_name} }}'
        },
        data: {
          authorizedFormRoutes: [],
          hideLeftColumnBlock: true,
          stateClass: 'directory groups profile'
        }
      }).state('u.directory.mobile-invitations-menu', {
        url: '/invitations',
        views: {
          content: {
            templateUrl: '/views/directory/mobile-invitations-menu.html',
            controller: 'InternalUserDirectoryMobileInvitationsMenuController'
          },
          'mobile-header': {
            templateUrl: '/views/directory/headers/mobile-invitations-menu.html',
            controller: 'InternalUserDirectoryMobileInvitationsMenuHeaderController'
          }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'INVITATIONS\' | translate }}'
        }
      })
      .state('u.directory.resend-invitation', {
        url: '/resend-invitation/:invitation_id',
        views: {
          '@': {
            templateUrl: '/scripts/directory/invitations/sent/re-send/DirectoryResendInvitation.html',
            controller: 'DirectoryResendInvitationController'
          }
        },
        resolve: {
          invitation: (Invitation, $stateParams, me) => Invitation.get({
            user_id: me.id,
            invitation_id: $stateParams.invitation_id
          }).$promise,
          menu: (menuBuilder, pubsub, PUBSUB) => {
            const reviveSubmitAction = {
              label: 'SEND',
              style: 'action-submit',
              onActive: () => pubsub.publish(PUBSUB.DIRECTORY.INVITATIONS.SENT.REVIVE)
            };
            menuBuilder.newMenu().withAction(reviveSubmitAction).build();
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'REVIVE\' | translate }}'
        },
        data: {
          stateClass: 'directory invitations sent revive'
        }
      })
      .state('u.directory.send-invitation', {
        url: '/send-invitation/:invitation_id?email',
        views: {
          '@': {
            templateUrl: '/views/profile/user-profile-send-invitation.html',
            controller: 'DirectorySendInvitationController'
          }
        },
        ncyBreadcrumb: {
          label: '{{ \'INVITATION\' | translate }}'
        },
        data: {
          authorizedFormRoutes: ['send_invitation', 'create_contact'],
          hideLeftColumnBlock: true
        }
      })
      .state('u.directory.sent-invitations', {
        url: '/sent-invitations',
        views: {
          content: {
            templateUrl: '/scripts/directory/invitations/sent/SentInvitations.html',
            controller: 'SentInvitationsController'
          }
          // , 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-directory-sent-invitations.html',
          //  controller: 'InternalUserDirectorySentInvitationsHeaderController'
          // }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'SENT_INVITATIONS\' |translate }}'
        }
      })
      .state('u.directory.received-invitations', {
        url: '/received-invitations',
        views: {
          content: {
            templateUrl: '/scripts/directory/invitations/received/ReceivedInvitations.html',
            controller: 'ReceivedInvitationsController'
          }
          // 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-directory-received-invitations.html',
          //  controller: 'InternalUserDirectoryReceivedInvitationsHeaderController'
          // }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'RECEIVED_INVITATIONS\' | translate }}'
        }
      })
      .state('u.directory.add', {
        url: '/add?reset',
        views: {
          content: {
            templateUrl: '/scripts/directory/invite/add/DirectoryInviteAdd.html',
            controller: 'DirectoryInviteAddController'
          }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          label: '{{ \'ADD_RELATIVE\' |translate }}',
          parent: 'u.directory.list'
        },
        data: {
          authorizedFormRoutes: ['create_contact']
        }
      }).state('u.directory.user-import', {
        url: '/import',
        views: {
          content: {
            templateUrl: '/views/directory/user-import.html',
            controller: 'InternalUserImportController'
          }
          // 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-import.html',
          //  controller: 'InternalUserImportHeaderController'
          // }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'IMPORT\' | translate }}'
        }
      })
      .state('u.directory.import-from-services', {
        url: '/import/external',
        views: {
          content: {
            templateUrl: '/scripts/directory/invite/import/external/DirectoryImportExternal.html',
            controller: 'DirectoryImportExternalController'
          }
          // 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-import.html',
          //  controller: 'InternalUserImportHeaderController'
          // }
        },
        resolve: {
          menu: (menuBuilder) => menuBuilder.newMenu().build()
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'IMPORT\' | translate }}'
        }
      }).state('u.directory.invite-after-import', {
        url: '/import/invite?redirect&cancel&formKey',
        views: {
          content: {
            templateUrl: '/scripts/directory/invite/import/after/InviteAfterImport.html',
            controller: 'InviteAfterImportController'
          }
          // 'mobile-header':
          // templateUrl: 'views/directory/headers/user-import.html'
          // controller: 'InternalUserImportHeaderController'
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'IMPORT\' | translate }}'
        },
        data: {
          authorizedFormRoutes: [
            'add_post', 'edit_post', 'add_album', 'edit_album', 'add_event', 'edit_event', 'add_msg', 'default_rights'
          ],
          stateClass: 'form-p2 import-invite',
          hideLeftColumnBlock: true,
          hideCmBar: true
        }
      })
      .state('u.directory.user-groups', {
        url: '/groups',
        views: {
          content: {
            templateUrl: '/views/directory/user-groups.html',
            controller: 'InternalUserGroupsController'
          },
          'mobile-header': {
            templateUrl: '/views/directory/headers/user-groups.html',
            controller: 'InternalUserGroupsHeaderController'
          }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'GROUPS\' | translate }}'
        }
      })
      .state('u.directory.user-group', {
        url: '/groups/:group_id',
        views: {
          content: {
            templateUrl: '/scripts/directory/groups/show/DirectoryGroupShow.html',
            controller: 'DirectoryGroupShowController'
          }
          // 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-group.html',
          //  controller: 'InternalUserGroupHeaderController'
          // }
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ group.group_name }}'
        },
        resolve: {
          group: (Group, menuBuilder, ModalManager, $stateParams, me, $q, $rootScope) => {
            return $q(function(resolve) {
              const userId = me.id;
              Group.get({
                user_id: userId,
                group_id: $stateParams.group_id
              }).$promise.then((response) => {
                const editAction = {
                  icon: 'fa fa-pencil-square-o',
                  onActive: () => {
                    const groupEditScope = $rootScope.$new();
                    groupEditScope.group = response.group;
                    groupEditScope.userId = userId;
                    ModalManager.open({
                      templateUrl: '/scripts/directory/groups/edit/GroupEdit.html',
                      controller: 'GroupEditController',
                      scope: groupEditScope
                    });
                  }
                };
                const addAction = {
                  tooltip: '',
                  label: '+',
                  onActive: () => {
                    const groupAddScope = $rootScope.$new();
                    groupAddScope.group = response.group;
                    groupAddScope.userId = userId;
                    return ModalManager.open({
                      templateUrl: '/scripts/directory/groups/add/options/DirectoryGroupAddOptions.html',
                      controller: 'DirectoryGroupAddOptionsController',
                      scope: groupAddScope
                    });
                  }
                };
                menuBuilder.newMenu().withAction(editAction).withAction(addAction).build();
                resolve(response);
              });
            });
          }
        }
      })
      .state('u.directory.user-group-add', {
        url: '/groups/:group_id/add',
        views: {
          content: {
            templateUrl: '/scripts/directory/groups/add/DirectoryGroupUserAdd.html',
            controller: 'DirectoryGroupUserAddController'
          }
          // 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-group-add.html',
          //  controller: 'InternalUserGroupAddHeaderController'
          // }
        },
        resolve: {
          users: (me, $stateParams, $q, Directory, navigation, groupService, notification) => $q((resolve) => {
            groupUsersPromise(Directory, $stateParams).then((response) => {
              const users = response.users;
              resolve(users);
            });
          }),
          menu: (menuBuilder, pubsub, PUBSUB) => {
            const confirmAddAction = {
              label: 'Ok',
              style: 'action-add',
              onActive: () => {
                pubsub.publish(PUBSUB.DIRECTORY.GROUPS.ADD_USERS);
              }
            };
            menuBuilder.newMenu().withAction(confirmAddAction).build();
          }
        },
        data: {
          stateClass: 'directory groups add'
        },
        ncyBreadcrumb: {
          parent: 'u.directory.user-group',
          label: '{{ \'ADDED\' | translate }}'
        }
      })
      .state('u.directory.user-group-remove', {
        url: '/groups/:group_id/remove',
        views: {
          content: {
            templateUrl: '/scripts/directory/groups/remove/DirectoryGroupUserRemove.html',
            controller: 'DirectoryGroupUserRemoveController'
          }
          // 'mobile-header': {
          //  templateUrl: '/views/directory/headers/user-group-remove.html',
          //  controller: 'InternalUserGroupRemoveHeaderController'
          // }
        },
        resolve: {
          group: (Group, $stateParams, me) => Group.get({
            user_id: me.id,
            group_id: $stateParams.group_id,
            without_users: true
          }).$promise,
          users: (menuBuilder, me, $stateParams, $q, Directory, navigation, groupService) => $q((resolve) => {
            groupUsersPromise(Directory, $stateParams).then((response) => {
              const users = response.users;
              const groupId = $stateParams.group_id;
              const userId = me.id;
              const confirmDeleteAction = {
                label: 'Ok',
                style: 'action-remove wcs-g-icon-red-rollover',
                onActive: () => {
                  const selectedUsers = users.reduce((users, user) => {
                    if (user.selected) {
                      users.push(user.id);
                    }
                    return users;
                  }, []).join(',');
                  groupService.removeMembers(userId, groupId, selectedUsers).then(() => {
                    navigation.go('u.directory.user-group', {group_id: groupId});
                  });
                }
              };
              menuBuilder.newMenu().withAction(confirmDeleteAction).build();
              resolve(users);
            });
          })
        },
        ncyBreadcrumb: {
          parent: 'u.directory.user-group',
          label: '{{ \'REMOVE\' | translate }}'
        },
        data: {
          stateClass: 'directory groups remove'
        }
      })
      .state('u.directory.remove-several', {
        url: '/remove-several',
        views: {
          content: {
            templateUrl: '/scripts/directory/remove/DirectoryRemove.html',
            controller: 'DirectoryRemoveController'
          }
        },
        resolve: {
          menu: (menuBuilder, navigation) => menuBuilder.newMenu().withAction({
            label: 'CANCEL',
            onActive: () => navigation.go('u.directory.list'),
            style: 'action-cancel'
          }).build()
        },
        data: {
          stateClass: 'directory users remove'
        },
        ncyBreadcrumb: {
          parent: 'u.directory.list',
          label: '{{ \'DIRECTORY.DELETE_SEVERAL\' | translate }}'
        }
      });
  });
