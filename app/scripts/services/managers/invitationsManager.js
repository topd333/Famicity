
angular.module('famicity').factory('invitationsManager', function() {
  'use strict';
  let pool = {
    users: [],
    emails: [],
    groups: [],
    comment: '',
    mail_address: '',
    invitation_id: ''
  };
  return {
    get(id) {
      if (id === 'users' || id === 'emails' || id === 'groups' || id === 'comment' || id === 'mail_address' || 'invitation_id') {
        return pool[id];
      }
    },
    set(id, value) {
      console.log('invitationsManager.set()');
      console.log(id);
      console.log(value);
      if (id === 'users' || id === 'emails' || id === 'groups' || id === 'comment' || id === 'mail_address' || 'invitation_id') {
        pool[id] = value;
      }
    },
    reset() {
      pool = {
        users: [],
        emails: [],
        groups: [],
        comment: '',
        mail_address: ''
      };
    },
    isEmpty(id) {
      return pool[id].length === 0;
    },
    isPristine() {
      return pool.users.length === 0 && pool.emails.length === 0 && pool.groups.length === 0 && pool.comment === '' && pool.mail_address === '';
    }
  };
});
