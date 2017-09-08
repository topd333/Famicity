angular.module('famicity').factory('directoryManagerService', function() {
  'use strict';
  return {
    data: {
      group: {
        users: []
      },
      groups: {
        list: []
      },
      invitations: {
        users: [],
        emails: [],
        comment: '',
        recipients: ''
      }
    }
  };
});
