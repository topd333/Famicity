class FcFusionReceivedInProgress {
  constructor() {

  }
}

angular.module('famicity')
.directive('fcFusionReceivedInProgress', function() {
  'use strict';
  return {
    templateUrl: '/scripts/tree/fusions/directives/fc-fusion-received-in-progress.html',
    replace: true,
    restrict: 'E',
    controllerAs: 'fusionCtrl',
    scope: true,
    bindToController: {
      fusion: '=',
      userId: '=',
      accept: '&',
      refuse: '&'
    },
    controller: FcFusionReceivedInProgress
  };
});
