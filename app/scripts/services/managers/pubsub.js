angular.module('famicity').factory('pubsub', function($rootScope, $interval) {
  'use strict';
  const pubsub = {};
  const log = debug('pubsub');
  const logPooled = debug('pubsub:pooled');

  function poolOkMsg(msg) {
    return 'pubsub:' + msg + '-pool-ok';
  }

  pubsub.publish = function(msg, data, options) {
    log('publish %o: %s, pooled: %o', msg, data, options && options.pooled);
    data = data ? {data} : {data: null};
    options = options || {};
    if (options.pooled) {
      data.pooled = true;
      options.pool = options.pool || 300;
      options.period = options.period || 3000;
      const promise = $interval(function() {
        logPooled('publish pooled:  %o: %o', msg, data);
        $rootScope.$broadcast('fc:' + msg, data);
      }, options.pool, options.period / options.pool);
      $rootScope.$on(poolOkMsg(msg), () => $interval.cancel(promise));
    } else {
      $rootScope.$broadcast('fc:' + msg, data);
    }
  };

  pubsub.poolOk = function(msg) {
    pubsub.publish(poolOkMsg(msg));
  };

  pubsub.subscribe = function(msg, func, scope) {
    const newFunc = function() {
      if (arguments[1].pooled) {
        logPooled('end pool: %o', msg);
        $rootScope.$broadcast('pubsub:' + msg + '-pool-ok');
      }
      log('receive message', msg);
      func(arguments[0], arguments[1].data);
    };
    const unbind = $rootScope.$on('fc:' + msg, newFunc);
    if (scope) {
      scope.$on('$destroy', unbind);
    }
    return unbind;
  };

  return pubsub;
});
