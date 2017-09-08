class FusionsLeftMenuDirective {
  constructor(fusionService) {
    fusionService.getSentInProgress({userId: this.userId})
      .then(response => this.sentFusions = response.fusions);
    fusionService.getReceivedInProgress({userId: this.userId})
      .then(response => this.receivedFusions = response.fusions);
  }
}

angular.module('famicity').directive('fcFusionsLeftMenu', function() {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/scripts/tree/fusions/directives/fc-fusions-left-menu.html',
    bindToController: {
      userId: '='
    },
    scope: true,
    controller: FusionsLeftMenuDirective,
    controllerAs: 'fusionLeftBlock'
  };
});
