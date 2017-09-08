
angular.module('famicity').controller('UserInfosUpdateController', function(
  $scope, $state, $rootScope, $stateParams,
  UserInfo, notification, me) {
  'use strict';
  $scope.init = function() {
    $scope.userId = me.id;
    $scope.locationType = 'profile';
    $scope.passionsData = UserInfo.edit({
      user_id: $scope.userId
    });
    $scope.formInProgress = false;
  };
  $scope.submitPassions = function() {
    const promises = [];
    delete $scope.passionsData.id;
    delete $scope.passionsData.type;
    const data = {
      user: {
        id: $scope.userId
      },
      user_info: $scope.passionsData
    };
    promises.push(UserInfo.update({
      user_id: $scope.userId
    }, data).$promise.then(function() {
        notification.add('INFORMATIONS_MODIFIED_SUCCESS_MSG');
        $state.go('u.profile', {user_id: $scope.userId});
      }));
    return promises;
  };
});

