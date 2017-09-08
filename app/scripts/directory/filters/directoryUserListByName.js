angular.module('famicity.directory')
  .filter('directoryUserListByName', function() {
    'use strict';
    return function(users) {
      const filtered = [];
      if (users) {
        let prevUser;
        let groupChanged = false;
        users.forEach(function(user) {
          if (user) {
            groupChanged = false;
            const userName = user.last_name;
            if (prevUser) {
              if (prevUser.last_name !== userName) {
                groupChanged = true;
              }
            } else {
              groupChanged = true;
            }
            if (groupChanged && userName) {
              filtered.push({separator: userName, id: userName + Date.now()});
            }
            filtered.push(user);
            prevUser = user;
          }
        });
      }
      return filtered;
    };
  });
