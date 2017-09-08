angular.module('famicity')
  .directive('fcSearchFilter', function() {
    'use strict';
    return {
      scope: {
        filter: '='
      },
      restrict: 'E',
      templateUrl: '/scripts/common/search/directives/fc-search-filter.html'
    };
  });
