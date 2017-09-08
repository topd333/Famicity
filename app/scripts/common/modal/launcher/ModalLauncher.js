angular.module('famicity')
/**
 * Listen for popin events to show them anytime
 */
  .service('ModalLauncher', function(ModalManager, pubsub, PUBSUB) {
    'use strict';

    const modals = {};

    pubsub.subscribe(PUBSUB.HELP.POPINS, function(event, info) {
      // $scope.me = info.infos;
      const popins = info.popins;
      if (popins) {
        let modalParams;
        for (modalParams in popins) {
          if (popins.hasOwnProperty(modalParams)) {
            const modal = ModalManager.open(modals[modalParams](info));
          }
        }
      }
    });

    return {
      register(popinKey, modal) {
        modals[popinKey] = modal;
      }
      // $scope.modalClose = function() {
      //  ModalManager.close($scope.modal.result);
      // };
    };
  });
