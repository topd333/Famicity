angular.module('famicity.directory')
  .directive('fcDirectoryGroupsList', function() {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: '/scripts/directory/groups/list/fc-directory-groups-list.html',
    link(scope) {
      scope.ngGroupsPerPage = 5;
      scope.currentPage = 1;
      scope.$watch('groups', function(newVal) {
        var i, _results;
        scope.$parent.groups = newVal;
        if (scope.$parent.groups) {
          scope.nbMaxPage = Math.ceil(scope.$parent.groups.length / scope.ngGroupsPerPage);
        } else {
          scope.nbMaxPage = 0;
        }
        scope.pages = [];
        i = 1;
        _results = [];
        while (i <= scope.nbMaxPage) {
          scope.pages.push(i);
          _results.push(i++);
        }
        return _results;
      });
      scope.goNextPage = function() {
        if (scope.$parent.groups.length > scope.currentPage * scope.ngGroupsPerPage) {
          scope.currentPage += 1;
        }
      };
      scope.goPrevPage = function() {
        if (scope.currentPage > 1) {
          scope.currentPage -= 1;
        }
      };
      scope.goPage = function(page) {
        if (scope.nbMaxPage >= page && page > 0) {
          scope.currentPage = page;
        }
      };
    }
  };
});
