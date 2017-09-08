angular.module('famicity').directive('fcChat', function(
  $window, $timeout, pubsub, sessionManager, userInitializerManager,
  $translate, PUBSUB, util, $moment, $animateCss) {
  'use strict';

  const log = debug('fc-chat');
  const justSignedOut = [];

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/scripts/directives/chat/fc-chat.html',
    link($scope) {
      $scope.users = [];
      $scope.conversations = [];
      $scope.displayUserList = false;
      $scope.openOnce = false;
      $scope.minimized = 0;
      $scope.isConnected = false;
      $scope.search = {};

      const connect = function(userId) {
        if ($window.innerWidth > 767 && !isMobile.any) {
          log('connect with userId: %o', userId);
          $scope.isConnected = true;
          $scope.userId = userId;
          pubsub.publish(PUBSUB.CHAT.SOCKET.CONNECT, userId);
        } else {
          log('mobile device, not connecting.');
        }
      };

      const recordSignOut = function(id) {
        justSignedOut.push(id);
        $timeout(() => {
          justSignedOut.splice(justSignedOut.indexOf(id));
        }, 5000);
      };

      const countConnectedUsers = function() {
        return $scope.users
        .filter(user => user.status)
        .length;
      };

      const getStackedUnread = function() {
        return $scope.conversations
        .filter(conversation => conversation.stacked)
        .reduce((count, conversation) => count + conversation.unread, 0);
      };

      const handleStackedWindows = function() {
        let openConversations;
        openConversations = $scope.conversations.filter(function(conversation) {
          return !conversation.closed;
        });
        $scope.minimized = openConversations.length - ($window.innerWidth - 250 - 150) / 270;
        $scope.minimized = Math.ceil($scope.minimized);
        $scope.conversations = $scope.conversations.sort(function(a, b) {
          return a.position > b.position;
        }).map(function(conversation, index) {
          conversation.stacked =
          Boolean($scope.minimized > 0 && index >= openConversations.length - $scope.minimized && !conversation.closed);
          return conversation;
        });
        $scope.$evalAsync(() => $scope.stackedUnread = getStackedUnread());
      };

      if (userInitializerManager.isInitialized() === true) {
        connect(sessionManager.getUserId());
      }

      $scope.ignoreDiacritics = function(item) {
        let search;
        let text;
        if (!$scope.search.query) {
          return true;
        }
        text = util.removeDiacritics(item.userName.toLowerCase());
        search = util.removeDiacritics($scope.search.query.toLowerCase());
        return text.indexOf(search) > -1;
      };
      $scope.$watch('users', () => $scope.connectedNumber = countConnectedUsers());
      $scope.$watchCollection('users', () => $scope.connectedNumber = countConnectedUsers());

      $scope.getUnread = function() {
        return $scope.conversations
          .reduce((count, conversation) => count + conversation.unread, 0);
      };

      pubsub.subscribe(PUBSUB.WINDOW.RESIZE, function() {
        $scope.$applyAsync(function() {
          handleStackedWindows();
          if ($window.innerWidth > 767) {
            if ($scope.isConnected) {
              return;
            }
            $scope.userId = $scope.userId || sessionManager.getUserId();
            if (userInitializerManager.isInitialized() === true) {
              pubsub.publish(PUBSUB.CHAT.CONNECT, $scope.userId);
            }
          } else {
            if (!$scope.isConnected) {
              return;
            }
            log('mobile device, disconnecting.');
            pubsub.publish(PUBSUB.CHAT.DISCONNECT);
          }
        });
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.CONTACT.ALL, function(event, contacts) {
        $scope.users = contacts;
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.CONTACT.ADD, function(event, contact) {
        $timeout(function() {
          const userIds = $scope.users.map(user => user.userId);
          if (userIds.indexOf(contact.userId) >= 0) {
            return;
          }
          log('ADD, user: %o', contact);
          if (contact.status) {
            pubsub.publish(PUBSUB.CHAT.USER.ONLINE, {
              userId: contact.userId
            });
          }
          $scope.users.push(contact);
          $scope.conversations = $scope.conversations.map(function(conversation) {
            if (conversation.user.userId === contact.userId) {
              conversation.user.status = contact.status;
            }
            return conversation;
          });
        });
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.CONTACT.REMOVE, function(event, userId) {
        return $timeout(function() {
          log('REMOVE, userId: %o', userId);
          $scope.users = $scope.users.filter(function(user) {
            return user.userId !== userId;
          });
          $scope.conversations = $scope.conversations.map(function(conversation) {
            if (conversation.user.userId === userId) {
              conversation.user.status = false;
            }
            return conversation;
          });
        });
      }, $scope);
      // pubsub.subscribe(PUBSUB.CHAT.ENABLE, function() {
      //   $scope.isEnabled = true;
      // }, $scope);
      // pubsub.subscribe(PUBSUB.CHAT.DISABLE, function(event, userId) {
      //   $scope.isEnabled = false;
      // }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.CONNECT, function(event, userId) {
        connect(userId);
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.DISCONNECT, function() {
        log('disconnect');
        $scope.users = [];
        $scope.conversations = [];
        $scope.displayUserList = false;
        $scope.minimized = 0;
        $scope.isConnected = false;
        $scope.PageTitle.resetChatUnread();
        pubsub.publish(PUBSUB.CHAT.SOCKET.DISCONNECT);
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.SOCKET.DISCONNECTED, function() {
        $scope.$evalAsync(() => $scope.users = []);
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.USER.ONLINE, function(event, user) {
        return $timeout(function() {
          const userIds = $scope.users.map(user => user.userId);
          if (userIds.indexOf(user.userId) < 0) {
            return;
          }
          $scope.notification = $scope.users.filter(tUser => tUser.userId === user.userId)[0];
          if (angular.isUndefined($scope.notification) || $scope.notification === null || justSignedOut.indexOf(user.userId) >= 0) {
            return;
          }
          $scope.notification.visible = true;
          $timeout(function() {
            $scope.notification.visible = false;
          }, 3000);
        });
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.USER.UPDATE, function(event, modifiedUser) {
        $timeout(function() {
          if ($scope.users.map(user => user.userId).indexOf(modifiedUser.userId) < 0) {
            return;
          }
          log('UPDATE, userId: %o', modifiedUser.userId);
          $scope.users = $scope.users.map(function(user) {
            let key;
            let value;
            if (user.userId === modifiedUser.userId) {
              for (key in modifiedUser) {
                if (modifiedUser.hasOwnProperty(key)) {
                  value = modifiedUser[key];
                  // if the user has logged out
                  if (key === 'status' && value === false) {
                    recordSignOut(user.userId);
                  }
                  user[key] = value;
                }
              }
            }
            return user;
          });
        });
      }, $scope);
      pubsub.subscribe(PUBSUB.CHAT.RECEIVE, function(event, message) {
        message.timestamp = new Date().getTime();
        const conversationId = message.senderId === $scope.userId ? message.userId : message.senderId;
        const conversation = $scope.openConversation(conversationId);
        message.userId = message.senderId;
        delete message.senderId;
        conversation.messages.push(message);
        conversation.sentAgo = $moment().fromNow();
        $timeout(function() {
          if (!conversation.closed) {
            if (!(conversation.hasFocus || message.userId === $scope.userId)) {
              conversation.unread += 1;
            }
            if (conversation.conversationElement && conversation.conversationElement.length) {
              conversation.conversationElement.animate({
                scrollTop: conversation.conversationElement[0].scrollHeight
              }, 200);
            }
          }
          $scope.stackedUnread = getStackedUnread();
          if (message.userId !== $scope.userId) {
            $scope.PageTitle.updateChatUnread($scope.getUnread(), String(conversation.user.userName) + ' ' + $translate.instant('CHAT.SENT_MESSAGE'));
          }
        });
      }, $scope);
      $scope.hideChat = function() {
        $scope.displayUserList = false;
      };
      $scope.showChat = function() {
        $scope.displayUserList = true;
        $scope.openOnce = true;
      };
      $scope.closeConversation = function(id) {
        $scope.conversations = $scope.conversations.map(function(conversation) {
          if (conversation.id === id) {
            conversation.closed = true;
            conversation.position = null;
          }
          return conversation;
        });
        $scope.$evalAsync(() => handleStackedWindows());
      };
      $scope.unstackConversation = function(id) {
        let lastOpen = null;
        let toOpen = null;
        $scope.conversations
          .filter(conversation => !conversation.closed)
          .sort((a, b) => a.position < b.position)
          .forEach(function(conversation, index, openConversations) {
            if ((angular.isUndefined(lastOpen) || lastOpen == null) && !openConversations[index + 1].stacked) {
              lastOpen = openConversations[index + 1];
            }
            if (conversation.id === id) {
              toOpen = conversation;
            }
          });
        lastOpen.stacked = true;
        toOpen.stacked = false;
        toOpen.hidden = false;
        [toOpen.position, lastOpen.position] = [lastOpen.position, toOpen.position];
        $scope.$evalAsync(function() {
          toOpen.inputElement.focus();
          $scope.stackedUnread = getStackedUnread();
        });
      };
      $scope.openConversation = function(id, userTriggered) {
        let conversation;
        let user;
        if (angular.isUndefined(userTriggered) || userTriggered === null) {
          userTriggered = false;
        }
        const alreadyExists = $scope.conversations.filter(conversation => conversation.user.userId === id);
        if (alreadyExists.length === 1) {
          alreadyExists[0].closed = false;
          if (userTriggered) {
            alreadyExists[0].hidden = false;
          }
          if (alreadyExists[0].stacked) {
            $scope.unstackConversation(id);
          }
          conversation = alreadyExists[0];
        } else {
          user = $scope.users.filter(tUser => tUser.userId === id)[0];
          $scope.conversations.push({
            id: user.userId,
            user,
            hidden: false,
            closed: false,
            stacked: false,
            messages: [],
            unread: 0,
            position: $scope.conversations.length
          });
          conversation = $scope.conversations[$scope.conversations.length - 1];
        }
        if (userTriggered) {
          $timeout(function() {
            conversation.inputElement.focus();
            handleStackedWindows();
            if (conversation.stacked) {
              return $scope.unstackConversation(id);
            }
          });
        }
        return conversation;
      };
    }
  };
});
