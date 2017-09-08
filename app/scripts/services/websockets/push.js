angular.module('famicity').factory('push', function(pubsub, configuration, PUBSUB) {
  'use strict';
  let socket = null;
  let unbinds = [];
  let retry = false;

  function initializeSocket() {
    socket.on('tree:lock:gedcom', function() {
      pubsub.publish(PUBSUB.TREE.GEDCOM.LOCK);
    });
    socket.on('tree:unlock:gedcom', function() {
      pubsub.publish(PUBSUB.TREE.GEDCOM.UNLOCK);
    });
    socket.on('tree:gedcom:status', function(response) {
      pubsub.publish(PUBSUB.TREE.GEDCOM.STATUS, response);
    });
    socket.on('tree:lock:fusion', function() {
      pubsub.publish(PUBSUB.TREE.FUSION.LOCK);
    });
    socket.on('tree:unlock:fusion', function() {
      pubsub.publish(PUBSUB.TREE.FUSION.UNLOCK);
    });
    socket.on('tree:matching-count', function(response) {
      pubsub.publish(PUBSUB.TREE.MATCHING.COUNT, response);
    });
    socket.on('receive_notification', function(response) {
      pubsub.publish(PUBSUB.NOTIFICATIONS.RECEIVE, response.notification);
    });
    socket.on('remove_notification', function(response) {
      pubsub.publish(PUBSUB.NOTIFICATIONS.REMOVE, response.notificationId);
      pubsub.publish(PUBSUB.NOTIFICATIONS.UNREADCOUNT, response.unreadCount);
    });
    socket.on('messages:unreadcount', function(response) {
      pubsub.publish(PUBSUB.MESSAGES.UNREADCOUNT, response);
    });
    unbinds.push(pubsub.subscribe(PUBSUB.NOTIFICATIONS.DISCONNECT_SOCKET, function() {
      retry = false;
      if (socket != null) {
        socket.disconnect();
      }
      socket = null;
      unbinds.forEach(function(fn) {
        fn.apply();
      });
      unbinds = [];
    }));
  }

  function initializeConnection(userId) {
    socket = io.connect(String(configuration.push_url) + '/push', {
      forceNew: true,
      query: 'userId=' + userId
    });

    socket.on('connect', function() {
      return initializeSocket(userId);
    });

    return socket.on('disconnect', function() {
      socket.removeAllListeners();
      socket.destroy();
      socket = null;
      unbinds.forEach(function(fn) {
        fn.apply();
      });
      unbinds = [];
      pubsub.publish(PUBSUB.PUSH.DISCONNECTED);
      if (retry === true) {
        try {
          initializeConnection(userId);
        } catch (err) {
          Bugsnag.notifyException(err, 'IOReconnectionError', {}, 'error');
        }
      }
    });
  }

  return {
    initialize() {
      return pubsub.subscribe(PUBSUB.PUSH.SOCKET.CONNECT, function(event, userId) {
        if (socket != null) {
          return;
        }
        retry = true;
        try {
          initializeConnection(userId);
        } catch (err) {
          Bugsnag.notifyException(err, 'IOConnectionError', {}, 'error');
        }
      });
    }
  };
});
