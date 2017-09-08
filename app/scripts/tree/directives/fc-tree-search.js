angular.module('famicity.tree').directive('fcTreeSearch', function(
  pubsub, User, $q, util, $timeout,
  PUBSUB, $state, $stateParams, $location) {
  'use strict';

  const log = debug('fc-tree-search');

  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/scripts/tree/directives/fc-tree-search.html',
    scope: {
      onClick: '=?'
    },
    link($scope, element) {

      $scope.displayCapital = false;
      $scope.displayPanel = false;
      $scope.falseValue = false;
      $scope.trueValue = true;
      $scope.users = [];
      $scope.resultCount = [];
      //$scope.search.criteria = null;
      $scope.search = {
        criteria: ''
      };
      $scope.filter = {place: '', begin: '', end: ''};
      $scope.showOptions = false;

      pubsub.subscribe(PUBSUB.TREE.SEARCH.TOGGLE, function(event, q) {
        pubsub.publish(PUBSUB.NOTIFICATIONS.CLOSE);
        pubsub.publish(PUBSUB.TREE.MATCHING.CLOSE);
        log('toggle search');
        $scope.displayPanel = !$scope.displayPanel;
        if ($scope.displayPanel) {
          $timeout(() => {
            $scope.search.criteria = q;
            element.find('#tree-search').focus();
            pubsub.publish(PUBSUB.TREE.SEARCH.IS_OPEN);
          });
        } else {
          pubsub.publish(PUBSUB.TREE.SEARCH.IS_CLOSED);
        }
      }, $scope);

      pubsub.subscribe(PUBSUB.TREE.SEARCH.CLOSE, function() {
        $scope.closePanel();
      }, $scope);

      $scope.closePanel = function() {
        log('close');
        if ($scope.displayPanel) {
          const params = angular.copy($stateParams);
          params.q = '';
          params.ts = Date.now();
          const href = $state.href($state.current.name, params);
          $location.skipReload().url(href).replace();
        }
        $scope.displayPanel = false;
        pubsub.publish(PUBSUB.TREE.SEARCH.IS_CLOSED);
      };

      $scope.toggleOptions = function() {
        $scope.showOptions = !$scope.showOptions;
      };

      $scope.loadMore = function(page, search) {

        log('search, q: %o, page: %o, place: %o, birth_year: %o, death_year: %o',
          search, page, $scope.filter.place, $scope.filter.begin, $scope.filter.end);

        $scope.intiniteScrollLoading = true;
        var promise = User.search({
          q: search, page,
          filter: 'tree',
          place: $scope.filter.place,
          birth_year: $scope.filter.begin,
          death_year: $scope.filter.end
        }).$promise;
        promise.then(function(response) {
          const params = angular.copy($state.params);
          params.q = search;
          const href = $state.href($state.current.name, params);
          $location.skipReload().url(href).replace();
          $scope.resultCount = response.result_count;
          if (response.error) {
            $scope.users = [{error: true}];
          } else if (response.users && response.users.length === 0) {
            if (page === 1) {
              $scope.users = [];
            }
          } else if (page === 1) {
            $scope.users = response.users;
          } else if (page) {
            $scope.users = $scope.users.concat(response.users);
          }
        });
        return promise;
      };

      const debouncedLoadMore = util.debounce($scope.loadMore, 300);
      let filterInit = false;

      $scope.$watch('filter', function() {
        if (!filterInit) {
          filterInit = true;
          return;
        }
        debouncedLoadMore(1, $scope.search.criteria);
      }, true);

    }
  };
});
