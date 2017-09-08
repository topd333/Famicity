angular.module('famicity.tree')
  .controller('AddSecondParentController', function(
    $scope, navigation, $rootScope, $translate,
    someForm) {
    'use strict';
    $scope.currentForm = angular.extend($scope.currentForm || {}, someForm);

    $scope.childType =
      $translate.instant($scope.currentForm.hint === 'fc-add-relative.ADD_SON.HINT' ? 'fc-add-relative.CHILD_TYPE.OF_THE_SON' : 'fc-add-relative.CHILD_TYPE.OF_THE_DAUGHTER');

    $scope.currentForm.aChild =
      $translate.instant($scope.currentForm.hint === 'fc-add-relative.ADD_SON.HINT' ? 'fc-add-relative.CHILD_TYPE.A_SON' : 'fc-add-relative.CHILD_TYPE.A_DAUGHTER');

    $scope.currentForm.childSex = $scope.currentForm.hint === 'fc-add-relative.ADD_SON.HINT' ? 'male' : 'female';

    $scope.createParent = function() {
      $scope.childForm = angular.extend($scope.childForm, $scope.currentForm);
      // currentForm will become the parent form for a while
      navigation.go('u.tree.detail.createChildSecondParent');
    };

    /**
     * Add a relative.
     *
     * @param parentLink The relationship ('PA'rtner, 'B'rother/sister, 'P'arent)
     * @param sex The relative sex ('Male' if father or brother, 'Female' is mother or sister)
     * @param secondParentId @deprecated, should be type.parentLink
     * @param id
     * @param type The form to fill details about the relative.
     */
    $scope.openAddRelativePopup = function(parentLink, sex, secondParentId, id, type) {
      $rootScope.formModel.parentLink = type ? type.parentLink : parentLink;
      $rootScope.formModel.sex = type.sex;

      $rootScope.formModel.secondParentId = secondParentId;
      if (id) {
        $rootScope.formModel.user_info = $rootScope.formModel.user_info || {};
        $rootScope.formModel.user_info.id = id;
      }
      navigation.go('anonymous');
    };

    /**
     * Add a child with the given partner, if known.
     *
     * @param secondParentId The partner's id, of undefined if anonymous.
     */
    $scope.openAddRelativeChildPopup = function(secondParentId) {
      if (secondParentId) {
        $scope.formModel.secondParentId = secondParentId;
      }
      $scope.formModel.parentLink = 'S';
      $scope.formModel.isUpdate = false;

      navigation.go('add:' + secondParentId);
    };
  });
