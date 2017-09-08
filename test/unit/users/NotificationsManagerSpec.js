describe('NotificationsManager', function() {
  'use strict';

  // load module
  beforeEach(module('famicity', function($provide) {
    // Fake locale setting to avoid locale script loading failure
    $provide.provider('tmhDynamicLocale', function() {
      this.$get = function() {
        return {
          set: function(locale) {
            //console.log('Locale set to ' + locale);
          }
        };
      };
    });
  }));

  var notificationsManager, $state,
      states = {
        share: {
          event: {name: 'u.event-show', params: {user_id: 'userId', event_id: 'objectId'}},
          post: {name: 'u.blog.get', params: {user_id: 'userId', post_id: 'objectId'}},
          album: {name: 'u.albums-show', params: {user_id: 'userId', album_id: 'objectId'}},
          photo: {
            name: 'u.albums-photos-show',
            params: {user_id: 'userId', photo_id: 'objectId', album_id: 'objectId'}
          },
          avatar: {name: 'u.profile-photos-item', params: {user_id: 'userId', photo_id: 'objectId'}},
          user: {name: 'u.profile', params: {user_id: 'userId'}}
        },
        comment: {
          event: {name: 'u.event-show', params: {user_id: 'userId', event_id: 'objectId'}},
          post: {name: 'u.blog.get', params: {user_id: 'userId', post_id: 'objectId'}},
          album: {name: 'u.albums-comments', params: {user_id: 'userId', album_id: 'objectId'}},
          photo: {
            name: 'u.albums-photos-comments',
            params: {user_id: 'userId', photo_id: 'objectId', album_id: 'objectId'}
          },
          avatar: {name: 'u.profile-photos-item', params: {user_id: 'userId', photo_id: 'objectId'}},
          user: {name: 'u.profile', params: {user_id: 'userId'}}
        }
      };

  states.like = states.share;

  beforeEach(inject(function(NotificationsManager, _$state_) {
    notificationsManager = NotificationsManager;
    $state = _$state_;
  }));

  var me        = {id: 0},
      user1     = {id: 1, sex: 'Male'},
      user2     = {id: 2},
      otherUser = {id: 3, user_name: '3'};

  var myObject    = {owner_id: 0, user_id: 0, id: 0, owner_name: '0'},
      user1Object = {owner_id: 1, user_id: 1, id: 1, owner_name: '1'};

  var onUser1Object         = {object: user1Object, author: user1},
      onUser1BioObject      = {object: user1Object, author: user1, otherUser: otherUser},
      user1OnMyObject       = {object: myObject, author: user1},
      user1OnMyBioObject    = {object: myObject, author: user1, otherUser: otherUser},
      user2OnUser1Object    = {object: user1Object, author: user2},
      user2OnUser1BioObject = {object: user1Object, author: user2, otherUser: otherUser};

  [
    {type: '.SHARE', params: onUser1Object, states: states.share},
    {type: '.SHARE_BIO', params: onUser1BioObject, states: states.share},
    {type: '.COMMENT', params: user1OnMyObject, states: states.comment, notificationType: 4, objectType: 'comment'},
    {
      type: '.COMMENT_OTHER',
      params: user2OnUser1Object,
      states: states.comment,
      notificationType: 4,
      objectType: 'comment'
    },
    {
      type: '.COMMENT_OTHER_BIO',
      params: user2OnUser1BioObject,
      states: states.comment,
      notificationType: 4,
      objectType: 'comment'
    },
    {
      type: '.COMMENT_BIO',
      params: user1OnMyBioObject,
      states: states.comment,
      notificationType: 4,
      objectType: 'comment'
    },
    {
      type: '.COMMENT_HIS_OWN',
      params: onUser1Object,
      states: states.comment,
      notificationType: 4,
      objectType: 'comment'
    },
    {
      type: '.COMMENT_HIS_OWN_BIO',
      params: onUser1BioObject,
      states: states.comment,
      notificationType: 4,
      objectType: 'comment'
    },
    {type: '.LIKE', params: user1OnMyObject, states: states.like, notificationType: 3, objectType: 'like'},
    {type: '.LIKE_OTHER', params: user2OnUser1Object, states: states.like, notificationType: 3, objectType: 'like'},
    {
      type: '.LIKE_OTHER_BIO',
      params: user2OnUser1BioObject,
      states: states.like,
      notificationType: 3,
      objectType: 'like'
    },
    {type: '.LIKE_BIO', params: user1OnMyBioObject, states: states.like, notificationType: 3, objectType: 'like'},
    {type: '.LIKE_HIS_OWN', params: onUser1Object, states: states.like, notificationType: 3, objectType: 'like'},
    {type: '.LIKE_HIS_OWN_BIO', params: onUser1BioObject, states: states.like, notificationType: 3, objectType: 'like'},
  ].forEach(function(notificationObject) {

      it('should build ' + notificationObject.type.replace('.', '') + ' notifications', function() {

        var notification = {
          object: notificationObject.params.object,
          author: notificationObject.params.author,
          other_user: notificationObject.params.otherUser
        };
        [
          {objectType: 'event', notificationType: 0},
          {objectType: 'post', notificationType: 1},
          {objectType: 'album', notificationType: 2},
          {objectType: 'photo', notificationType: 2},
          {objectType: 'avatar', notificationType: 5},
          {objectType: 'user', notificationType: 6}
        ].forEach(function(nofificationElements) {
            notification.object.type = nofificationElements.objectType;
            notification.notification_type =
              notificationObject.notificationType || nofificationElements.notificationType;
            if (notification.object.type === 'photo') {
              notification.object.album_id = notification.object.id;
            }
            if (notification.object.type === 'album' || notification.object.type === 'event') {
              notification.object.name = 'name';
            }
            var object      = notification.object,
                temp        = {userId: object.owner_id, objectId: object.id},
                params      = {},
                state       = notificationObject.states[object.type].name,
                stateParams = notificationObject.states[object.type].params,
                result, href;
            Object.keys(stateParams).forEach(function(key) {
              var paramName = stateParams[key];
              params[key] = temp[paramName];
            });
            if (notificationObject.notificationType === 4) {
              params.show_comments = true;
            }
            result = notificationsManager.buildProperties(notification, me.id);
            href = $state.href(state, params);
            expect(result.href).toBe(href);
            expect(result.icon).toBe(notificationObject.objectType || object.type);
            expect(result.text).toBe('NOTIFICATIONS.' + object.type.toUpperCase() + notificationObject.type);
          });

      });

    });

  user1OnMyObject.commented_object = angular.copy(myObject);
  user2OnUser1Object.commented_object = angular.copy(user1Object);
  onUser1Object.commented_object = angular.copy(user1Object);

  [
    {type: '.LIKE', params: user1OnMyObject},
    {type: '.LIKE_OTHER', params: user2OnUser1Object},
    {type: '.LIKE_HIS_OWN', params: onUser1Object}
  ].forEach(function(notificationObject) {

      it('should build ' + notificationObject.type.replace('.', '') + ' notifications on comments', function() {

        var notification = {
          object: notificationObject.params.object,
          commented_object: notificationObject.params.commented_object,
          author: notificationObject.params.author,
          other_user: notificationObject.params.otherUser,
          notification_type: 3
        };
        notification.object.type = 'comment';

        ['event', 'post', 'album', 'avatar', 'user']
          .forEach(function(objectType) {
            notification.commented_object.type = objectType;
            notification.object.type = 'comment';
            var object      = notification.commented_object,
                temp        = {userId: object.owner_id, objectId: object.id},
                params      = {},
                state       = states.comment[objectType].name,
                stateParams = states.comment[objectType].params,
                result, href;
            Object.keys(stateParams).forEach(function(key) {
              var paramName = stateParams[key];
              params[key] = temp[paramName];
            });
            params.show_comments = true;
            result = notificationsManager.buildProperties(notification, me.id);
            href = $state.href(state, params);
            expect(result.href).toBe(href);
            expect(result.icon).toBe('like');
            expect(result.text).toBe('NOTIFICATIONS.COMMENT' + notificationObject.type);
          });

      });
    });

  it('should not create a notification with wrong data', function() {
    var result;
    [
      {object: null, author: {id: 0}},
      {object: {id: 0}, author: null}
    ].forEach(function(notification) {
        result = notificationsManager.buildProperties(notification, me.id);
        expect(result.icon).toBe(null);
        expect(result.text).toBe(null);
      });

  });

});
