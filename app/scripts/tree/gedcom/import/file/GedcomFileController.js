angular.module('famicity.gedcom')
  .controller('GedcomFileController',
  function(
    $scope, $location, $timeout, ModalManager, sessionManager,
    userService, gedcomUploadService, configuration, pubsub, $state,
    yesnopopin, me, PUBSUB) {
    'use strict';
    const log = debug('fc-GedcomFileController');

    log('upload setup');

    $scope.userId = me.id;

    this.userService = userService;
    $scope.upload_settings = {
      priority_to: true,
      erase_tree: true
    };

    this.userService.optionsToShow(sessionManager.getUserId()).then(function(response) {
      log('optionsToShow=%o', response);
      $scope.gedcomImport.optionsToShow = response.option_to_show;
    });

    $scope.$on('gedcomUploaderOnStatusChange', function(event, args) {
      if (args.newStatus === 'submitted') {
        $scope.gedcomImport.preloaded_file = gedcomUploadService.getFile(args.id);
        $scope.goToNextStep();
      }
    });
    const fileSelectionElement = angular.element('#uploadBtn')[0];
    gedcomUploadService.setParams(fileSelectionElement, configuration.api_url + '/users/' + sessionManager.getUserId() + '/gedcom_imports');

    $scope.skip = function() {
      yesnopopin.open('SKIP_WIZARD_GEDCOM_ALERT').then(function() {
        pubsub.publish(PUBSUB.USER.ACTIVATED);
        $scope.$parent.$parent.menuDisabled = false;
        $state.go('u.tree', {user_id: me.id});
      });
    };
  });
