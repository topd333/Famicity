angular.module('famicity')

  .controller('MainController', function(
    $scope, $rootScope, $state, $stateParams, notification, PageTitle, sessionManager, ROUTE, pubsub, PUBSUB, configuration) {
    'use strict';
    $scope.configuration = configuration;
    $scope.PageTitle = PageTitle;
    $scope.menuDisabled = false;
    function enableMenu() {
      $scope.menuDisabled = false;
    }
    pubsub.subscribe(PUBSUB.USER.ACTIVATED, enableMenu, $scope);

    $scope.ROUTE = ROUTE;
    $scope.$on('$viewContentLoaded', function() {
      $rootScope.notifications = notification.list;
    });
    $scope.$on('$stateChangeSuccess', function() {
      const _ref = $state.$current.parent;
      if ((_ref != null ? _ref.self.name : undefined) === 'public') {
        const enParams = angular.extend({}, $stateParams, {
          locale: 'en'
        });
        const frParams = angular.extend({}, $stateParams, {
          locale: 'fr'
        });
        $scope.alternates = {
          en: $state.href($state.current.name, enParams, {
            absolute: true
          }),
          fr: $state.href($state.current.name, frParams, {
            absolute: true
          })
        };
      }
    });
  })
  .controller('Error404Controller', function($scope, $rootScope, $state, $window, notification, sessionManager) {
    'use strict';
    log('404');
    if (sessionManager.getToken() && sessionManager.getUserId()) {
      $rootScope.notifications = notification.list;
      $state.go('u.404', {user_id: sessionManager.getUserId()});
    } else {
      $window.location.href = '/404';
    }
  })
  .controller('Error404PrivateController', function($scope, $rootScope, notification, sessionManager, me) {
    'use strict';
    $scope.userId = me.id;
    $scope.settingsId = me.settings.id;
    $rootScope.notifications = notification.list;
  }).controller('Error500Controller', function($scope, $rootScope, $state, notification, sessionManager) {
    'use strict';
    $scope.init = function() {
      $rootScope.notifications = notification.list;
      if (sessionManager.getToken() && sessionManager.getUserId()) {
        $state.go('u.500', {
          user_id: sessionManager.getUserId()
        });
      }
    };
  })
  .controller('Error500PrivateController', function($scope, $rootScope, notification, sessionManager, me) {
    'use strict';
    $scope.init = function() {
      $scope.userId = me.id;
      $scope.settingsId = me.settings.id;
      $rootScope.notifications = notification.list;
    };
  })
  .controller('EconomicalModelController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('AlbumController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      $('#image-slide6').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  }).controller('DirectoryPresentationController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('CalendarController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('MailModelController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('NewsFeedController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('FamicityPresentationController', function(
    $scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('ProfileController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('PrivacyController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  })
  .controller('FamilyTreeController', function($scope, $rootScope, $location, notification, sessionManager, locale) {
    'use strict';
    var resize;
    resize = function() {
      if (window.innerHeight > 800) {
        $('#slide1').css('min-height', window.innerHeight);
      } else {
        $('#slide1').css('min-height', 800);
      }
    };
    $scope.init = function() {
      $scope.locale = locale;
      sessionManager.setReferral({
        landing: $location.path()
      });
      $('#slide1').parallax('center', 0.1, true);
      $('#image-slide2').parallax('center', 0.1, true);
      $('#image-slide3').parallax('center', 0.1, true);
      $('#image-slide4').parallax('center', 0.05, true);
      $('#image-slide5').parallax('center', 0.03, true);
      $('#image-slide6').parallax('center', 0.03, true);
      resize();
      window.onresize = function() {
        resize();
      };
    };
  }).controller('ForgottenPasswordS2Controller', function() {
    'use strict';
  }).controller('BrowserCompatibilityController', function() {
    'use strict';
  }).controller('TermsController', function($scope, $rootScope, notification, locale) {
    'use strict';
    $scope.locale = locale;
    $rootScope.notifications = notification.list;
  })
  .controller('AboutController', function($scope, $rootScope, notification, locale) {
    'use strict';
    $scope.locale = locale;
    $rootScope.notifications = notification.list;
  })
  .controller('CookiesController', function($scope, $rootScope, notification, locale) {
    'use strict';
    $scope.locale = locale;
    $rootScope.notifications = notification.list;
  });
