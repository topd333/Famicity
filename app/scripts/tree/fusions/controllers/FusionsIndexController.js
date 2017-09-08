angular.module('famicity.fusions').controller('FusionsIndexController', function(
  $scope, $state, profileService, fusionService,
  notification, me, fusions) {
  'use strict';

  const log = debug('fc-FusionsIndexController');

  $scope.fusions = fusions;
  $scope.userId = me.id;
  profileService.getBasicProfile(me.id, 'short')
    .then(function(user) {
      $scope.basicProfile = user;
    });
  $scope.infiniteScrollLoading = false;
  $scope.infiniteScrollDisabled = false;

  $scope.cancel = function(id) {
    log('cancel %o', id);
    fusionService.cancel({userId: $scope.userId, id})
    .then(function() {
      notification.add('FUSION_CANCEL_SUCCESS_MSG');
      $state.go($state.$current, null, {reload: true});
    });
  };
  $scope.accept = function(id) {
    log('accept %o', id);
    fusionService.accept({userId: $scope.userId, id})
    .then(function() {
      notification.add('FUSION_ACCEPT_SUCCESS_MSG');
      $state.go($state.$current, null, {reload: true});
    });
  };
  $scope.refuse = function(id) {
    log('refuse %o', id);
    fusionService.refuse({userId: $scope.userId, id})
    .then(function() {
      notification.add('FUSION_DECLINE_SUCCESS_MSG');
      $state.go($state.$current, null, {reload: true});
    });
  };
});
