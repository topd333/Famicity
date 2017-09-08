describe('moment', function() {
  'use strict';

  beforeEach(module('famicity'));

  it('forServer converts to iso format', inject(function($moment) {
    expect($moment(new Date(1988, 2, 29)).forServer()).toBe('1988-03-29');
    expect($moment(new Date(200, 2, 29)).forServer()).toBe('0200-03-29');
    expect($moment(new Date(2015, 1, 29)).forServer()).toBe('2015-03-01');
  }));

  it('fromServer converts iso to moment', inject(function($moment) {
    expect($moment.fromServer('1988-03-29').isSame($moment(new Date(1988, 2, 29)))).toBe(true);
    expect($moment.fromServer('0200-03-29').isSame($moment(new Date(200, 2, 29)))).toBe(true);
  }));

});
