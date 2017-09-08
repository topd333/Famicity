// @flow weak

angular.module('famicity')
  .controller('DirectoryInviteAddController', function(
    $scope, $rootScope, $q, $location, $state,
    directoryService, groupService, Invitation, $stateParams, ModalManager,
    notification, menu, LoadingAnimationUtilService) {
    'use strict';

    $scope.user = {};
    $scope.submitted = false;
    $scope.formInProgress = false;
    LoadingAnimationUtilService.validateList();
    $scope.randomExplanationId = Math.round(Math.random() + 1);
    $scope.isReset = $stateParams.reset;

    $scope.inviteContact = function() {
      let promises = [];
      $scope.submitted = true;
      let invitePromise = $q.defer();
      directoryService.createFromDirectory({
        first_name: $scope.user.firstName,
        last_name: $scope.user.lastName,
        email: $scope.user.email
      })
        .then(function(response) {
          let invitation = {
            mail_address: $scope.user.email,
            user_concerned_id: response.user.id
          };
          return new Invitation({invitation: invitation, type: 'I'}).$save({user_id: $scope.userId}).then(function() {
            invitePromise.resolve();
            $state.go($state.$current, {reset: true}, {reload: true});
            notification.add('INVITATION_SENT_SUCCESS_MSG');
          });
        });
      return promises;
    };

    $scope.addContact = function() {
      let promises = [];
      $scope.submitted = true;
      promises.push(directoryService.createFromDirectory({
        first_name: $scope.user.firstName,
        last_name: $scope.user.lastName,
        email: $scope.user.email
      }).then(function() {
        notification.add('USER_CREATED_SUCCESS_MSG');
        $state.go($state.$current, {reset: true}, {reload: true});
      }));
      return promises;
    };
  });
