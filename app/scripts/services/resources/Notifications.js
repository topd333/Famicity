angular.module('famicity')
  .factory('Notifications', function($resource, configuration, resourceTransformer) {
    'use strict';
    return $resource(configuration.api_url + '/users/:user_id/notifications', {'notification_id': '@id'}, {
      query: {
        isArray: true,
        type: 'cmA',
        transformResponse: (data, headers, status) => resourceTransformer.transform(data, 'notifications', status)
      }
    });
  })
  .service('NotificationService', function($q, ModalManager, sessionManager, User, Notifications, pubsub, PUBSUB) {
    'use strict';
    var latestContents;

    // TODO: Should handle both explicit logout and session expiry
    pubsub.subscribe(PUBSUB.USER.DISCONNECT, function() {
      latestContents = null;  // Clean cache to re-trigger for_content request
    });

    function getAllNotifications() {
      var deferred = $q.defer();  // TODO: Use Angular 1.3+ $q() syntax
      if (latestContents) {
        deferred.resolve(latestContents);
      } else {
        User.forContent().$promise.then(function(allNotifications) {
          latestContents = allNotifications;  // Cache the initial notifications
          deferred.resolve(allNotifications);
        }).catch(function() {
          //Session.logout();
        });
      }
      return deferred.promise;
    }

    function getNotifications(userId, lastObjectId) {
      var deferred = $q.defer();  // TODO: Use Angular 1.3+ $q() syntax
      if (lastObjectId) {
        Notifications.getNotifications({
          user_id: userId,
          last_object_id: lastObjectId
        }).$promise.then(function(notifications) {
            deferred.resolve(notifications.notifications);
          });
      } else {  // First call: gather them from all notifications
        User.forContent().$promise.then(function(allNotificationsDeferred) {
          allNotificationsDeferred.$promise.then(function(allNotifications) {
            deferred.resolve(allNotifications.user.notifications);
          }).catch(function() {
            //Session.logout();
          });
        });
      }
      return deferred.promise;
    }

    function invalidate() {
      latestContents = null;
    }

    return {
      getAllNotifications,
      getNotifications,
      invalidate
    };
  });
