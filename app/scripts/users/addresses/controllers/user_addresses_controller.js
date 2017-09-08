
angular.module('famicity').controller('UserAddressesController', function(
  $scope, $modalInstance, $location, $filter, notification, UserAddress, addressFormMode, addressId) {
  'use strict';
  $scope.init = function() {
    var i;
    $scope.addressFormMode = addressFormMode;
    $scope.addressId = addressId;
    $scope.formInProgress = false;
    $scope.submitted = false;
    $scope.addressTypeList = [
      {id: 0, key: 'perso'},
      {id: 1, key: 'pro'},
      {id: 2, key: 'other'},
      {id: 3, key: 'custom'}
    ];
    $scope.countryList = [];
    i = 0;
    while (i < 230) {
      $scope.countryList[i] = {
        id: i,
        key: ('COUNTRY_' + i).toUpperCase()
      };
      i++;
    }
    $scope.formHolder = {};
    $scope.address = {};
    $scope.selected_type = 0;
    $scope.selected_country = 75;
    if ($scope.addressFormMode === 'edit') {
      return UserAddress.edit({
        user_id: $scope.userId,
        address_id: $scope.addressId
      }).$promise.then(function(response) {
          $scope.address = new UserAddress(response.user_address);
        });
    }
  };
  $scope.selectCountry = function(country) {
    $scope.address['country'] = $scope.countryList[country].key;
  };
  $scope.selectAddressType = function(addressType) {
    $scope.address['address_type'] = $scope.addressTypeList[addressType];
  };
  $scope.submit = function() {
    var promises;
    promises = [];
    if ($scope.formHolder.addressForm.$valid) {
      $scope.submitted = true;
      if ($scope.addressFormMode === 'add') {
        promises.push(UserAddress.save({
          user_id: $scope.viewedUserId
        }, $scope.address).$promise.then(function() {
            notification.add('ADDRESS_ADDED_SUCCESS_MSG');
            $modalInstance.close();
          }));
      } else if ($scope.addressFormMode === 'edit') {
        promises.push(UserAddress.update({
          user_id: $scope.viewedUserId
        }, $scope.address).$promise.then(function() {
            notification.add('ADDRESS_EDITED_SUCCESS_MSG');
            $modalInstance.close();
          }));
      }
    } else {
      notification.add('INVALID_FORM', {warn: true});
    }
    return promises;
  };
  $scope.deleteAddress = function() {
    var promises;
    promises = [];
    promises.push(UserAddress['delete']({user_id: $scope.viewedUserId}, $scope.address).$promise.then(function() {
      notification.add('ADDRESS_DELETED_SUCCESS_MSG');
      $modalInstance.close();
    }));
    return promises;
  };
});

