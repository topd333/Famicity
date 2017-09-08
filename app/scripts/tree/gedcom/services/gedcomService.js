angular.module('famicity.gedcom')
  .service('gedcomService', function(Gedcom) {
    'use strict';

    return {
      getSummary: function(userId) {
        return Gedcom.summaries({user_id: userId}).$promise;
      },
      launchImport: function(userId, importId) {
        return Gedcom.launch_import({user_id: userId, id: importId}).$promise;
      },
      cancelImport: function(userId, importId) {
        return Gedcom.cancel_import({user_id: userId, id: importId}).$promise;
      },
      details: function(importId) {
        return Gedcom.details({id: importId}).$promise;
      },
      getPositionInQueue: function(userId, importId) {
        return Gedcom.position_in_queue({user_id: userId, id: importId}).$promise;
      }
    };
  });
