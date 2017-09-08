describe('ResourceTransformer service', function() {
  'use strict';

  var $provide;
  var $rootScope;
  var resourceTransformer, data;

  data = {
    obj: {
      prop1: true,
      prop2: 'test'
    }
  };

  // load module
  beforeEach(module('famicity'));

  beforeEach(module(function(_$provide_) {
    $provide = _$provide_;
  }));

  beforeEach(function() {
    inject(function(_$rootScope_, _resourceTransformer_) {
      $rootScope = _$rootScope_;
      resourceTransformer = _resourceTransformer_;
    });
    Bugsnag = {
      notifyException: function(err, desc, data, level) {
      },
      notify: function(err, desc, data, level) {
      }
    };

    spyOn(Bugsnag, 'notify');
    spyOn(Bugsnag, 'notifyException');
  });

  it('should transform property if proper name is given', function() {
    expect(resourceTransformer.transform(JSON.stringify(data), 'obj', 200)).toEqual(data.obj);
  });

  it('should return null if no proper name is given', function() {
    expect(resourceTransformer.transform(JSON.stringify(data), 'obj2', 200)).toEqual(null);
  });

  it('transformRequest should return a JSON object', function() {
    expect(resourceTransformer.transformRequest(data, 'obj')).toBe(JSON.stringify(data.obj));
  });

  it('transformRequest should set object_type', function() {
    expect(JSON.parse(resourceTransformer.transformRequest(data, 'obj')).object_type).toBe('obj');
  });

  it('transformResponse should set object type if given an object', function() {
    expect(resourceTransformer.transformResponse(JSON.stringify(data), 'obj', 200).type).toEqual('obj');
  });

  it('should notifyError Bugsnag on error', function() {
    resourceTransformer.transform([], 'obj', 200);
    expect(Bugsnag.notify).not.toHaveBeenCalled();
    expect(Bugsnag.notifyException).toHaveBeenCalled();
  });

  it('should not notify Bugsnag on error if  status is 400, 401, 404 or 500', function() {
    resourceTransformer.transform([], 'obj', 400);
    resourceTransformer.transform([], 'obj', 401);
    resourceTransformer.transform([], 'obj', 404);
    resourceTransformer.transform([], 'obj', 500);
    expect(Bugsnag.notify).not.toHaveBeenCalled();
    expect(Bugsnag.notifyException).not.toHaveBeenCalled();
  });

  it('should notify Bugsnag on error if no given status', function() {
    resourceTransformer.transform([], 'obj');
    expect(Bugsnag.notify).toHaveBeenCalled();
    expect(Bugsnag.notifyException).not.toHaveBeenCalled();
  });

});
