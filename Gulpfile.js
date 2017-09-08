/* jshint node: true */
'use strict';

// Require build dependencies
var gulp  = require('gulp'),
    gUtil = require('gulp-util'),
    conf  = require('./gulp/config');

gulp.task('info', function() {
  gUtil.log('--------------------------------');
  gUtil.log('|  Environment: ', gUtil.colors.yellow(conf.build.target));
  gUtil.log('|  Build dir:   ', gUtil.colors.yellow(conf.build.dir));
  gUtil.log('|  Version:     ', gUtil.colors.yellow(conf.build.version));
  gUtil.log('--------------------------------');
});

/**
 * Clean and dependencies tasks
 */

gulp.task('clean', function(cb) {
  var del = require('del');

  del([
    conf.tmp,
    conf.build.dir,
    conf.src.bowerComponents
  ], cb);
});

gulp.task('bower', function(done) {
  var bower = require('bower');
  if (!conf.bower) {
    gUtil.log(['bower is running an', gUtil.colors.yellow('offline'), 'install'].join(' '));
  }
  bower.commands.install([], {}, {offline: !conf.bower})
    //.on('log', function(result) {
    //gUtil.log(['bower', gUtil.colors.cyan(result.id), result.message].join(' '));
    //})
  .on('error', function(error) {
    gUtil.log(['bower', gUtil.colors.red(error)].join(' '));
    process.exit(1);
  })
  .on('end', function() {
    done();
  });
});

require('./gulp/gulp_replace');
require('./gulp/gulp_compile');
require('./gulp/gulp_minify');
require('./gulp/gulp_dev');
require('./gulp/gulp_copy');
require('./gulp/gulp_linters');
require('./gulp/gulp_tests');

/**
 * CLI tasks
 */

var rseq = require('run-sequence');

// Development task
gulp.task('default', function(cb) {
  rseq(
  'info', 'clean', 'bower',
  ['replace', 'copy:bower', 'sass', 'templates', 'guide'],
  'js',
  'inject',
  'copy',
  'replace:tests',
  'test:unit:dev:once',
  'watch',
  cb);
});

// Build task, use --target
gulp.task('build', function(cb) {
  rseq(
  'info', 'clean', 'bower',
  ['replace:build', 'sass:build', 'templates:build', 'jsonmin', 'guide'],
  'js:build',
  'inject:build',
  ['imagemin', 'copy:build', 'copy:assets'],
  'replace:tests:build',
  'copy:tmp',
  'usemin',
  'languages',
  cb);
});

gulp.task('test', function(cb) {
  conf.imgMin = false;
  rseq(
  'build',
  'test:unit',
  cb);
});
