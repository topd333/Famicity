describe('PendingFormsManager service', function() {
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

  var pendingFormsManagerService;

  beforeEach(angular.mock.inject(function(_pendingFormsManagerService_) {
    pendingFormsManagerService = _pendingFormsManagerService_;
  }));

  it('adds form', function() {
    var data1 = {field11: 'value11', field12: 'value12'};
    var addPostForm = pendingFormsManagerService.addForm('add_post', 'post1', data1);
    expect(addPostForm.post1).toEqual(data1);

    var data2 = {field21: 'value21'};
    addPostForm = pendingFormsManagerService.addForm('add_post', 'post2', data2);
    expect(addPostForm.post1).toEqual(data1); // Still there
    expect(addPostForm.post2).toEqual(data2);

  });

  it('removes form', function() {
    var data = {field1: 'value1', field2: 'value2'};
    pendingFormsManagerService.addForm('toRemove', 'post', data);

    var formList = pendingFormsManagerService.removeForm('non existing post');
    expect(formList).toEqual({toRemove: {post: data}});

    formList = pendingFormsManagerService.removeForm('toRemove');
    expect(formList).toEqual({});  // Form list is now empty
  });
});
