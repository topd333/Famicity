angular.module('famicity').animation('.notification-animation', function(sessionManager, $animateCss) {
  'use strict';
  const fastForTests = sessionManager.getFastAnimation() || false;
  const duration = fastForTests ? 0.01 : 1;
  return {
    enter(element, doneFn) {
      const runner = $animateCss(element, {
        event: 'enter',
        from: {bottom: '-100%'},
        to: {bottom: '0px'},
        duration
      }).start();
      runner.done(doneFn);
    },
    leave(element, doneFn) {
      const runner = $animateCss(element, {
        from: {bottom: '0px'},
        to: {bottom: '-100%'},
        duration
      }).start();
      runner.done(doneFn);
    }
  };
});
