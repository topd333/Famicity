angular.module('famicity')
  .service('treeStatisticsService', function($q, $http, configuration) {
    'use strict';
    var deferredStats;

    return {
      getValues: function() {
        if (!deferredStats) {
          deferredStats = $q.defer();
          $http({
            url: configuration.api_url + '/tree_counters',
            method: 'GET',
            type: 'cm'
          })
            .success(function(data) {
              deferredStats.resolve(data);
            })
            .error(function(err) {
              console.log('Error', err);
              deferredStats.resolve({});
            });
        }
        return deferredStats.promise;
      }
    };
  })
  .directive('fcTreesCount', function(treeStatisticsService, $translate) {
    'use strict';
    var log = debug('fc-tree-count');
    return {
      restrict: 'EA',
      scope: {
        key: '@',
        prop: '@',
        defaultKey: '@?'
      },
      template: '<span ng-show="visible" ng-bind-html="text"></span>',
      replace: true,
      link(scope) {
        treeStatisticsService.getValues()
          .then(function(treeStatistics) {
            if (treeStatistics && !treeStatistics.error) {
              scope.visible = true;
              scope.count = treeStatistics[scope.prop];
              scope.text = $translate.instant(scope.key, {count: scope.count});
            } else {
              log('Could not fetch property %o from tree statistics: %o %o', scope.prop);
              scope.visible = Boolean(scope.defaultKey);
              if (scope.visible) {
                scope.text = $translate.instant();
              }
            }
          })
          .catch(function(error) {
            log(error);
          });
      }
    };
  });
