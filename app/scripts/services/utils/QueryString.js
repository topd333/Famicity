angular.module('famicity').factory('QueryString', function($window) {
  'use strict';
  return function() {
    let arr;
    let pair;
    const query_string = {};
    const query = $window.location.search.substring(1);
    const vars = query.split('&');
    let i = 0;
    while (i < vars.length) {
      pair = vars[i].split('=');
      if (angular.isUndefined(query_string[pair[0]])) {
        query_string[pair[0]] = pair[1];
      } else if (angular.isString(query_string[pair[0]])) {
        arr = [query_string[pair[0]], pair[1]];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(pair[1]);
      }
      i++;
    }
    return query_string;
  };
});
