/**
 * Tests tasks
 */

'use strict';

var gulp = require('gulp');
var gUtil = require('gulp-util');
var conf = require('./config');

function runKarma(configFilePath, cb, dev) {
  var Server = require('karma').Server;
  var path = require('path');
  var configPath = path.resolve(configFilePath);

  var server = new Server({configFile: configPath}, function(exitCode) {
    gUtil.log('Karma has exited with ' + gUtil.colors[exitCode ? 'red' : 'green'](exitCode));
    if (exitCode !== 0 && !dev) {
      process.exit(exitCode);
    }
    return cb();
  });
  server.start();
}
gulp.task('test:unit', function(cb) {
  runKarma('test/karma-build.conf.js', cb);
});
gulp.task('test:unit:dev', function(cb) {
  runKarma('test/karma-dev-ci.conf.js', cb, true);
});
gulp.task('test:unit:dev:once', function(cb) {
  runKarma('test/karma-dev-once.conf.js', cb, true);
});

gulp.task('test:e2e', function() {
  var protractor = require('gulp-protractor').protractor;

  gulp.src(['tests/e2e/**/*.js'])
  .pipe(protractor({
    configFile: 'test/e2e/protractor.config.js',
    args: ['--baseUrl', conf.build.url]
  }))
  .on('error', function(e) {
    throw e;
  });
});

gulp.task('test:e2e:routes', function() {
  var protractor = require('gulp-protractor').protractor;

  gulp.src(['tests/e2e/**/*.js'])
  .pipe(protractor({
    configFile: 'test/e2e/protractor_routes.config.js',
    args: ['--baseUrl', conf.build.url]
  }))
  .on('error', function(e) {
    throw e;
  });
});

gulp.task('fabien', ['test:e2e'], function() {
});

gulp.task('protractor-qa', function() {
  var protractorQA = require('gulp-protractor-qa');
  return protractorQA.init({
    testSrc: '../test/e2e/*e2e.js',
    viewSrc: ['../app/**/*.html']
  });
});
