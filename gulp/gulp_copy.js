/**
 * Copy tasks
 */

'use strict';

var gulp = require('gulp');
var conf = require('./config');

gulp.task('copy:tmp', function() {
  gulp.src([
    'app/libs/**/*',
    'app/angular/**/*',
    'app/styles/css/*.css'
  ], {base: 'app'})
    .pipe(gulp.dest(conf.tmp));
  return gulp.src([
    conf.src.bowerComponents + '/**/*'
  ])
    .pipe(gulp.dest(conf.tmp + '/bower_components'));
});

gulp.task('copy:assets', function() {
  return gulp.src([
    conf.src.bowerComponents + '/font-awesome/fonts/**',
    conf.src.bowerComponents + '/famicity-font/fonts/**'
  ])
    .pipe(gulp.dest(conf.build.dir + '/styles/fonts'));
});

gulp.task('copy', ['copy:build'], function() {
  return gulp.src([
    'app/**/*.css',
    'app/**/*.png',
    'app/**/*.jpg',
    'app/**/*.html', 'app/images/**',
    'app/libs/**',
    'app/languages/**', '!app/index.html'
  ], {base: 'app'})
    .pipe(gulp.dest(conf.build.dir));
});

gulp.task('copy:build', function() {
  return gulp.src([
    'app/robots.txt', 'app/favicon.ico', 'app/*.png',
    'app/static/**', 'app/sitemap.xml', 'app/languages/angular-i18n/**'
  ], {base: 'app'})
    .pipe(gulp.dest(conf.build.dir));
});

gulp.task('copy:bower', function() {
  return gulp.src([
    conf.src.bowerComponents + '/**/*'
  ])
    .pipe(gulp.dest(conf.build.dir + '/bower_components'));
});
