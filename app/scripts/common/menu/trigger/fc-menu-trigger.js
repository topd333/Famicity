angular.module('famicity')
/**
 * When clicked, triggers the event associated with an action.
 */
  .directive('fcMenuTrigger', function(MENU, $state, pubsub) {
    'use strict';
    return {
      restrict: 'EA',
      templateUrl: '/scripts/common/menu/trigger/fc-menu-trigger.html',
      bindToController: true,
      controllerAs: 'trigger',
      controller($scope, $element) {
        const actionName = $element.attr('action');
        const currentStateName = $state.current.name;
        const menu = MENU[currentStateName];
        const action = menu.actions[actionName];
        if (action.event) {
          this.trigger = () => pubsub.publish(action.event);
        } else {
          throw Error(`No event defined in action "${actionName}"`);
        }
      }
    };
  });
