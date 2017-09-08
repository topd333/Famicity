angular.module('famicity')
  .service('pendingFormsManagerService', function(
    $rootScope, ModalManager, $state, sessionManager, yesnopopin, $translate) {
    'use strict';
    let formsList = {};

    function _removeForm(keyToDelete) {
      angular.forEach(formsList, function(value, key) {
        if (key === keyToDelete) {
          return delete formsList[key];
        }
      });
      if (Object.keys(formsList).length <= 0) {
        $(window).unbind('beforeunload');
      }
      return formsList;
    }

    function _resetFormsToReset(toState, toParams, formsToReset) {
      angular.forEach(formsToReset, function(keyToDelete) {
        _removeForm(keyToDelete);
      });
      if (toState) {
        $state.go(toState.name, toParams);
      }
    }

    function warnUser(toState, toParams, formsToReset, event) {
      event.preventDefault();
      $rootScope.$broadcast('$stateChangeInterrupted');
      yesnopopin.open('PENDING_FORM_ALERT', {
        yes: 'CONFIRM',
        no: 'STAY_HERE'
      }).then(function() {
        _resetFormsToReset(toState, toParams, formsToReset);
      });
    }

    const checkClosingForm = function(event, toStateArg, toParams) {
      const formsToReset = [];
      const toState = toStateArg;
      if (sessionManager.getToken() != null) {
        const authorizedFormRoutes = toState && toState.data && toState.data.authorizedFormRoutes ? toState.data.authorizedFormRoutes : [];
        angular.forEach(formsList, function(value, key) {
          if (authorizedFormRoutes.indexOf(key) < 0) {
            formsToReset.push(key);
          }
        });
        if (formsToReset.length > 0) {
          warnUser(toState, toParams, formsToReset, event);
        }
      } else {
        formsList = {};
      }
    };

    $rootScope.$on('$stateChangeStart', checkClosingForm);

    return {
      addForm(mainKey, secondaryKey, data) {
        if (!formsList[mainKey]) {
          formsList[mainKey] = {};
        }
        formsList[mainKey][secondaryKey] = data;
        $(window).bind('beforeunload', function() {
          return $translate.instant('PENDING_FORM_ALERT');
        });
        return formsList[mainKey];
      },
      getForm(mainKey) {
        return formsList[mainKey] ? formsList[mainKey] : false;
      },
      removeForm(keyToDelete) {
        return _removeForm(keyToDelete);
      },
      getFormattedInvitations(invitations) {
        let invitationsArray;
        if (invitations) {
          invitationsArray = invitations.map(invitation => invitation.email);
        }
        return invitationsArray;
      }
    };
  });
