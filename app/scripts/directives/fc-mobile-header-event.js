angular.module('famicity').directive('fcMobileHeaderEvent', function() {
  'use strict';
  return {
    scope: {
      tabActive: '=',
      event: '='
    },
    replace: true,
    templateUrl: '/views/internal/mobile_header_event.html',
    controller: function() {}
  };
});
