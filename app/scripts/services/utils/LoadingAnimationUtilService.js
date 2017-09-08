angular.module('famicity')
  .factory('LoadingAnimationUtilService', function($rootScope, $q) {
    'use strict';
    let promises = [];
    const service = {
      activate() {
        $rootScope.showLoading = true;
      },
      deactivate() {
        $rootScope.showLoading = false;
      },
      addPromises(newPromises) {
        promises = promises.concat(newPromises);
        return promises;
      },
      resetPromises() {
        promises = [];
        return promises;
      },
      validateList() {
        return $q.all(promises).finally(function() {
          return service.deactivate();
        });
      }
    };
    return service;
  });
