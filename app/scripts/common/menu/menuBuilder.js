angular.module('famicity')
.constant('MENU_CHANGE_REQUEST', 'fc-menu.changeRequest')
.constant('MENU_CHANGE_EVENT', 'fc-menu.changeDone')
.service('menuBuilder', function(pubsub, MENU_CHANGE_EVENT, $state, MENU) {
  'use strict';

  let currentMenu;
  let menuBuilder;

  const onChange = function(newMenu, callback) {
    pubsub.subscribe(MENU_CHANGE_EVENT, callback);
  };

  /**
   * Notifies that the current menu must change.
   *
   * @param newMenu The new menu to display.
   */
  const changedTo = function(newMenu) {
    return pubsub.publish(MENU_CHANGE_EVENT, newMenu, {pooled: true});
  };

  /**
   * Set the currently built menu as the new one to display
   */
  const changed = function() {
    return changedTo(currentMenu);
  };

  const newMenu = function() {
    currentMenu = {
      actions: [],
      // Default number of actions to display before more ("...")
      actionsMax: 4
    };
    // changed();
    return menuBuilder;
  };

  /**
   * Get the currently built menu.
   */
  const getMenu = () => currentMenu;

  /**
   * Set the currently built menu as the new one to display
   *
   * @return the built menu
   */
  const build = () => {
    changed();
    return getMenu();
  };

  const withTitle = (title) => {
    currentMenu.title = title;
    // changed();
    return menuBuilder;
  };

  /**
   * Register a new action for this menu.
   *
   * @param action The action object.
   * @returns {*}
   */
  const withAction = function(action) {
    if (action.event) {
      if (action.onActive) {
        throw Error(`Action cannot both ask to publish an event "${action.event}" and to execute some onActive() callback`);
      } else {
        action.onActive = () => pubsub.publish(action.event);
      }
    }
    currentMenu.actions.push(action);
    // changed();
    return menuBuilder;
  };

  const limitedTo = function(max) {
    currentMenu.actionsMax = max;
    // changed();
    return menuBuilder;
  };

  /**
   * Add a context to the execution of a menu action.
   *
   * @param context The context that will be passed to onActive()
   * @returns {*}
   */
  const inContext = (context) => {
    currentMenu.context = context;
    // changed();
    return menuBuilder;
  };

  /**
   * Bind an action to the execution of a function.
   *
   * @param actionName The name of the triggered action, in the context of the current navigation state.
   * @param callback The function to execute
   * @param scope
   */
  const bind = (actionName, callback, scope) => {
    const stateMenu = MENU[$state.current.name];
    const action = stateMenu.actions[actionName];
    if (action.event) {
      if (!scope) {
        throw new Error('You forgot to provide scope parameter for event unsubscription');
      }
      pubsub.subscribe(action.event, () => callback(), scope);
    } else {
      throw Error('No event defined for action "%o"', actionName);
    }
  };

  menuBuilder = {
    build,
    newMenu,
    getMenu,
    withTitle,
    withAction,
    onChange,
    changedTo,
    changed,
    limitedTo,
    inContext,
    bind
  };
  return menuBuilder;
});
