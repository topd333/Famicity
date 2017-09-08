class FcFusionSentInProgress {
  constructor() {

  }
}

angular.module('famicity')
.directive('fcFusionSentInProgress', function() {
  'use strict';
  return {
    templateUrl: '/scripts/tree/fusions/directives/fc-fusion-sent-in-progress.html',
    replace: true,
    restrict: 'E',
    controllerAs: 'fusionCtrl',
    scope: true,
    bindToController: {
      fusion: '=',
      userId: '=',
      cancel: '&'
    },
    controller: FcFusionSentInProgress
  };
});
