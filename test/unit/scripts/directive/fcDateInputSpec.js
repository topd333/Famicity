describe('FcDateInput', function() {
  'use strict';

  function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== '[object Date]') {
      return false;
    }
    return !isNaN(d.getTime());
  }

  var element, scope, config, compile;

  var today = new Date();
  var minDay = new Date(today);
  //var yearMin = today.getFullYear() - ageMax;
  var yearMin = 0;
  minDay.setYear(yearMin);
  var yearMax = today.getFullYear();
  var myValidYear = function(year) {
    if (typeof year !== 'number') {
      year = parseInt(year);
    }
    if (year < today.getFullYear() - 2000) {
      year = 2000 + year;
    }
    if (year < today.getFullYear() - 1900) {
      year = 1900 + year;
    }
    if (year >= yearMin && year <= yearMax) {
      return year;
    }
  };

  var testDate = function(locale, date, expectedResult, isValid, yearCheck) {
    scope.value = null;
    scope.locale = locale;
    scope.readOnly = false;
    scope.isValid = null;
    scope.validYear = myValidYear;

    var elementStr = '<fc-date-input locale="{{locale}}" is-valid="isValid" ng-model="value" not-found-message="NOT FOUND" click-to-confirm-message="fc-date-input.CLICK_TO_CONFIRM"';
    if (yearCheck) {
      elementStr += ' year-check="' + yearCheck + '"';
    }
    elementStr += '></fc-date-input>';
    element = compile(elementStr)(scope);
    scope.$digest();
    element.find('.fc-pattern input').val(date).trigger('change');
    scope.$digest();
    if (isValid) {
      expect(scope.value).toEqual(expectedResult);
    } else {
      expect(isValidDate(scope.value)).toBe(false);
    }
    expect(scope.isValid).toBe(isValid);
  };

  var testPlaceholder = function(locale, date, placeholder) {
    scope.value = null;
    scope.locale = locale;
    scope.readOnly = false;
    scope.isValid = null;
    scope.validYear = myValidYear;

    element =
      '<fc-date-input locale="{{locale}}" is-valid="isValid" ng-model="value" not-found-message="NOT FOUND" click-to-confirm-message="fc-date-input.CLICK_TO_CONFIRM" year-check="validYear(year)">';

    element = compile(element)(scope);
    scope.$digest();
    element.find('.fc-pattern input').val(date).change();
    scope.$digest();
    expect(element.find('.fc-pattern .placeholder').text()).toBe(placeholder);
  };

  beforeEach(module('famicity', function(configuration) {
    config = configuration;
  }));

  beforeEach(inject(function($rootScope, $compile, $injector) {
    scope = $rootScope.$new();

    compile = $compile;
    var $httpBackend = $injector.get('$httpBackend');
    var configuration = $injector.get('configuration');
    $httpBackend.when('GET', config.static3Url + '/languages/fr.json?v=' + configuration.version).respond('');
    $httpBackend.expectGET('/languages/fr.json?v=' + configuration.version);
  }));

  describe('fr dates', function() {
    it('should parse DD/MM/YYYY dates', function() {
      testDate('fr', '10/10/2003', new Date(2003, 9, 10), true);
      testDate('fr', '29/03/1988', new Date(1988, 2, 29), true);
      testDate('fr', '29/02/2000', new Date(2000, 1, 29), true);
    });

    it('should parse D/MM/YYYY dates', function() {
      testDate('fr', '1/10/2003', new Date(2003, 9, 1), true);
      testDate('fr', '5/03/1988', new Date(1988, 2, 5), true);
    });

    it('should parse DD/M/YYYY dates', function() {
      testDate('fr', '10/1/2003', new Date(2003, 0, 10), true);
      testDate('fr', '31/3/1988', new Date(1988, 2, 31), true);
    });

    it('should parse D/M/YYYY dates', function() {
      testDate('fr', '1/1/2003', new Date(2003, 0, 1), true);
      testDate('fr', '1/3/1988', new Date(1988, 2, 1), true);
    });

    it('should not parse invalid dates', function() {
      testDate('fr', 'word', null, false);
      testDate('fr', '32/01/1988', null, false);
      testDate('fr', '31/04/1988', null, false);
      testDate('fr', '29/02/2015', null, false);
    });

    it('should redefine YY years', function() {
      testDate('fr', '10/10/03', new Date(2003, 9, 10), true, 'validYear(year)');
      testDate('fr', '29/03/88', new Date(1988, 2, 29), true, 'validYear(year)');
      testDate('fr', '29/02/00', new Date(2000, 1, 29), true, 'validYear(year)');
    });

    it('should adapt placeholder to user input', function() {
      testPlaceholder('fr', '03', '03/MM/AAAA');
      testPlaceholder('fr', '03/0', '03/0M/AAAA');
      testPlaceholder('fr', '03/01', '03/01/AAAA');
      testPlaceholder('fr', '03/29/1988', '03/29/1988');
      testPlaceholder('fr', '1988-', '1988-MM-DD');
      testPlaceholder('fr', '1988-03-', '1988-03-DD');
    });

  });

  describe('en dates', function() {
    it('should parse MM/DD/YYYY dates', function() {
      testDate('en', '10/10/2003', new Date(2003, 9, 10), true);
      testDate('en', '03/29/1990', new Date(1990, 2, 29), true);
      testDate('en', '02/29/2000', new Date(2000, 1, 29), true);
      var oldDate = new Date(34, 4, 13);
      oldDate.setFullYear(34);
      testDate('en', '05/13/34', oldDate, true);
    });

    it('should parse MM/D/YYYY dates', function() {
      testDate('en', '10/1/2003', new Date(2003, 9, 1), true);
      testDate('en', '03/5/1988', new Date(1988, 2, 5), true);
    });

    it('should parse M/DD/YYYY dates', function() {
      testDate('en', '1/10/2003', new Date(2003, 0, 10), true);
      testDate('en', '3/31/1988', new Date(1988, 2, 31), true);
    });

    it('should parse M/D/YYYY dates', function() {
      testDate('en', '1/1/2003', new Date(2003, 0, 1), true);
      testDate('en', '3/1/1988', new Date(1988, 2, 1), true);
    });

    it('should not parse invalid dates', function() {
      testDate('en', 'word', null, false);
      testDate('en', '01/32/1988', null, false);
      testDate('en', '04/31/1990', null, false);
      testDate('en', '02/29/2015', null, false);
    });

    it('should redefine YY years', function() {
      testDate('en', '10/10/03', new Date(2003, 9, 10), true, 'validYear(year)');
      testDate('en', '03/29/88', new Date(1988, 2, 29), true, 'validYear(year)');
      testDate('en', '02/29/00', new Date(2000, 1, 29), true, 'validYear(year)');
    });

    it('should adapt placeholder to user input', function() {
      testPlaceholder('en', '03', '03/DD/YYYY');
      testPlaceholder('en', '03/2', '03/2D/YYYY');
      testPlaceholder('en', '03/29', '03/29/YYYY');
      testPlaceholder('en', '03/29/1988', '03/29/1988');
      testPlaceholder('en', '1988-', '1988-MM-DD');
      testPlaceholder('en', '1988-03-', '1988-03-DD');
    });

  });

});
