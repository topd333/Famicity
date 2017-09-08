angular.module('famicity').controller('ProfilePhotosWebcamController', function(
  $scope, $state, $rootScope, $location, $stateParams,
  profileService, notification, me) {
  'use strict';
  $scope.init = function() {
    $scope.locationType = 'profile';
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    return profileService.get($scope.viewedUserId, $scope);
  };
});
