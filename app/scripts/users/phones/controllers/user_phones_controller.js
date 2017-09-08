
angular.module('famicity').controller('UserPhonesController', function(
  $scope, $modalInstance, $location, $filter, notification, UserPhone, phoneFormMode, phoneId) {
  'use strict';
  $scope.init = function() {
    $scope.phoneFormMode = phoneFormMode;
    $scope.phoneId = phoneId;
    $scope.formInProgress = false;
    $scope.submitted = false;
    $scope.phoneTypeList = [
      {id: 0, key: 'perso'},
      {id: 1, key: 'pro'},
      {id: 2, key: 'other'},
      {id: 3, key: 'custom'}
    ];
    $scope.formHolder = {};
    $scope.phone = {};
    $scope.selected_type = 0;
    if ($scope.phoneFormMode === 'edit') {
      $scope.phone = UserPhone.edit({
        user_id: $scope.viewedUserId,
        phone_id: $scope.phoneId
      });
    }
  };
  $scope.selectPhoneType = function(phoneType) {
    $scope.phone['phone_type'] = $scope.phoneTypeList[phoneType];
  };
  $scope.submit = function() {
    var phonePromise, promises;
    promises = [];
    if ($scope.formHolder.phoneForm.$valid) {
      $scope.submitted = true;
      if ($scope.phoneFormMode === 'add') {
        phonePromise = UserPhone.save({
          user_id: $scope.viewedUserId
        }, $scope.phone).$promise;
        promises.push(phonePromise);
        phonePromise.then(function() {
          notification.add('PHONE_NUMBER_ADDED_SUCCESS_MSG');
          $modalInstance.close();
        });
      } else if ($scope.phoneFormMode === 'edit') {
        phonePromise = UserPhone.update({
          user_id: $scope.viewedUserId,
          phone_id: $scope.phone.id
        }, $scope.phone).$promise;
        promises.push(phonePromise);
        phonePromise.then(function() {
          notification.add('PHONE_NUMBER_EDITED_SUCCESS_MSG');
          $modalInstance.close();
        });
      }
    } else {
      notification.add('INVALID_FORM', {warn: true});
    }
    return promises;
  };
  $scope.deletePhone = function() {
    var promises;
    promises = [];
    promises.push(UserPhone['delete']({
      user_id: $scope.viewedUserId,
      phone_id: $scope.phone.id
    }).$promise.then(function() {
        notification.add('PHONE_NUMBER_DELETED_SUCCESS_MSG');
        return $modalInstance.close();
      }));
    return promises;
  };
});
