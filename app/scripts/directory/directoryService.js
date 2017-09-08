angular.module('famicity')
  .service('directoryService', function(Directory) {
    'use strict';

    const getCustomDirectory = function(attrs) {
      return Directory.directory_user(attrs);
    };

    const createFromDirectory = function(attrs) {
      return new Directory({
        user: attrs
      }).$create_from_directory();
    };

    const destroyFromDirectory = function(id) {
      return new Directory().$destroy_from_directory({id});
    };

    const counters = function(attrs) {
      return Directory.counters(attrs).$promise;
    };

    return {
      getCustomDirectory,
      createFromDirectory,
      destroyFromDirectory,
      counters
    };
  });
