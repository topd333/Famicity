angular.module('famicity').directive('fcMobileHeaderProfile', function() {
  'use strict';
  return {
    scope: {
      basicProfile: '=',
      viewedUserId: '=',
      currentTab: '='
    },
    replace: true,
    templateUrl: '/views/internal/mobile_header_profile.html'
  };
});
