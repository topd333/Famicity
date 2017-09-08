describe('Util service', function() {
  'use strict';

  var $provide;
  var $rootScope;
  var utilService;
  var $timeout, count, config;

  var testFunction = function() {
    count++;
  };

  // load module
  beforeEach(module('famicity', function(configuration) {
    config = configuration;
  }));

  beforeEach(module(function(_$provide_) {
    $provide = _$provide_;
  }));

  beforeEach(inject(function($injector) {
    inject(function(_$rootScope_, _util_) {
      $rootScope = _$rootScope_;
      utilService = _util_;
    });
    var $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('GET', '/languages/fr.json?v=' + config.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + config.version);
  }));

  it('strips tags', function() {
    expect(utilService.stripParagraphTag('<p>test</p>', 'p')).toEqual('test');
  });

  it('remove all line breaks', function() {
    expect(utilService.replaceLineBreaks('<p>test<br />test2</p>', '\n')).toEqual('<p>test\ntest2</p>');
    expect(utilService.replaceLineBreaks('<br>test<br />test2<br>', '\n')).toEqual('\ntest\ntest2\n');
  });

  it('remove all latest strings', function() {
    expect(utilService.removeAllLatest('\n', '\n')).toEqual('');
    expect(utilService.removeAllLatest('Abc\n', '\n')).toEqual('Abc');
  });

  it('converts HTML paragraphs to plain text line feeds', function() {
    expect(utilService.htmlToUTFParagraphs('<p>Text</p>')).toEqual('Text');
    expect(utilService.htmlToUTFParagraphs('<p>Line 1</p><p>Line 2</p>')).toEqual('Line 1\nLine 2');
    expect(utilService.htmlToUTFParagraphs('<p>test<br />test2</p>')).toEqual('test\ntest2');
  });

  it('converts HTML special characters', function() {
    expect(utilService.htmlToUTFChars(
      'Portez ce vieux whisky au juge blond qui fume sur son &icirc;le int&eacute;rieure, ' +
      '&agrave; c&ocirc;t&eacute; de l\'alc&ocirc;ve ovo&iuml;de, ' +
      'o&ugrave; les b&ucirc;ches se consument dans l\'&acirc;tre, ce qui lui permet ' +
      'de penser &agrave; la c&aelig;nog&eacute;n&egrave;se de l\'&ecirc;tre dont il est ' +
      'question dans la cause ambigu&euml; entendue &agrave; Mo&yuml;, dans un capharna&uuml;m ' +
      'qui, pense-t-il, diminue &ccedil;&agrave; et l&agrave; la qualit&eacute; ' +
      'de son &oelig;uvre'))
      .toEqual('Portez ce vieux whisky au juge blond qui fume sur son île intérieure, ' +
      'à côté de l\'alcôve ovoïde, ' +
      'où les bûches se consument dans l\'âtre, ce qui lui permet ' +
      'de penser à la cænogénèse de l\'être dont il est ' +
      'question dans la cause ambiguë entendue à Moÿ, dans un capharnaüm ' +
      'qui, pense-t-il, diminue çà et là la qualité ' +
      'de son œuvre');
    expect(utilService.htmlToUTFChars(
      'PORTEZ CE VIEUX WHISKY AU JUGE BLOND QUI FUME SUR SON &Icirc;LE INT&Eacute;RIEURE, ' +
      '&Agrave; C&Ocirc;T&Eacute; DE L\'ALC&Ocirc;VE OVO&Iuml;DE, ' +
      'O&Ugrave; LES B&Ucirc;CHES SE CONSUMENT DANS L\'&Acirc;TRE, CE QUI LUI PERMET ' +
      'DE PENSER &Agrave; LA C&AElig;NOG&Eacute;N&Egrave;SE DE L\'&Ecirc;TRE DONT IL EST ' +
      'QUESTION DANS LA CAUSE AMBIGU&Euml; ENTENDUE &Agrave; MO&Yuml;, DANS UN CAPHARNA&Uuml;M ' +
      'QUI, PENSE-T-IL, DIMINUE &Ccedil;&Agrave; ET L&Agrave; LA QUALIT&Eacute; ' +
      'DE SON &OElig;UVRE'))
      .toEqual('PORTEZ CE VIEUX WHISKY AU JUGE BLOND QUI FUME SUR SON ÎLE INTÉRIEURE, ' +
      'À CÔTÉ DE L\'ALCÔVE OVOÏDE, ' +
      'OÙ LES BÛCHES SE CONSUMENT DANS L\'ÂTRE, CE QUI LUI PERMET ' +
      'DE PENSER À LA CÆNOGÉNÈSE DE L\'ÊTRE DONT IL EST ' +
      'QUESTION DANS LA CAUSE AMBIGUË ENTENDUE À MOŸ, DANS UN CAPHARNAÜM ' +
      'QUI, PENSE-T-IL, DIMINUE ÇÀ ET LÀ LA QUALITÉ ' +
      'DE SON ŒUVRE');
  });

  it('remove diacritics', function() {
    expect(utilService.removeDiacritics('àáâãäåæçèéêëìíîïñòóôõöœùúûüýÿ')).toBe('aaaaaaaeceeeeiiiinooooooeuuuuyy');
  });

  xit('debounce functions', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    count = 0;
    var debouncedTest = utilService.debounce(testFunction, 200);
    debouncedTest();
    setTimeout(function() {
      expect(count).toBe(0);
    }, 100);
    setTimeout(function() {
      expect(count).toBe(1);
    }, 200);
  });

  xit('throttle functions', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    count = 0;
    var debouncedTest = utilService.throttle(testFunction, 200);
    debouncedTest();
    debouncedTest();
    setTimeout(function() {
      expect(count).toBe(0);
    }, 100);
    setTimeout(function() {
      expect(count).toBe(2);
    }, 200);
  });

  xit('throttle functions with leading option', function() {
    angular.mock.inject(function(_$timeout_) {
      $timeout = _$timeout_;
    });
    count = 0;
    var debouncedTest = utilService.throttle(testFunction, 200, {leading: false});
    setTimeout(function() {
      expect(count).toBe(0);
    }, 100);
    setTimeout(function() {
      expect(count).toBe(2);
    }, 200);
    debouncedTest();
    debouncedTest();
    debouncedTest();
    debouncedTest();
    debouncedTest();
  });
});
