angular.module('famicity.tree')
  .directive('fcToolbar', function() {
    'use strict';
    return {
      restrict: 'E',
      scope: {
        choices: '=',
        /**
         * Maximum visible menu choice. All above go in the remaining choices ("...") submenu. Default is not limit.
         */
        max: '@?',
        tooltipPlacement: '@?',
        context: '=?'
      },
      templateUrl: '/scripts/common/toolbar/fc-toolbar.html',
      controller($scope) {
        $scope.menuVisible = false;

        function updateChoices(newChoices) {
          $scope.choices = newChoices;
          if (newChoices && newChoices.length) {
            for (let i = 0; i < newChoices.length; i++) {
              // Allow to provide scope necessary to custom choice template
              angular.extend($scope, newChoices[i].scope);
            }
            $scope.max = $scope.max ? $scope.max : $scope.choices.length;
            const remainingChoices = $scope.choices.slice($scope.max);
            let remainingNotifications = 0;
            for (let i = 0; i < remainingChoices.length; i++) {
              const choice = remainingChoices[i];
              angular.extend($scope, choice.scope);
              if (choice.notificationsCount) {
                remainingNotifications += choice.notificationsCount;
              }
            }
            $scope.remainingChoices = remainingChoices;
            $scope.remainingNotificationsCount = remainingNotifications;
          }
        }

        $scope.$watch('choices', function(newChoices) {
          updateChoices(newChoices, $scope.max);
        }, true);
      }
    };
  });
