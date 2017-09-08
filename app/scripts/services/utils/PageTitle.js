
angular.module('famicity').factory('PageTitle', function($interval) {
  'use strict';

  const log = debug('spam-title');

  const unreadNotifications = 0;
  let defaultTitle;
  let unreadChat;
  let title = defaultTitle = 'Famicity';
  let promise = null;
  let message = '';
  return {
    title() {
      return title;
    },
    setTitle(newTitle) {
      if (newTitle !== title) {
        log('set: %o', newTitle);
      }
      title = newTitle;
      defaultTitle = newTitle;
    },
    resetChatUnread() {
      $interval.cancel(promise);
      title = defaultTitle;
    },
    updateChatUnread(unread, chatMessage) {
      if (chatMessage == null) {
        chatMessage = '';
      }
      unreadChat = unread;
      const totalUnread = unreadChat + unreadNotifications;
      if (totalUnread === 0) {
        $interval.cancel(promise);
        message = '';
        title = defaultTitle;
      } else if (chatMessage === '') {
        $interval.cancel(promise);
        message = '';
        title = '(' + totalUnread + ') ' + defaultTitle;
      } else {
        if (message === '') {
          message = chatMessage;
        }
        $interval.cancel(promise);
        promise = $interval(function() {
          if (title === message) {
            title = '(' + totalUnread + ') ' + defaultTitle;
          } else {
            title = message;
          }
        }, 2000);
      }
    },
    setUserFocus() {
      message = '';
      const totalUnread = unreadChat + unreadNotifications;
      $interval.cancel(promise);
      if (totalUnread > 0) {
        title = '(' + totalUnread + ') ' + defaultTitle;
      } else {
        title = defaultTitle;
      }
    }
  };
});
