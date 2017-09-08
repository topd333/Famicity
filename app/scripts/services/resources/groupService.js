angular.module('famicity')
  .service('groupService', function($location, $state, notification, Group) {
    'use strict';
    return {
      getGroups(user_id) {
        return Group.query({
          user_id
        }).$promise;
      },
      getGroupDetails(user_id, group_id, $scope) {
        return Group.get({
          user_id,
          group_id
        }, function(response) {
          if ($scope != null) {
            $scope.group = response.group;
            $scope.users = response.group.users;
            $scope.groupName = response.group.group_name;
          }
        });
      },
      deleteGroup(user_id, group_id, $scope) {
        return new Group.$delete({
          user_id,
          group_id
        }, function() {
          notification.add('GROUP_DELETED_SUCCESS_MSG');
          if ($scope.getGroups) {
            $scope.getGroups();
          }
          $state.go('u.directory.list', {
            user_id
          });
        });
      },
      updateGroup(user_id, group_id, attrs, $scope) {
        return new Group({
          id: group_id,
          group: attrs
        }).$update({
            user_id
          }, function(response) {
            notification.add('GROUP_EDITED_SUCCESS_MSG');
            $scope.renameGroupFormsubmitted = false;
            if ($scope.getGroups) {
              $scope.getGroups();
            }
            $scope.group.group_name = response.group.group_name;
            $state.go('u.directory.user-group', {
              group_id
            });
          });
      },
      createGroup: function(user_id, attrs, $scope) {
        return new Group({
          group: attrs
        }).$save({
            user_id: user_id
          }, function(response) {
            notification.add('GROUP_CREATED_SUCCESS_MSG');
            $scope.groups.push(response.group);
            $scope.addGroupName = '';
            $scope.addGroupFormsubmitted = false;
          });
      },
      addMembers: function(user_id, group_id, attrs) {
        return new Group({
          id: group_id,
          members: attrs
        }).$addMembers({user_id: user_id}).then(function(response) {
            notification.add('MEMBERS_ADDED_SUCCESS_MSG');
            //if ($scope.getGroups) {
            //  $scope.getGroups();
            //}
            //$scope.users = response.group.users;
          });
      },
      removeMembers: function(user_id, group_id, attrs/*, $scope*/) {
        return new Group({
          members: attrs,
          user_id: user_id,
          id: group_id
        }).$remove_members({}, (response) => {
          notification.add('MEMBERS_REMOVED_SUCCESS_MSG');
          // if ($scope.getGroups) {
          //  $scope.getGroups();
          // }
          let newUsers = response.group.users;
          // $scope.users = newUsers;
        });
      }
    };
  });
