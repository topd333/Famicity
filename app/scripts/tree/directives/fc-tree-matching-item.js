angular.module('famicity.tree').directive('fcTreeMatchingItem', function(
  $state, pubsub, PUBSUB, $timeout, Tree,
  notification, $moment, sessionManager) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      user: '='
    },
    templateUrl: '/scripts/tree/directives/fc-tree-matching-item.html',
    link(scope) {

      scope.$moment = $moment;

      pubsub.subscribe(PUBSUB.TREE.MATCHING.CLOSE_ITEM, function() {
        scope.close();
      });

      scope.open = function() {
        scope.invitationEmail = angular.copy(scope.user.email);
        pubsub.publish(PUBSUB.TREE.MATCHING.CLOSE_ITEM);
        sessionManager.setTreeType('detailed_web');
        $state.go('u.tree', {user_id: scope.user.tree_user_id, q: null}).then(function() {
          $timeout(() => scope.isOpen = true);
        });
      };

      scope.close = function() {
        scope.isOpen = false;
      };

      scope.removeItem = function() {
        pubsub.publish(PUBSUB.TREE.MATCHING.REMOVE_ITEM, scope.user.id);
      };

      scope.invite = function() {
        Tree.answerMatching({
          invite: true,
          matching_id: scope.user.id,
          email: scope.invitationEmail
        }).$promise.then(function() {
            notification.add('TREE.MATCHING.SENT_SUCCESS', {
              messageParams: {
                userName: scope.user.user_name,
                gender: scope.user.sex
              }
            });
            scope.removeItem();
          });
      };

      scope.dismiss = function() {
        Tree.answerMatching({
          invite: false,
          matching_id: scope.user.id
        }).$promise.then(function() {
            notification.add('TREE.MATCHING.NOT_INVITED');
            scope.removeItem();
          });
      };

    }
  };

});
