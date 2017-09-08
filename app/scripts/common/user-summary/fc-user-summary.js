angular.module('famicity')
  .directive('fcUserSummary', function(profileService, $moment) {
    'use strict';
    return {
      templateUrl: '/scripts/common/user-summary/fc-user-summary.html',
      restrict: 'E',
      scope: {
        userId: '=?',
        profile: '=?'
      },
      link(scope) {
        scope.$moment = $moment;
        if (scope.profile) {
          scope.basicProfile = scope.profile;
        } else {
          var userId;
          if (scope.userId) {
            userId = scope.userId;
          } else {
            userId = scope.$parent.viewedUserId != null ? scope.$parent.viewedUserId : scope.$parent.userId;
          }
          // profileService.getBasicProfile(userId, 'short', scope);  // TODO: Isolate scope and choose outside
          profileService.getShortProfile(userId).then(function(shortUser) {
            if (shortUser && shortUser.sex) {
              shortUser.sex = shortUser.sex.toLowerCase();
            }
            scope.basicProfile = scope.$parent.basicProfile = shortUser;
          });
        }
      }
    };
  });
