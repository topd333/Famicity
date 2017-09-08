angular.module('famicity').factory('ServiceErrorHandler', function(notification) {
  'use strict';
  return {
    errorModelHandler(errorsArray) {
      let errorString = '';
      if (errorsArray && Object.keys(errorsArray).length) {
        // Iterate over each error category
        errorString = Object.keys(errorsArray).reduce(function(errors, category) {
          // Iterate over each message in the category
          let categoryErrors;
          if (angular.isArray(errorsArray[category])) {
            categoryErrors = errors + errorsArray[category].reduce((total, error) => total + error + '<br/>', '');
          } else {
            categoryErrors = errors + Object.keys(errorsArray[category]).reduce((total, key) => total + errorsArray[category][key] + '<br/>', '');
          }
          return categoryErrors;
        }, '');
      } else {
        errorString = 'Une erreur s\'est produite, merci de réessayer.';
      }
      return notification.create(errorString, 'alert-danger');
    }
  };
});
