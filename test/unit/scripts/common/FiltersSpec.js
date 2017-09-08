describe('Filter', function() {
  'use strict';

  beforeEach(module('famicity'));

  describe('capitalize', function() {
    it('should capitalize', inject(function(capitalizeFilter) {
      expect(capitalizeFilter('test')).toBe('Test');
      expect(capitalizeFilter(' test')).toBe(' test');
      expect(capitalizeFilter('à')).toBe('À');
      expect(capitalizeFilter('TEST')).toBe('TEST');
      expect(capitalizeFilter('')).toBe(undefined);
      expect(capitalizeFilter(null)).toBe(undefined);
    }));
  });

  describe('multiplicationOp', function() {
    it('should multiply', inject(function(multiplicationOpFilter) {
      expect(multiplicationOpFilter(2, 2, 2)).toEqual('4.00');
      expect(multiplicationOpFilter(2, 1, 0)).toEqual('2');
      expect(multiplicationOpFilter(2, 2)).toEqual('4');
      expect(multiplicationOpFilter(0, 2, 4)).toEqual(undefined);
      expect(multiplicationOpFilter(2, 0, 2)).toEqual('0.00');
    }));
  });

  describe('startFrom', function() {
    it('should return array starting from x', inject(function(startFromFilter) {
      expect(startFromFilter([1, 2, 3], 2)).toEqual([3]);
      expect(startFromFilter([1, 2, 3])).toEqual([1, 2, 3]);
      expect(startFromFilter([1, 2, 3], -2)).toEqual([2, 3]);
      expect(startFromFilter([], 2)).toEqual([]);
      expect(startFromFilter(null, 2)).toEqual(undefined);
    }));
  });

  describe('todayOrDate', function() {
    it('should return TODAY if given day is today', inject(function(todayOrDateFilterFilter) {
      expect(todayOrDateFilterFilter(Date.now())).toEqual('TODAY');
    }));

    it('should return the given date if it is not today', inject(function(todayOrDateFilterFilter) {
      expect(todayOrDateFilterFilter(new Date(2003, 9, 10).getTime())).toEqual('10/10/2003');
      expect(todayOrDateFilterFilter(new Date(1988, 2, 29).getTime())).toEqual('29/03/1988');
    }));
  });

  describe('timeOrDateFilter', function() {
    it('should return a time if given day is today', inject(function(timeOrDateFilterFilter, $moment) {
      expect(timeOrDateFilterFilter(Date.now())).toEqual($moment(Date.now()).format('HH:mm'));
    }));

    it('should return null or undefined if no date is given', inject(function(timeOrDateFilterFilter) {
      expect(timeOrDateFilterFilter(null)).toEqual(null);
      expect(timeOrDateFilterFilter()).toEqual(undefined);
    }));

    it('should return a date date if given date is not today', inject(function(timeOrDateFilterFilter) {
      expect(timeOrDateFilterFilter(new Date(2003, 9, 10).getTime())).toEqual('10/10/2003');
      expect(timeOrDateFilterFilter(new Date(1988, 2, 29).getTime())).toEqual('29/03/1988');
    }));

    it('should add a prefix if asked ', inject(function(timeOrDateFilterFilter) {
      expect(timeOrDateFilterFilter(Date.now(), true)).toEqual('AT_SMALL_DATE');
      expect(timeOrDateFilterFilter(new Date(2003, 9, 10).getTime(), true)).toEqual('THE_SMALL_DATE');
    }));

  });

  describe('timeOrDatePrefixFilter', function() {
    it('should return a time if given day is today', inject(function(timeOrDatePrefixFilterFilter) {
      expect(timeOrDatePrefixFilterFilter(Date.now())).toEqual('AT');
    }));

    it('should return null or undefined if no date is given', inject(function(timeOrDatePrefixFilterFilter) {
      expect(timeOrDatePrefixFilterFilter(null)).toEqual('THE');
      expect(timeOrDatePrefixFilterFilter()).toEqual('THE');
    }));

    it('should return a date date if given date is not today', inject(function(timeOrDatePrefixFilterFilter) {
      expect(timeOrDatePrefixFilterFilter(new Date(2003, 9, 10).getTime())).toEqual('THE');
      expect(timeOrDatePrefixFilterFilter(new Date(1988, 2, 29).getTime())).toEqual('THE');
    }));

  });

  describe('trustedHtml', function() {
    it('should return $sce text', inject(function(trustedHtmlFilter) {
      expect(trustedHtmlFilter('<a href="https://famicity.com">Famicity</a>').$$unwrapTrustedValue()).toEqual('<a href="https://famicity.com">Famicity</a>');
      expect(trustedHtmlFilter('<script>alert("Test");</script>').$$unwrapTrustedValue()).toEqual('<script>alert("Test");</script>');
    }));
  });

});
