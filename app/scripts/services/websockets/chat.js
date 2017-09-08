angular.module('famicity').factory('chat', function(pubsub, configuration, userService, PUBSUB) {
  'use strict';
  let socket = null;
  let unbinds = [];
  let retry = false;
  const log = debug('fc-socket:chat');

  const initializeSocket = function(userId) {
    socket.emit('subscribe', {userId}, () => userService.askContacts(userId));

    socket.on('contacts', response => pubsub.publish(PUBSUB.CHAT.CONTACT.ALL, response.contacts));

    socket.on('add_contact', function(response) {
      log('ADD, userId: %o', response.contact.userId);
      pubsub.publish(PUBSUB.CHAT.CONTACT.ADD, response.contact);
    });

    socket.on('remove_contact', function(response) {
      log('REMOVE, userId: %o', response.userId);
      pubsub.publish(PUBSUB.CHAT.CONTACT.REMOVE, response.userId);
    });

    socket.on('receive', function(message) {
      pubsub.publish(PUBSUB.CHAT.RECEIVE, message);
    });

    socket.on('update_contact', function(response) {
      log('UPDATE, userId: %o', response.contact.userId);
      pubsub.publish(PUBSUB.CHAT.USER.UPDATE, response.contact);
    });

    socket.on('online', function(response) {
      log('ONLINE, userId: %o', response.userId);
      pubsub.publish(PUBSUB.CHAT.USER.UPDATE, {
        userId: response.userId,
        status: true
      });
      pubsub.publish(PUBSUB.CHAT.USER.ONLINE, {
        userId: response.userId
      });
    });

    socket.on('offline', function(response) {
      log('OFFLINE, userId: %o', response.userId);
      pubsub.publish(PUBSUB.CHAT.USER.UPDATE, {
        userId: response.userId,
        status: false
      });
    });

    unbinds.push(pubsub.subscribe(PUBSUB.CHAT.SEND, function(event, message) {
      socket.emit('send', message);
    }));

    unbinds.push(pubsub.subscribe(PUBSUB.CHAT.SOCKET.DISCONNECT, function() {
      retry = false;
      if (socket != null) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      socket = null;
      unbinds.forEach(function(fn) {
        fn.apply();
      });
      unbinds = [];
    }));
  };

  const initializeConnection = function(userId) {
    socket = io.connect(String(configuration.push_url) + '/chat', {
      forceNew: true,
      query: 'userId=' + userId
    });
    socket.on('connect', function() {
      userService.askContacts(userId);
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
      pubsub.publish(PUBSUB.CHAT.SOCKET.DISCONNECTED);
      if (retry === true) {
        try {
          initializeConnection(userId);
        } catch (err) {
          Bugsnag.notifyException(err, 'IOReconnectionError', {}, 'error');
        }
      }
    });
  };
  return {
    initialize() {
      return pubsub.subscribe(PUBSUB.CHAT.SOCKET.CONNECT, function(event, userId) {
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
