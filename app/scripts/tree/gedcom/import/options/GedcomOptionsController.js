angular.module('famicity.gedcom')
  .controller('GedcomOptionsController', function(
    $scope, $location, $timeout, ModalManager, sessionManager,
    userService, gedcomUploadService, configuration, pubsub, $state, notification) {
    'use strict';
    const log = debug('fc-GedcomOptionsController');

    if (!$scope.gedcomImport || !$scope.gedcomImport.preloaded_file) {
      notification.add('GEDCOM.IMPORT.AHEAD.PLEASE_PROVIDE_FILE');
      $state.go('gedcom-import-wizard.file');
      return;
    }

    $scope.gedcomImport.options = {
      priorityTo: 'gedcom'
    };

    if ($scope.gedcomImport.optionsToShow.empty_tree) {
      // Import option make no sense if the tree is empty
      $scope.gedcomImport.options.priorityTo = 'erase';
      $scope.goToNextStep();
    }

    $scope.startUpload = function() {
      if ($scope.gedcomImport.preloaded_file) {
        gedcomUploadService.addParams({
          priority_to: $scope.gedcomImport.options.priorityTo
        });
        if ($scope.gedcomImport.optionsToShow.erase_tree) {
          gedcomUploadService.addParams({
            erase_tree: $scope.gedcomImport.options.priorityTo === 'erase'
          });
        }
        $scope.goToNextStep();
      }
    };
  });
