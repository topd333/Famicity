describe('NotificationService', function() {
  'use strict';

  var $httpBackend, Notifications, User, configuration;

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

  beforeEach(function() {
    angular.mock.inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');
      User = $injector.get('User');
      Notifications = $injector.get('Notifications');
      configuration = $injector.get('configuration');
    });
  });

  describe('getNotifications', function() {
    /*   it('get all initial notifications', inject(function (AllNotifications) {
     $httpBackend.expectGET(configuration.api_url + '/for_content')
     .respond({
     "user": {
     "pastilles": {
     "messages": 1
     },
     "notifications": [

     ]
     }
     });

     var token = '12';
     var notifications = AllNotifications.getAllNotifications(token);
     $httpBackend.flush();

     expect(notifications.user.pastilles.messages).toEqual(1);
     }));*/
  });
});
