describe('Version', function() {
  'use strict';

  var Version;
  var mockedFrontVersion;

  beforeEach(module('famicity'));

  beforeEach(inject(function(_Version_, _sessionManager_) {
    Version = _Version_;
    spyOn(_sessionManager_, 'getVersion').and.callFake(function() {
      return mockedFrontVersion;
    });
    spyOn(_sessionManager_, 'setVersion').and.callFake(function(newVersion) {
      mockedFrontVersion = newVersion;
    });
  }));

  function update(front, back) {
    mockedFrontVersion = front;
    return Version.update(back);
  }

  it('updates from null', function() {
    expect(update(null, '1.14.0')).toBe('1.14.0');
  });

  it('set a new version if outdated', function() {
    expect(update('1.13.0', '1.14.0')).toBe('1.14.0');
    expect(update('1.3', '1.10')).toBe('1.10');
    expect(update('1.3.0', '1.10.0')).toBe('1.10.0');
    expect(update('1.3.10', '1.10.0')).toBe('1.10.0');
    expect(update('1.3.113210', '1.10.0')).toBe('1.10.0');
    expect(update('1.3.113210', '1.10')).toBe('1.10');
    expect(update('1.14', '1.14.0')).toBe('1.14.0');
    expect(update('1.14.0', '2.0.0')).toBe('2.0.0');
  });

  it('update should return null if the front version equals the back version', function() {
    expect(update('1.14.0', '1.14.0')).toBe(null);
  });

  it('update should return null if the front version above the back version', function() {
    expect(update('1.10.0', '1.3.0')).toBe(null);
    expect(update('1.10.0', '1.3.500')).toBe(null);
  });
});

