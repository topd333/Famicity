angular.module('famicity.directory')
  .filter('directoryUsersList', function(util) {
    'use strict';
    return function(users) {
      const indexes = {};
      const filtered = [];
      if (users) {
        let prevUser;
        let groupChanged = false;
        const getInitial = function(user) {
          let initial;
          if (user.letter) {
            initial = user.letter;
          } else if (user.last_name) {
            initial = util.removeDiacritics(user.last_name).charAt(0).toUpperCase();
          } else if (user.user_name) {
            initial = util.removeDiacritics(user.user_name).charAt(0).toUpperCase();
          }
          return initial;
        };
        users.forEach(function(user) {
          if (user) {
            groupChanged = false;
            const userInitial = getInitial(user);
            if (prevUser) {
              if (getInitial(prevUser) !== userInitial) {
                groupChanged = true;
              }
            } else {
              groupChanged = true;
            }
            if (groupChanged && userInitial) {
              indexes[userInitial] = indexes[userInitial] ? indexes[userInitial] + 1 : 0;
              filtered.push({separator: userInitial, id: userInitial + indexes[userInitial]});
            }
            filtered.push(user);
            prevUser = user;
          }
        });
      }
      return filtered;
    };
  });
