angular.module('famicity').directive('fcMonthLine', function() {
  'use strict';
  const log = debug('cal');
  var buildEmptyCase, orderByPadding, searchObject, watchKiller;
  watchKiller = '';
  orderByPadding = function(elements) {
    var i, orderedArray, result;
    orderedArray = [];
    i = 0;
    while (i <= 6) {
      result = searchObject(i, elements);
      log('orderByPadding: %o, %o', i, result);
      if (result.length) {
        orderedArray.push(result[0]);
        i += result[0].event.width;
      } else {
        result = buildEmptyCase({
          index: i,
          padding: i
        }, elements);
        if (result.length > 1) {
          orderedArray.push(result[0]);
          orderedArray.push(result[1]);
          i = result[1].event.end_padding + 1;
        } else {
          orderedArray.push(result[0]);
          i = result[0].event.end_padding + 1;
        }
      }
    }
    return orderedArray;
  };
  searchObject = function(value, elements) {
    return elements.filter((e) => e.event.padding === value);
  };
  buildEmptyCase = function(info, elements, object) {
    var emptyEvent, init, maxIteration, result;
    maxIteration = 6;
    init = angular.isUndefined(object);
    emptyEvent = angular.isUndefined(object) ? {
      event: {
        padding: info.padding,
        width: 1,
        isEmpty: true,
        end_padding: ''
      }
    } : object;
    result = init === false ? searchObject(info.index, elements) : [];
    if (result.length > 0) {
      return [emptyEvent, result[0]];
    } else if (info.index === maxIteration) {
      if (init !== true) {
        emptyEvent.event.width += 1;
      }
      emptyEvent.event.end_padding = info.index;
      return [emptyEvent];
    } else {
      emptyEvent.event.end_padding = info.index;
      if (init !== true) {
        emptyEvent.event.width += 1;
      }
      info.index += 1;
      return buildEmptyCase(info, elements, emptyEvent);
    }
  };
  return {
    restrict: 'AE',
    templateUrl: '/scripts/calendar/month/line/fc-month-line.html',
    replace: true,
    scope: {
      indexweek: '=',
      mevents: '=',
      show: '&',
      birthday: '&'
    },
    controller($scope, $moment) {
      $scope.$moment = $moment;
      $scope.weekEvents = '';
      watchKiller = $scope.$watchCollection('[indexweek, mevents]', function(newVals) {
        var arrayByTop, i, maxTop, result;
        if (angular.isDefined(newVals[1])) {
          if (angular.isDefined($scope.mevents) && angular.isDefined($scope.indexweek)) {
            if ($scope.mevents && $scope.mevents[$scope.indexweek.toString()] && $scope.mevents[$scope.indexweek.toString()].length > 0) {
              maxTop = Math.max.apply(Math, $scope.mevents[$scope.indexweek.toString()].map(function(o) {
                if (angular.isDefined(o.event)) {
                  return o.event.top;
                }
              }));
            } else {
              maxTop = null;
              $scope.weekEvents = [];
            }
            if (maxTop !== null) {
              i = 0;
              arrayByTop = [];
              while (i <= maxTop) {
                result = getByTop(i);
                arrayByTop.push(orderByPadding(result));
                i++;
              }
            }
            $scope.weekEvents = arrayByTop;
          }
        }
      });
      function getByTop(i) {
        return $scope.mevents[$scope.indexweek.toString()].filter(function(obj) {
          return obj.event.top === i;
        });
      }

      $scope.getColorText = function(color) {
        switch (color) {
          default:
          case '#DBEBAD':
            return 'color-green-event';
          case '#c1e4f7':
            return 'color-blue-event';
          case '#C8ADD0':
            return 'color-purple-event';
        }
      };
      return $scope.$on('$destroy', function() {});
    }
  };
});
