class FcFusionSentComplete {
  constructor() {

  }
}

angular.module('famicity')
.directive('fcFusionSentComplete', function() {
  'use strict';
  return {
    templateUrl: '/scripts/tree/fusions/directives/fc-fusion-sent-complete.html',
    replace: true,
    restrict: 'E',
    controllerAs: 'fusionCtrl',
    scope: true,
    bindToController: {
      fusion: '=',
      userId: '='
    },
    controller: FcFusionSentComplete
  };
});
