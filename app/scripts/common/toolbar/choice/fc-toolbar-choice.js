angular.module('famicity')
.directive('fcToolbarChoice', function($http, $compile) {
  'use strict';
  return {
    restrict: 'E',
    scope: true,
    templateUrl: '/scripts/common/toolbar/choice/fc-toolbar-choice.html',
    link(scope, elem, attrs) {
      if (attrs.allowTooltip !== 'false') {
        scope.allowTooltip = true;
      }
      // Set dynamic template
      if (attrs.templateUrl) {
        const templateUrl = attrs.templateUrl || '/scripts/common/toolbar/choice/fc-toolbar-choice.html';
        $http.get(templateUrl).then((response) => {
          elem.html($compile(response.data)(scope));
        });
      }
    }
  };
});
