angular.module('famicity')
  .directive('fcPermissionProposal', function() {
    'use strict';
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        object: '=',
        onSelect: '&'
      },
      templateUrl: '/scripts/common/permission/edit/fc-permission-proposal.html'
    };
  });
