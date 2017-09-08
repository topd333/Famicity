angular.module('famicity')
  .controller('MessagesWelcomeController', function($scope, $state, ROUTE, pubsub, PUBSUB) {
    'use strict';
    $scope.isReady.promise.then(() => {
      if ($state.current.name === ROUTE.MESSAGE.WELCOME && !$scope.isMobile) {
        if ($scope.messages.length) {
          $state.go(ROUTE.MESSAGE.GET, {
            user_id: $scope.userId,
            message_id: $scope.messages[0].id
          }, {location: 'replace'});
        } else {
          $state.go(ROUTE.MESSAGE.EMPTY, null, {
            location: false
          });
        }
      } else if ($state.current.name === ROUTE.MESSAGE.WELCOME) {
        $scope.$parent.showMode = false;
        $scope.$parent.currentId = null;
      }
    });
    pubsub.subscribe(PUBSUB.MESSAGES.WRITE, () => $state.go(ROUTE.MESSAGE.CREATE), $scope);
  });
