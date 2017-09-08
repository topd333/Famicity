// @flow weak

angular.module('famicity')
  .controller('DirectoryImportExternalController', function(
    $scope, $stateParams, $interval, $timeout, $state,
    InvitationService, ContactsImportService, LoadingAnimationUtilService) {
    'use strict';
    LoadingAnimationUtilService.deactivate();
  });
