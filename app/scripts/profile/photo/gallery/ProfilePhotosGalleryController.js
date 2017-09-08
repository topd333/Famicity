angular.module('famicity')
  .controller('ProfilePhotosGalleryController', function(
  $scope, $state, $rootScope, $location,
  profileService, $stateParams, notification, me) {
  'use strict';
  $scope.init = function() {
    $scope.locationType = 'profile';
    $scope.userId = me.id;
    $scope.viewedUserId = $stateParams.user_id;
    return profileService.get($scope.viewedUserId, $scope);
  };
});
