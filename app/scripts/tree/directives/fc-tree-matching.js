angular.module('famicity.tree').directive('fcTreeMatching', function(pubsub, util, Tree, PUBSUB) {
  'use strict';

  const log = debug('fc-tree-matching');

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/scripts/tree/directives/fc-tree-matching.html',
    link($scope) {

      let unbind;

      $scope.loadMoreElements = function() {
        log('loadMore');
        $scope.infiniteScrollLoading = true;
        const lastId = $scope.users.length ? $scope.users[$scope.users.length - 1].id : null;
        Tree.getMatchings({last_object_id: lastId})
          .$promise.then(function(matchings) {
            if (matchings.users && matchings.users.length) {
              $scope.users = $scope.users.concat(matchings.users);
            } else {
              $scope.infiniteScrollDisabled = true;
            }
          }).finally(() => $scope.infiniteScrollLoading = false);
      };

      $scope.displayPanel = false;
      $scope.falseValue = false;
      $scope.trueValue = true;

      $scope.users = [];

      pubsub.subscribe(PUBSUB.TREE.MATCHING.TOGGLE, function() {
        pubsub.publish(PUBSUB.NOTIFICATIONS.CLOSE);
        pubsub.publish(PUBSUB.TREE.SEARCH.CLOSE);
        log('toggle matching');
        $scope.displayPanel = !$scope.displayPanel;
        if ($scope.displayPanel) {
          $scope.loadMoreElements();
          unbind = pubsub.subscribe(PUBSUB.TREE.MATCHING.REMOVE_ITEM, function(event, id) {
            $scope.users = $scope.users.filter((user) => user.id !== id);
          });
          pubsub.publish(PUBSUB.TREE.MATCHING.IS_OPEN);
        } else {
          unbind();
          pubsub.publish(PUBSUB.TREE.MATCHING.IS_CLOSED);
        }
      }, $scope);

      pubsub.subscribe(PUBSUB.TREE.MATCHING.CLOSE, function() {
        $scope.closePanel();
        pubsub.publish(PUBSUB.TREE.MATCHING.IS_CLOSED);
      }, $scope);

      $scope.closePanel = function() {
        $scope.displayPanel = false;
      };

      $scope.debouncedLoadMore = util.debounce($scope.loadMoreElements, 200);

    }
  };
});
