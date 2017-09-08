angular.module('famicity')
  .service('notification', function($timeout, $translate, sessionManager) {
    'use strict';

    const duration = 4;
    const dismissableForTests = sessionManager.getFastAnimation() || false;

    const list = {};

    const create = function(text, type, delay, callback) {
      let prop;
      for (prop in list) {
        if (list.hasOwnProperty(prop) && !list[prop].dismissable) {
          delete list[prop];
        }
      }
      const timestamp = (new Date()).getTime();
      list[timestamp] = {
        text,
        type,
        dismissable: dismissableForTests || delay !== null && (delay === false || delay === 0),
        undo() {
          delete list[timestamp];
          if (callback) {
            return callback();
          }
        }
      };
      if (!dismissableForTests && !(delay !== null && (delay === false || delay === 0))) {
        $timeout(function() {
          delete list[timestamp];
        }, (delay || duration) * 1000);
      }
    };

    return {

      /**
       * add a notification
       * @param {string} messageKey - notification translate key
       * @param {Object} options
       * @param {Boolean} options.warn - is the notification a warning?
       * @param {Object} options.messageParams - translate params
       * @param {number} options.delay - notification delay
       * @param {number} options.callback - notification callback
       */
      add(messageKey, {warn = false, messageParams = {}, delay = null, callback = null} = {warn: false}) {
        const type = warn ? 'alert-danger' : 'alert-success';
        $translate(messageKey, messageParams).then(function(translatedValue) {
          create(translatedValue, type, delay, callback);
        });
      },

      /**
       * return notifications by given type
       * @type {string}
       * @returns {Array}
       */
      getByType(type) {
        return Object.keys(list).reduce((filteredList, timestamp) => {
          if (list[timestamp].type === type) {
            filteredList.push(list[timestamp]);
          }
          return filteredList;
        }, []);
      },

      /**
       * remove notifications by given type
       * @type {string}
       */
      removeByType(type) {
        for (const prop in list) {
          if (list.hasOwnProperty(prop) && list[prop].type === type) {
            delete list[prop];
          }
        }
      },
      create,
      list
    };
  });
