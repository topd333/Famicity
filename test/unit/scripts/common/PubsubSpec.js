describe('Pubsub', function() {
  'use strict';
  var $$rootScope, $pubsub, $PUBSUB, unbind, message, config;

  beforeEach(module('famicity', function(configuration) {
    config = configuration;
  }));

  beforeEach(inject(function(pubsub, PUBSUB, $rootScope, $httpBackend) {
    $httpBackend.when('GET', config.static3Url + '/languages/fr.json?v=' + config.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + config.version);
    $pubsub = pubsub;
    $PUBSUB = PUBSUB;
    $$rootScope = $rootScope;
    message = {
      test: true
    };
  }));

  afterEach(function() {
    unbind();
  });

  it('should prefix subscribe with \'fc:\'', function(done) {
    unbind = $pubsub.subscribe('test', function(event, msg) {
      expect(msg).toEqual(message);
      done();
    });
    $$rootScope.$broadcast('fc:test', {data: message});
  });

  it('should prefix publish with \'fc:\'', function(done) {
    unbind = $$rootScope.$on('fc:test', function(event, msg) {
      expect(msg).toEqual({data: message});
      done();
    });
    $pubsub.publish('test', message);
  });

  it('should send messages', function(done) {
    unbind = $pubsub.subscribe('test', function(event, msg) {
      expect(msg).toEqual(message);
      done();
    });
    $pubsub.publish('test', message);
  });

  it('subscribe should be called before publish', function(done) {
    var ok = false;
    $pubsub.publish('test', message);
    unbind = $pubsub.subscribe('test', function() {
      ok = true;
    });
    setTimeout(function() {
      expect(ok).toBe(false);
      done();
    }, 200);
  });

  it('should pool messages if option is set', function(done) {
    var msgCopy,
        poolOver  = false,
        $interval = null,
        count     = 0;

    $pubsub.publish('test', message, {pooled: true});
    unbind = $pubsub.subscribe('test', function(event, msg) {
      msgCopy = msg;
      count++;
    });
    $$rootScope.$on('pubsub:test-pool-ok', function() {
      poolOver = true;
    });

    angular.mock.inject(function(pubsub, _$interval_) {
      // Mock $interval
      $interval = _$interval_;
    });

    $interval.flush(500);

    setTimeout(function() {
      expect(count).toBe(1);
      expect(poolOver).toBe(true);
      expect(msgCopy).toEqual(message);
      done();
    }, 50);
  });

});
