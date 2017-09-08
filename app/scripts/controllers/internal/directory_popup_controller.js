
angular.module('famicity').controller('InvitationAlertPopupController', function($scope) {
  'use strict';
  $scope.cancelUserSelection = function() {
    $scope.$parent.cancelUserSelection();
  };
});

angular.module('famicity').controller('AddGroupPopupController', function(
  $scope, $modalInstance, $state, groupService, notification, InvitationService) {
  'use strict';
  $scope.init = function() {
    var invitationService = InvitationService;
    $scope.addGroupFormsubmitted = false;
    $scope.formHolder = {};
    $scope.formInProgress = false;
  };
  $scope.addGroupFromsubmit = function() {
    var promises = [];
    $scope.addGroupFormsubmitted = true;
    if ($scope.formHolder.addGroupForm.$valid) {
      promises.push(groupService.createGroup($scope.userId, {
        group_name: $scope.formHolder.addGroupName
      }, $scope.$parent).then(function(response) {
        $state.go('u.directory.user-group', {
          group_id: response.group.id
        });
        $modalInstance.close();
      }));
    } else {
      notification.add('GROUP_NAME_EMPTY_ERROR_MSG');
    }
    return promises;
  };
});

angular.module('famicity').controller('AddContactsOptionsPopupController', function(
  $scope, $modalInstance, $location, $interval, $state) {
  'use strict';
  var interval, log;
  interval = null;
  log = debug('fc-imports-controller');
  $scope.goToImportPage = function() {
    $modalInstance.close();
  };
  $scope.goToAddContactPage = function() {
    $modalInstance.close();
    $state.go('u.directory.add', {user_id: $scope.viewedUserId});
  };
  $scope.goToInvitePage = function() {
    $modalInstance.close();
    $state.go('u.directory.invite', {user_id: $scope.viewedUserId});
  };
});
