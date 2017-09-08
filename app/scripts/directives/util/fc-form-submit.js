angular.module('famicity')
.directive('fcFormSubmit', function($q, $translate, $rootScope, $timeout) {
  'use strict';

  const log = debug('fc-form-submit');

  return {
    restrict: 'A',
    scope: {
      formInProgress: '=?',
      submitMethod: '&?',
      activateOnThen: '=?'
    },
    link($scope, element, attrs) {
      let buttonText = null;
      let init = false;
      let loadingText = $translate.instant('LOADING');
      const unbind = $rootScope.$on('$translateChangeSuccess', function() {
        loadingText = $translate.instant('LOADING');
      });
      $rootScope.$on('$destroy', unbind);
      if ($scope.formInProgress == null) {
        $scope.formInProgress = false;
      }

      $scope.activateOnThen = $scope.activateOnThen || false;
      if (attrs.submitMethod) {
        if (element[0].tagName === 'FORM') {
          element.on('submit', function() {
            return $scope.process();
          });
        } else {
          element.on('click', function() {
            return $scope.process();
          });
        }
      }

      $scope.$watch('formInProgress', function(value) {
        if (!init) {
          init = true;
          return;
        }
        log('form pending, element: %o, %o', element[0].tagName, value);
        if (element[0].tagName !== 'FORM') {
          if ($scope.formInProgress && (buttonText === null || buttonText === '' || /([A-Z]|_|\.)+$/.test(buttonText))) {
            buttonText = element.html();
          }
          if (value) {
            element.html(loadingText);
            element.addClass('disabled').attr('disabled', 'disabled');
          } else {
            element.html(buttonText);
            element.removeClass('disabled').removeAttr('disabled');
          }
        }
      });

      $scope.process = function() {
        if (!$scope.formInProgress) {
          $scope.formInProgress = true;
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          const promises = $scope.submitMethod();
          if (!promises || promises.length <= 0) {
            $scope.formInProgress = false;
          }
          $q.all(promises).catch(function() {
            $scope.formInProgress = false;
          });
          if ($scope.activateOnThen) {
            $q.all(promises).then(function() {
              $scope.formInProgress = false;
            });
          }
        }
      };
    }
  };
});
