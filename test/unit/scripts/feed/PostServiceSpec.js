describe('Post service', function() {
  'use strict';

  var $rootScope;
  var postService;
  var configuration;

  // load module
  beforeEach(module('famicity', function(_configuration_) {
    configuration = _configuration_;
  }));

  // load module
  beforeEach(module('famicity', function($provide) {
    // Fake locale setting to avoid locale script loading failure
    $provide.provider('tmhDynamicLocale', function() {
      this.$get = function() {
        return {
          set: function() {
            // console.log('Locale set to ' + locale);
          }
        };
      };
    });
  }));

  beforeEach(function() {
    inject(function(_$rootScope_, _postService_) {
      $rootScope = _$rootScope_;
      postService = _postService_;
    });
  });

  it('converts incoming single-line messages', function() {
    expect(postService.textToHTML('<p>Ceci est un message</p>'))
      .toEqual('Ceci est un message\n');
  });

  it('converts incoming multi-line messages', function() {
    expect(postService.textToHTML('<p>Ceci est un message\nmulti-lignes</p>'))
      .toEqual('Ceci est un message<br>multi-lignes\n');
  });

  it('converts incoming multi-line messages', function() {
    expect(postService.textToHTML('<p>Ceci est un message\nmulti-lignes</p>'))
      .toEqual('Ceci est un message<br>multi-lignes\n');
  });

  it('converts outgoing single-line messages', function() {
    expect(postService.htmlToText('<p>Ceci est un message</p>'))
      .toEqual('Ceci est un message');
  });

  it('converts outgoing ampersands', function() {
    expect(postService.htmlToText('<p>Ceci est un message &amp; autre</p>'))
      .toEqual('Ceci est un message & autre');
  });

  it('converts outgoing non-breaking spaces', function() {
    expect(postService.htmlToText('<p>&nbsp;Ceci est un message&nbsp;suivi d\'espaces&nbsp;&nbsp;</p>'))
      .toEqual(' Ceci est un message suivi d\'espaces  ');
  });

  it('converts outgoing multi-lines messages', function() {
    // Firefox
    expect(postService.htmlToText('avec espace<br>ligne suivante<br>dernier<br>'))
      .toEqual('avec espace\nligne suivante\ndernier');
    // Chrome
    expect(postService.htmlToText('avec espace<div>ligne suivante</div><div>dernier</div>'))
      .toEqual('avec espaceligne suivante\ndernier');
    // IE
    expect(postService.htmlToText('<pre><code>avec espace<p>ligne suivante</p><p>dernier</p></code></pre>'))
      .toEqual('avec espaceligne suivante\ndernier');
  });

  it('converts outgoing hyperlinks', function() {
    expect(postService.htmlToText('<p>Va voir sur <a href="http://www.sun.com" target="_blank" rel="nofollow" class="generatedLink">hyperlien</a> !</p>'))
      .toEqual('Va voir sur http://www.sun.com !');
  });

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', configuration.static3Url + '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + configuration.version);
  }));

  it('warns about required fields', inject(function($q, notification) {
    var scope = $rootScope.$new();
    var emptyPost = {
      textValue: ''
    };
    var required = {
      textValue: 'fc-post.REQUIRED.TEXT'
    };
    var result;
    spyOn(notification, 'add').and.returnValue('NOTIF');
    postService.warnAbout(emptyPost, required).then(function(res) {
      result = res;
    });

    // Triggers promises resolutions
    scope.$apply();

    expect(notification.add).toHaveBeenCalledWith('fc-post.REQUIRED.TEXT');
    expect(result).toBe(undefined);
  }));

  it('warns about aliased required fields', inject(function($q, notification) {
    var scope = $rootScope.$new();
    var emptyPost = {
      textValue: ''
    };
    var required = {
      text: 'fc-post.REQUIRED.TEXT'
    };
    var result;
    spyOn(notification, 'add').and.returnValue('NOTIF');
    postService.warnAbout(emptyPost, required).then(function(res) {
      result = res;
    });

    // Triggers promises resolutions
    scope.$apply();

    expect(notification.add).toHaveBeenCalledWith('fc-post.REQUIRED.TEXT');
    expect(result).toBe(undefined);
  }));

  it('warns about empty permissions', inject(function($q, notification, yesnopopin) {
    var scope = $rootScope.$new();
    var emptyPermissionsPost = {
      text: 'Non empty text',
      permissions: {
        allowed: []
      }
    };
    var result;
    var popinDeferred = $q.defer();
    popinDeferred.resolve('EMPTY_WARNING');
    spyOn(yesnopopin, 'open').and.returnValue(popinDeferred.promise);
    postService.warnAbout(emptyPermissionsPost).then(function(res) {
      result = res;
    });

    // Triggers promises resolutions
    scope.$apply();

    expect(yesnopopin.open).toHaveBeenCalledWith('EMPTY_PERMISSIONS_ALERT', {
      yes: 'ADD_PERMISSIONS',
      no: 'DO_NOT_ADD_PERMISSIONS'
    });
    // TODO: Test scenario where user answers add permissions or do not add ones.
    expect(result).toBe(undefined);
  }));
});
