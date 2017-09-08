angular.module('famicity').controller('UserWebSitesController', function(
  $scope, $modalInstance, $location, notification, UserWebSite, webSiteFormMode, webSiteId) {
  'use strict';
  $scope.init = function() {
    $scope.webSiteFormMode = webSiteFormMode;
    $scope.webSiteId = webSiteId;
    $scope.formInProgress = false;
    $scope.submitted = false;
    $scope.formHolder = {};
    $scope.webSite = {};
    if ($scope.webSiteFormMode === 'edit') {
      $scope.webSite = UserWebSite.edit({
        user_id: $scope.viewedUserId,
        web_site_id: $scope.webSiteId
      });
    }
  };
  $scope.submit = function() {
    var promises, webSitePromise;
    promises = [];
    if ($scope.formHolder.webSiteForm.$valid) {
      $scope.submitted = true;
      if ($scope.webSiteFormMode === 'add') {
        webSitePromise = UserWebSite.save({
          user_id: $scope.viewedUserId
        }, $scope.webSite).$promise;
        promises.push(webSitePromise);
        webSitePromise.then(function() {
          notification.add('WEB_SITE_ADDED_SUCCESS_MSG');
          $modalInstance.close();
        });
      } else if ($scope.webSiteFormMode === 'edit') {
        webSitePromise = UserWebSite.update({
          user_id: $scope.viewedUserId,
          web_site_id: $scope.webSiteId
        }, $scope.webSite).$promise;
        promises.push(webSitePromise);
        webSitePromise.then(function() {
          notification.add('WEB_SIT_EDITED_SUCCESS_MSG');
          $modalInstance.close();
        });
      }
    } else {
      notification.add('INVALID_FORM', {warn: true});
    }
    return promises;
  };
  $scope.deleteWebsite = function() {
    var promises;
    promises = [];
    promises.push(UserWebSite['delete']({
      user_id: $scope.viewedUserId,
      web_site_id: $scope.webSiteId
    }).$promise.then(function() {
        notification.add('WEB_SIT_DELETED_SUCCESS_MSG');
        return $modalInstance.close();
      }));
    return promises;
  };
});
