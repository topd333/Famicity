angular.module('famicity').filter('directoryGroupsList', function(util) {
  'use strict';
  return function(groups) {
    let filtered;
    let getInitial;
    let group_changed;
    let new_field;
    let prev_group;
    if (groups) {
      filtered = [];
      prev_group = null;
      group_changed = false;
      new_field = 'group_by_CHANGED';
      getInitial = function(group) {
        if (group.group_name) {
          group.initial = util.removeDiacritics(group.group_name.charAt(0)).toUpperCase();
        }
        return group.initial;
      };
      angular.forEach(groups, function(group) {
        group_changed = false;
        if (prev_group !== null) {
          if (getInitial(prev_group) !== getInitial(group)) {
            group_changed = true;
          }
        } else {
          group_changed = true;
        }
        group[new_field] = Boolean(group_changed);
        filtered.push(group);
        prev_group = group;
      });
    }
    return filtered;
  };
});
