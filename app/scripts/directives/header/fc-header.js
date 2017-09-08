angular.module('famicity')
  .directive('fcHeader', function(
    $state, $location, Session, pubsub, sessionManager,
    $timeout, User, $q, $moment, PUBSUB) {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: '/scripts/directives/header/fc-header.html',
      scope: true,
      controller($scope) {
        $scope.$moment = $moment;
        pubsub.subscribe(PUBSUB.USER.CONNECT, function() {
          $scope.userId = sessionManager.getUserId();
          $scope.settingsId = sessionManager.getSettingsId();
        }, $scope);
        $scope.userId = sessionManager.getUserId();
        $scope.unreadNotifications = 0;
        $scope.matchingsCount = 0;
        $scope.unreadMessages = 0;
        $scope.search = {};

        $scope.logout = function() {
          return Session.logout($scope);
        };

        $scope.getUsers = function() {
          let defer = $q.defer();
          User.search({page: 1, autocomplete: true, q: $scope.search.query}).$promise.then(function(result) {
            if (result.tree_result_count) {
              result.users = result.users.concat({type: 'in-tree', tree_result_count: result.tree_result_count});
            }
            if (result.error) {
              result.users = [{type: 'error'}];
            } else if (!(result.users && result.users.length)) {
              result.users = [{type: 'empty'}, {type: 'see-more', length: 0}];
            } else {
              result.users = result.users.concat({
                type: 'see-more',
                length: result.result_count,
                shownAll: result.result_count === result.users.length
              });
            }
            result.users = result.users.map(function(user) {
              if (user.invitation) {
                user.invitation.displayed_send_date = $moment.fromServer(user.invitation.send_date).format('L');
              }
              return user;
            });
            defer.resolve(result.users);
          }).catch(function(err) {
            defer.reject(err);
          });
          return defer.promise;
        };

        $scope.$watch('search.query', function(newValue, oldValue) {
          if (oldValue && oldValue !== '') {
            $scope.tempSearchQuery = angular.copy(oldValue);
          }
        });

        $scope.autocompleteSuccess = function($item) {
          if ($item.type === 'see-more') {
            $scope.search.query = '';
            $timeout(function() {
              $state.go('u.search', {q: $scope.tempSearchQuery}, {reload: false});
            });
          } else if ($item.type === 'in-tree') {
            $scope.search.query = '';
            $timeout(function() {
              $state.go('u.tree', {user_id: $scope.userId, q: $scope.tempSearchQuery}, {reload: true});
            });
          } else if ($item.type !== 'empty') {
            $state.go('u.profile', {user_id: $item.id});
          }
        };

        $scope.doSearch = function() {
          $state.go('u.search', {q: $scope.search.query}, {reload: false});
        };

        $scope.$on('$stateChangeStart', function() {
          $scope.search = {
            query: ''
          };
        });

        pubsub.subscribe(PUBSUB.NOTIFICATIONS.UNREADCOUNT, function(event, unreadCount) {
          $timeout(function() {
            $scope.unreadNotifications = unreadCount;
          });
        }, $scope);

        pubsub.subscribe(PUBSUB.TREE.MATCHING.COUNT, function(event, matchingCounts) {
          $timeout(function() {
            $scope.matchingsCount = matchingCounts;
          });
        }, $scope);

        pubsub.subscribe(PUBSUB.TREE.REFRESH, function(event, tree) {
          $scope.treeType = tree.type;
        }, $scope);

        pubsub.subscribe(PUBSUB.MESSAGES.READ, function() {
          $timeout(function() {
            $scope.unreadMessages--;
          });
        }, $scope);

        pubsub.subscribe(PUBSUB.MESSAGES.UNREADCOUNT, function(event, unreadCount) {
          $timeout(function() {
            $scope.unreadMessages = unreadCount;
          });
        }, $scope);

        $scope.showNotifications = function() {
          pubsub.publish(PUBSUB.NOTIFICATIONS.TOGGLE);
        };

        $scope.showMatchings = function() {
          const treeType = sessionManager.getTreeType();
          if ($state.current.name !== 'u.tree' || !treeType || treeType !== 'detailed_web') {
            sessionManager.setTreeType('detailed_web');
            $state.go('u.tree', {user_id: $scope.userId}, {reload: true}).then(function() {
              const unbind = pubsub.subscribe(PUBSUB.TREE.READY, function() {
                $timeout(() => pubsub.publish(PUBSUB.TREE.MATCHING.TOGGLE));
                unbind();
              });
            });
          } else {
            $timeout(() => pubsub.publish(PUBSUB.TREE.MATCHING.TOGGLE));
          }
        };
      }
    };
  });
