angular.module('famicity.directory')
  .controller('InviteAfterImportController', function(
    $scope, $stateParams, $location, $state, Directory, InvitationService,
    LoadingAnimationUtilService, pendingFormsManagerService, me, $q) {
    'use strict';

    var invitationService = InvitationService;

    LoadingAnimationUtilService.resetPromises();
    $scope.selectedMatch = [];
    $scope.selectedNoMatch = [];
    $scope.$parent.hideLeftColumnBlock = true;
    $scope.userId = me.id;
    $scope.search = {criteria: ''};
    Directory.getImports({match: true}).$promise.then(function(response) {
      $scope.match = response.map(user => {
        user.selected = true;
        return user;
      });
      $scope.selectedMatch = response;
    });
    Directory.getImports({match: false}).$promise.then(function(response) {
      $scope.noMatch = response;
    });

    $scope.loadMore = function(page, search) {
      const promises = [];
      const promiseNomatch = Directory.getImports({
        match: false,
        q: search,
        page: page
      }).$promise;
      promiseNomatch.then(function(response) {
        response = response.map(user => {
          if ($scope.selectedNoMatch.map(selectedNomatch => selectedNomatch.id).indexOf(user.id) > -1) {
            user.selected = true;
          }
          return user;
        });
        $scope.noMatch = page === 1 ? response : $scope.noMatch.concat(response);
      });
      promises.push(promiseNomatch);
      if (page === 1) {
        const promiseMatch = Directory.getImports({
          match: true,
          q: search,
          page: page
        }).$promise;
        promiseMatch.then(function(response) {
          response = response.map(user => {
            if ($scope.selectedMatch.map(selectedMatch => selectedMatch.id).indexOf(user.id) > -1) {
              user.selected = true;
            }
            return user;
          });
          $scope.match = response;
        });
        promises.push(promiseMatch);
      }
      return $q.all(promises);
    };

    $scope.invite = function() {
      var formData, selectedNoMatch, usersToInvite;
      var promises = [];
      var selectedMatch = $scope.match.filter(function(user) {
        return user.selected;
      });
      selectedNoMatch = $scope.noMatch.filter(function(user) {
        return user.selected;
      });
      usersToInvite = selectedMatch.concat(selectedNoMatch).map(function(user) {
        return user.id;
      });
      if ($stateParams.formKey != null) {
        formData = pendingFormsManagerService.getForm($stateParams.formKey);
        formData.permissions.user_permissions =
          formData.permissions.user_permissions.concat(selectedMatch.concat(selectedNoMatch));
      } else {
        promises.push(invitationService.send_multiple_invitations({
          user_ids: usersToInvite,
          user_id: $scope.userId
        }).$promise.then(function() {
            $location.url($stateParams.redirect);
            if ($scope.$parent !== null) {
              $scope.$parent.hideLeftColumnBlock = false;
            }
          }));
      }
      $location.url($stateParams['redirect']);
      $scope.$parent.hideLeftColumnBlock = false;
      return promises;
    };
  });

