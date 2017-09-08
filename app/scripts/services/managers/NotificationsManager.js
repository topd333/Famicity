angular.module('famicity').factory('NotificationsManager', function(
  $state, $translate, $translateMessageFormatInterpolation) {
  'use strict';
  let buildHref;
  let buildProperties;

  // Build notification link
  buildHref = function(userId, objectType, objectId, comments, commentId, albumId) {
    let href;
    switch (objectType) {
      case 'album':
        if (comments) {
          href = $state.href('u.albums-comments', {
            user_id: userId,
            album_id: objectId,
            show_comments: true,
            '#': commentId
          });
        } else {
          href = $state.href('u.albums-show', {user_id: userId, album_id: objectId});
        }
        break;
      case 'photo':
        if (comments) {
          href = $state.href('u.albums-photos-comments', {
            user_id: userId,
            album_id: albumId,
            photo_id: objectId,
            show_comments: true,
            '#': commentId
          });
        } else {
          href = $state.href('u.albums-photos-show', {user_id: userId, album_id: albumId, photo_id: objectId});
        }
        break;
      case 'post':
        if (comments) {
          href = $state.href('u.blog.get', {
            user_id: userId,
            post_id: objectId,
            show_comments: true,
            '#': commentId
          });
        } else {
          href = $state.href('u.blog.get', {user_id: userId, post_id: objectId});
        }
        break;
      case 'event':
        href = $state.href('u.event-show', {user_id: userId, event_id: objectId});
        break;
      case 'avatar':
        if (comments) {
          href = $state.href('u.profile-photos-item', {
            user_id: userId,
            photo_id: objectId,
            show_comments: true,
            '#': commentId
          });
        } else {
          href = $state.href('u.profile-photos-item', {user_id: userId, photo_id: objectId});
        }
        break;
      case 'user':
      case 'invitation':
      default:
        href = $state.href('u.profile', {user_id: userId});
    }
    return href;
  };

  // Build notification properties
  buildProperties = function(notification, userId) {
    let bio;
    let bioUsername;
    let commentId;
    let href;
    let icon;
    let isMine;
    let key;
    let name;
    let objectOwner;
    let other;
    let text;
    let type;
    let username;
    if (typeof notification === 'undefined' ||
      typeof notification.object === 'undefined' || notification.object === null ||
      typeof notification.author === 'undefined' || notification.author === null) {
      return {text: null, icon: null, href: null};
    }
    // Concerns one of my objects
    isMine = notification.object.owner_id === userId;
    objectOwner = notification.object.owner_id;
    commentId = null;
    // Like on a comment object
    if (notification.notification_type === 3 && notification.object.type === 'comment') {
      const albumId = notification.commented_object.album_id != null ? notification.commented_object.album_id : null;
      href = buildHref(notification.commented_object.user_id, notification.commented_object.type,
        notification.commented_object.id, true, null, albumId);
    } else {
      // Basic object
      const albumId = notification.object.album_id != null ? notification.object.album_id : null;
      href =
        buildHref(objectOwner, notification.object.type, notification.object.id, notification.notification_type === 4, commentId, albumId);
    }
    // Object type
    type = (function() {
      switch (notification.notification_type) {
        case 3:
          return 'LIKE';
        case 4:
          return 'COMMENT';
        default:
          return 'SHARE';
      }
    })();
    // Relation between the notification author and the object
    // OTHER: user 1 on user 2
    // HIS_OWN user 1 on user 1
    // else: user 1 on my own

    if (isMine) {
      other = '';
    } else if (notification.object.owner_id === notification.author.id && type !== 'SHARE') {
      other = '_HIS_OWN';
    } else if (type !== 'SHARE') {
      other = '_OTHER';
    } else {
      other = '';
    }

    // is a bio notification
    bio = notification.other_user ? '_BIO' : '';
    // Names
    username = notification.object.owner_name;
    bioUsername = notification.other_user ? notification.other_user.user_name : undefined;
    name = notification.object.name || '';
    key = 'NOTIFICATIONS.' + notification.object.type.toUpperCase() + '.' + type + other + bio;
    text = $translate.instant(key, {
      username: username || '',
      bioUsername: bioUsername || '',
      name
    });
    try {
      text = $translateMessageFormatInterpolation.interpolate(text, {
        GENDER: notification.author.sex || ''
      });
    } catch (err) {
      Bugsnag.notifyException(err, 'MessageFormatError', {text, notification}, 'error');
      log('error on messageformat');
    }
    icon = (function() {
      switch (notification.notification_type) {
        case 0:
        case 1:
        case 2:
          return notification.object.type;
        case 5:
          return 'avatar';
        case 6:
          return 'user';
        case 7:
          return 'invitation';
        case 3:
          return 'like';
        case 4:
          return 'comment';
        default:
          return 'user';
      }
    })();
    return {href, text, icon};
  };

  return {buildProperties};
});
