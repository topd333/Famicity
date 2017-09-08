angular.module('famicity.gedcom')
  .controller('GedcomUploadingController',
  function(
    $scope, pubsub, PUBSUB, $state, sessionManager, profileService, me, gedcomService,
    $rootScope, ModalManager, notification, $stateParams, gedcomUploadService, $timeout, wizardService) {
    'use strict';
    var log = debug('fc-GedcomUploadingController');

    $scope.userId = me.id;
    profileService.getBasicProfile($scope.viewedUserId, 'short', $scope);
    $scope.uploadData = {
      uploadedBytes: null,
      totalBytes: null,
      uploadedPercent: null
    };
    $scope.uploadError = false;
    $scope.uploadSuccess = false;
    $scope.importValidated = false;
    $scope.secondAccess = false;

    const nextStateName = 'gedcom-import-wizard.steps.status';

    $scope.cancelUpload = function(redirectToForm) {
      $scope.setGedcomStatus('cancelling');
      gedcomUploadService.cancelAll();
      $scope.setGedcomStatus('canceled');
      notification.add('GEDCOM_IMPORT_CANCELED_SUCCESS_MSG');
      //if (redirectToForm) {
      //$state.go('u.gedcom-index', {user_id: $scope.userId});
      //}
    };

    var changeCancels = function(event, toState, toParams, fromState, fromParams) {
      if (toState && toState.name !== nextStateName) {
        var importStatus = $scope.gedcomImport.status;
        if (importStatus === 'uploading' || importStatus === 'uploaded') {
          $scope.cancelUpload();
        }
      }
    };
    $rootScope.$on('$stateChangeStart', changeCancels);

    /*  $scope.$on('$stateChangeStart', function(event, toState, toParams) {
     if (!$scope.uploadError && !$scope.importValidated && !$scope.importCanceled && (sessionManager.getToken() != null)) {
     event.preventDefault();
     $rootScope.$broadcast('$stateChangeInterrupted');
     $scope.stateChangeDetails.toState = toState;
     $scope.stateChangeDetails.toParams = toParams;
     ModalManager.open({
     templateUrl: '/views/popup/popup_exit_gedcom_upload_alert.html',
     controller: 'ExitGedcomUploadAlertPopupController',
     scope: $scope
     });
     }
     });*/

    $scope.$on('gedcomUploaderOnTotalProgress', function(event, args) {
      $timeout(function() {
        $scope.uploadData.uploadedBytes = args.totalUploadedBytes;
        $scope.uploadData.totalBytes = args.totalBytes;
        $scope.uploadData.uploadedPercent = 100 * $scope.uploadData.uploadedBytes / $scope.uploadData.totalBytes;
      });
    });

    $scope.$on('gedcomUploaderOnError', function(error) {
      $scope.setGedcomStatus('error');
      log('gedcomUploaderOnError %o', error);
      gedcomUploadService.cancelAll();
      $state.go('gedcom-import-wizard', {user_id: $scope.userId});
      notification.add('UPLOAD_FAILED_MSG', {warn: true});
    });

    $scope.$on('gedcomUploaderOnComplete', function(event, args) {
      if (args && args.xhr && args.xhr.status === 200) {
        $scope.setGedcomStatus('uploaded');
        $scope.gedcomImport.id = args.responseJSON.gedcom_import.id;
        log('gedcomUploaderOnComplete width id=%o', $scope.gedcomImport.id);
        $scope.uploadData.uploadedBytes = $scope.uploadData.totalBytes;
        $scope.uploadData.uploadedPercent = 100;
        $state.go(nextStateName);
      }
    });

    if ($stateParams.import_id) { // Existing imports
      log('Second access for import %o', $stateParams.import_id);
      $scope.gedcomImport.id = $stateParams.import_id;
      $scope.uploadSuccess = true;
      $scope.secondAccess = true;
    } else if (gedcomUploadService.getUploads()) {
      gedcomUploadService.uploadStoredFiles();
    } else {
      $scope.setGedcomStatus('canceled');
      $state.go('gedcom-import-wizard', {user_id: $scope.userId});
    }

  });
