
angular.module('famicity').controller('AlbumsIndexController', function(
  $rootScope, $scope, $stateParams, $moment,
  ModalManager, Album, $q, LoadingAnimationUtilService,
  me, $state, albums) {
  'use strict';

  LoadingAnimationUtilService.resetPromises();
  LoadingAnimationUtilService.activate();
  $scope.userId = me.id;
  $scope.viewedUserId = $stateParams.user_id;
  $scope.currentTab = 'albums';
  $scope.sharedAlbums = Album.get_list_shared_albums({
    user_id: $scope.userId
  });

  $scope.albums = albums;

  $scope.openAddAlbumPopup = function() {
    ModalManager.open({
      templateUrl: '/scripts/albums/views/popup_albums_create.html',
      controller: 'PopupAlbumsCreateController',
      scope: $scope
    });
  };

  LoadingAnimationUtilService.validateList();
  $scope.goToAddAlbum = function() {
    $state.go('u.albums-create', {user_id: $scope.viewedUserId});
  };
});
