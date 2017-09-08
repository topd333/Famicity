angular.module('famicity').factory('counters', function(pubsub, PUBSUB) {
  'use strict';

  let unreadMessages;
  let unreadNotifications;
  let unreadInvitations;
  let treeMatchings;

  var getUnreadMessages = function() {
    return unreadMessages;
  };

  var setUnreadMessages = function(unreadM) {
    unreadMessages = unreadM;
    pubsub.publish(PUBSUB.MESSAGES.UNREADCOUNT, unreadM);
  };

  var getUnreadNotifications = function() {
    return unreadNotifications;
  };

  var setUnreadNotifications = function(unreadN) {
    unreadNotifications = unreadN;
    pubsub.publish(PUBSUB.NOTIFICATIONS.UNREADCOUNT, unreadN);
  };

  var getUnreadInvitations = function() {
    return unreadInvitations;
  };

  var setUnreadInvitations = function(unreadI) {
    unreadInvitations = unreadI;
    pubsub.publish(PUBSUB.INVITATIONS.UNREADCOUNT, unreadI);
  };

  var getTreeMatchings = function() {
    return treeMatchings;
  };

  pubsub.subscribe(PUBSUB.TREE.MATCHING.COUNT, function(event, treeM) {
    treeMatchings = treeM;
  });

  var setTreeMatchings = function(treeM) {
    treeMatchings = treeM;
    pubsub.publish(PUBSUB.TREE.MATCHING.COUNT, treeM);
  };

  return {
    getUnreadMessages, setUnreadMessages,
    getUnreadNotifications, setUnreadNotifications,
    getUnreadInvitations, setUnreadInvitations,
    getTreeMatchings, setTreeMatchings
  };

});
