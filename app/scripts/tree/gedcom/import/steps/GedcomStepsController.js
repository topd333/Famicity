angular.module('famicity.gedcom')
  .controller('GedcomStepsController',
  function(
    $scope, $state, profileService, me, ModalManager) {
    'use strict';

    $scope.uploading = true;

    $scope.userId = me.id;
    profileService.getBasicProfile($scope.viewedUserId, 'short', $scope);
    $scope.secondAccess = false;

    $scope.openCancelGedcomAlertPopup = function() {
      return ModalManager.open({
        templateUrl: '/views/popup/popup_gedcom_cancel_alert.html',
        controller: 'CancelGedcomAlertPopupController',
        scope: $scope
      });
    };

    $state.go('gedcom-import-wizard.steps.uploading');
  });
