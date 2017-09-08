angular.module('famicity.tree')
  .service('treeService', function(Tree, sessionManager, $state) {
    'use strict';
    const log = debug('fc-tree-service');
    return {
      userTree: function(user_id, type) {
        log('tree type: %o', type);
        type = type || 'web';
        const promise = Tree.tree_user({user_id: user_id, version: type}).$promise;
        promise.catch(function(response) {
          if (response.status === 403) {
            $state.go('u.tree', {user_id: sessionManager.getUserId()});
          }
        });
        return promise;
      },
      autocompleteSuccess(model) {
        const user = {
          first_name: model.first_name,
          last_name: model.last_name,
          email: model.email,
          birth_date: model.birth_date,
          death_date: model.death_date,
          sex: model.sex
        };
        user.user_info_attributes = {
          middle_name: model.middle_name,
          maiden_name: model.maiden_name,
          birth_place: model.birth_place
        };
        return [user, model.id, model.user_name];
      },
      cancelAutocompleteSelect() {
        const user = {
          first_name: null,
          last_name: null,
          email: null,
          birth_date: null,
          death_date: null,
          sex: null,
          birthDateValid: null,
          deathDateValid: null
        };
        user.user_info_attributes = {
          middle_name: null,
          maiden_name: null,
          birth_place: null
        };
        return [user, null, null];
      }
    };
  });
