angular.module('famicity')
  .directive('fcAutocomplete', function($filter, $q, Permission, permissionService, util, $timeout) {
    'use strict';

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    return {
      restrict: 'EA',
      scope: {
        /**
         * Currently selected, to remove from proposals
         */
        selected: '=?',
        /**
         * All proposals
         */
        all: '=?',
        /**
         * Input type
         */
        allowed: '=',
        /**
         * Proposal selection callback
         */
        onSelect: '=',
        /**
         * Backspace callback
         */
        onRemove: '&?',
        placeholder: '@',
        /**
         * Maximum number of proposals to display
         */
        max: '=',
        allowEmails: '=?'
      },
      templateUrl: '/scripts/common/permission/edit/fc-autocomplete.html',
      replace: true,
      link(scope, elem) {
        $('html').click(function() {
          $timeout(function() {
            scope.showProposals = false;
          });
        });
        elem.click(function() {
          event.stopPropagation();
        });
        if (!scope.selected) {
          scope.selected = [];
        }
        scope.inputModel = {};

        let inputElem = elem.find('input');
        let input = inputElem[0];

        function focus() {
          input.focus();
        }

        let getAll;
        if (scope.all) {
          let array = scope.all;
          getAll = function(inputVal) {
            let deferred = $q.defer();
            let filteredArray = $filter('filter')(array, inputVal);
            deferred.resolve(filteredArray);
            return deferred.promise;
          };
        } else {
          getAll = function(inputVal) {
            return Permission.autocomplete({query: inputVal}).$promise;
          };
        }

        let lastIndex;
        scope.currentProposal = null;

        function alreadySelected(proposal) {
          return permissionService.existsIn(scope.selected, proposal);
        }

        function updateProposals() {
          scope.proposals = [];
          let inputValue = inputElem.val();
          scope.showProposals = inputValue.indexOf('@') < 0;
          if (scope.showProposals) {
            getAll(inputValue).then(function(all) {
              for (let i = 0; i < all.length; ++i) {
                let proposal = all[i];
                proposal.type = proposal.email ? 'user' : 'group';
                let found = alreadySelected(proposal);
                if (!found) {
                  scope.proposals.push(proposal);
                }
              }
              lastIndex = Math.min(scope.proposals.length - 1, scope.max - 1);
              scope.currentProposal = null;
            });
          }
        }

        let debouncedUpdateProposals = util.debounce(updateProposals, 500);

        function selectEmail() {
          let email = scope.inputModel.text;
          if (scope.allowEmails && validateEmail(email)) {
            let emailProposal = {id: email, name: email};
            if (!alreadySelected(emailProposal)) {
              scope.select(emailProposal);
              return true;
            }
          }
          return false;
        }

        scope.validate = function() {
          let handled = false;
          if (scope.currentProposal) {
            handled = scope.select(scope.currentProposal);
          } else {
            handled = selectEmail();
          }
          return handled;
        };

        scope.keyChar = function(event) {
          switch (event.charCode) {
            // Space
            case 32:
            // Comma
            case 44:
            // Semicolon
            case 94:
              if (scope.validate()) {
                event.preventDefault();
              }
              break;
            default:
          }
        };

        scope.keyTrap = function(event) {
          let currentPos;
          if (scope.currentProposal) {
            currentPos = scope.proposals.indexOf(scope.currentProposal);
          }
          switch (event.keyCode) {
            case 27:
              scope.showProposals = false;
              break;
            case 8:
              if (input.selectionStart <= 0) {
                scope.remove();
                focus();
              } else {
                debouncedUpdateProposals();
              }
              break;
            // Tab
            case 9:
            // Enter
            case 13:
              if (scope.validate()) {
                event.preventDefault();
              }
              break;
            // Left arrow
            case 37:
            // Up arrow
            case 38:
              if (currentPos > 0) {
                currentPos -= 1;
              } else {
                currentPos = lastIndex;
              }
              scope.currentProposal = scope.proposals[currentPos];
              break;
            // Right arrow
            case 39:
            // Down arrow
            case 40:
              if (currentPos >= 0) {
                currentPos = currentPos < lastIndex ? currentPos + 1 : 0;
              } else {
                currentPos = 0;
              }
              scope.currentProposal = scope.proposals[currentPos];
              break;
            default:
              debouncedUpdateProposals();
            // input.style.width = (inputElem.val().length + 1) + 'em';
          }
          focus();
        };

        scope.select = function(proposal) {
          if (!proposal.error) {
            scope.selected = scope.onSelect(proposal);
          }
          // Clean input after selection
          scope.inputModel.text = '';
          updateProposals();
          // Hide proposals popup
          scope.showProposals = false;
          focus();
          return true;
        };

        scope.remove = function() {
          scope.onRemove();
          updateProposals();
        };
      }
    };
  });
