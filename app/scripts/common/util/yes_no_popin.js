angular.module('famicity')
  .factory('yesnopopin', function($modal, $translate) {
    'use strict';

    const ModalInstanceController = function($scope, $modalInstance) {
      $scope.yes = function() {
        $modalInstance.close();
      };

      $scope.no = function() {
        $modalInstance.dismiss('cancel');
      };
    };

    const getHtml = function(message, options) {
      return `<div class="yes-no-popin">
      <div class="popin-holder popin-holder-on">
        <div class="popin-dialog">
          <div class="popin-dialog-decoration"></div>
          <i ng-click="$dismiss()" class="fc fc-close pointer"></i>
          <h4 translate>${message}</h4>

          <form action="javascript:;" class="standard-form" id="intro_form" method="POST">
            <div class="form-group pull-right">
            <button class="btn ${options.noClass}" ng-click="no()" type="submit">${options.no}</button>
            <button class="btn ${options.yesClass}" ng-click="yes()" type="submit">${options.yes}</button>
            </div>
          </form>

        </div>
      </div>
    </div>`;
    };

    const openPromise = function(message = 'COMMON.POPIN.ARE_YOU_SURE', options = {}) {
      options.yes = options.yes || 'VALIDATE';
      options.no = options.no || 'CANCEL';
      options.yesClass = options.yesClass || 'btn-primary';
      options.noClass = options.noClass || 'btn-secondary';

      message = $translate.instant(message, options.messageOptions);
      options.yes = $translate.instant(options.yes, options.yesOptions);
      options.no = $translate.instant(options.no, options.noOptions);

      return $modal.open({
        template: getHtml(message, options),
        controller: ModalInstanceController
      });
    };
    const open = function(message, options) {
      return openPromise(message, options).result;
    };

    return {
      openPromise,
      open
    };
  });
