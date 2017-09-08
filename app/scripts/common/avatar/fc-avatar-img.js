angular.module('famicity')
  .directive('fcAvatarImg', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        user: '='
      },
      templateUrl: '/scripts/common/avatar/fc-avatar-img.html',
      link(scope) {
        scope.avatarUrl = scope.user.avatar_url;
        if (scope.avatarUrl.indexOf('/unknown_m.png') > 0) {
          scope.unknown = true;
          scope.male = true;
        } else if (scope.avatarUrl.indexOf('/unknown_f.png') > 0) {
          scope.unknown = true;
          scope.male = false;
        }
      }
    };
  });
