describe('Blog post controller', function() {
  'use strict';

  // load module
  beforeEach(module('famicity', function($provide) {
    // Fake locale setting to avoid locale script loading failure
    $provide.provider('tmhDynamicLocale', function() {
      this.$get = function() {
        return {
          set: function(locale) {
            //console.log('Locale set to ' + locale);
          }
        };
      };
    });
  }));

  /**
   * Mocked pending form manager
   */
  var formsList = {};
  var pendingFormsManager = {
    getForm: function(mainKey) {
      return formsList[mainKey] ? formsList[mainKey] : false;
    },
    addForm: function(mainKey, secondaryKey, data) {

    }
  };

  /**
   * Mocked Post resource
   */
  var postResource = {};

  /**
   * Mocked Permission resource
   */
  var permissionResource = {
    get_default: function() {
      var response = {
        permissions: {}
      };
      return {
        $promise: {
          then: function(callback) {
            callback(response);
          }
        }
      };
    }
  };

  /**
   * Mocked notification object.
   *
   * @type {{list: Array, add: Function}}
   */
  var notification = {
    list: [],
    add: function(msg) {
      this.list.push(msg);
    }
  };

  describe('with empty form', function() {
    /**
     * Dummy form
     */
    var formData = {
      post: {}
    };

    /**
     * Dummy current user
     * @type {{id}}
     */
    var me = {
      id: 2012
    };

    /**
     * Dummy state params.
     *
     * @type {{email: string, password: string}}
     */
    var stateParams = {};

    var scope;
    var locale = 'fr';
    var ctrl;

    beforeEach(inject(function($rootScope, $controller, $moment, $translate, $q, $filter, $location, ModalManager) {
      scope = $rootScope.$new();
      ctrl = $controller('BlogPostAddController', {
        $q: $q,
        $scope: scope,
        $stateParams: stateParams,
        $filter: $filter,
        $location: $location,
        $state: {
          previous: {
            name: 'prev'
          }
        },
        pendingFormsManagerService: pendingFormsManager,
        Post: postResource,
        Permission: permissionResource,
        notification: notification,
        // Unused by the method!
        configuration: {},
        locale: locale,
        ModalManager: ModalManager,
        me: me,
        $moment: $moment
      });
    }));

    it('detects empty forms', function() {
      // scope.init();
      // scope.userId = 12;
      // expect(scope.formInProgress).toBe(false);
    });
  });
});
