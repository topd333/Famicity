
angular.module('famicity').controller('PopupAlbumsCreateController', function($scope, $modalInstance, $state) {
  'use strict';
  $scope.goToCreateAlbum = function() {
    if ($scope.event) {
      $state.go('u.albums-create', {user_id: $scope.viewedUserId, event_id: $scope.event.id});
    } else {
      $state.go('u.albums-create', {user_id: $scope.viewedUserId});
    }
    $modalInstance.close();
  };
});
