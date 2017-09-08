class FcFusionReceivedComplete {
  constructor() {

  }
}

angular.module('famicity')
.directive('fcFusionReceivedComplete', function() {
  'use strict';
  return {
    templateUrl: '/scripts/tree/fusions/directives/fc-fusion-received-complete.html',
    replace: true,
    restrict: 'E',
    controllerAs: 'fusionCtrl',
    scope: true,
    bindToController: {
      fusion: '=',
      userId: '='
    },
    controller: FcFusionReceivedComplete
  };
});
