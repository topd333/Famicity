describe('Session', function() {
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

  xit('get all notifications', inject(function(NotificationService) {

    //NotificationService.getAllNotifications().then(function (result) {
    //  console.log('result=' + result);
    //});
    //scope.init();
    /*var sessionService = ctrl.sessionService;
     sessionService.serverErrorHandler();
     expect(serverErrorHandler).toBeDefined();*/
  }));
});
