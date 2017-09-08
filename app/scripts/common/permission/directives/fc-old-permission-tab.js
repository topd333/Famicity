angular.module('famicity')
  .directive('fcOldPermissionTab', function($state, $stateParams) {
    'use strict';
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: '/scripts/common/permission/directives/fc-old-permission-tab.html',
      link($scope) {
        var tab = $stateParams.tab;
        $scope.tabActive = tab != null ? tab : 'group';
        var params = $state.params;
        $scope.getGroups();
        $scope.getDirectory();
        if (params.tab !== 'user') {
          $scope.getCounters('all', 'active').then(function(response) {
            if (response.total === 0) {
              params.tab = 'user';
              $state.go($state.current.name, params, {
                notify: true,
                reload: true
              });
            }
          });
        }
        $scope.import = false;
        $scope.showInvitationTab =
          Boolean($scope.permission_type === 'permissions' && $stateParams['form_key'] !== 'default_rights');
        $scope.proposeImport = function() {
          $scope.import = true;
        };
        $scope.cancelImport = function() {
          $scope.import = false;
        };
        $scope.showUsers = function() {
          $scope.tabActive = 'user';
          params = $state.params;
          params.tab = $scope.tabActive;
          $state.go($state.current.name, params, {
            notify: true
          });
          if ($scope.hasOwnProperty('users') === false) {
            return $scope.getDirectory();
          }
        };
        $scope.showGroups = function() {
          $scope.tabActive = 'group';
          params = $state.params;
          params.tab = $scope.tabActive;
          $state.go($state.current.name, params, {
            notify: true
          });
          if ($scope.hasOwnProperty('groups') === false) {
            return $scope.getGroups();
          }
        };
        $scope.showInvitations = function() {
          $scope.tabActive = 'email';
          params = $state.params;
          params.tab = $scope.tabActive;
          $state.go($state.current.name, params, {
            notify: true
          });
        };
      }
    };
  });
