angular.module('famicity').controller('SearchController', function(
  $scope, $state, $stateParams, User, me,
  search, $q, $location) {
  'use strict';

  $scope.userId = me.id;
  $scope.me = me;
  $scope.searchInitialized = true;
  $scope.users = angular.copy(search.users);
  $scope.resultCount = angular.copy(search.result_count);
  $scope.filter = {relative: true, directory: true, famicity: true};
  $scope.falseValue = false;

  let filtersInitialized = false;

  const unbind = $scope.$watch('filter', function() {
    if (!filtersInitialized) {
      filtersInitialized = true;
    } else {
      const query = angular.element('#search-term').val();
      $scope.loadMore(1, query);
    }
  }, true);

  $scope.$on('$destroy', unbind);

  $scope.loadMore = function(page, search) {
    if (search.length < 2) {
      return $q.reject();
    }

    const filter = Object.keys($scope.filter).reduce(function(total, key) {
      if ($scope.filter[key]) {
        total += key + ',';
      }
      return total;
    }, '').replace(/,$/, '');

    const promise = User.search({q: search, page, filter}).$promise;
    promise.then(function(response) {
      const params = angular.copy($stateParams);
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
      } else {
        $scope.users = $scope.users.concat(response.users);
      }
    });
    return promise;
  };
});
