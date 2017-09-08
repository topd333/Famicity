/**
 * Lint tasks
 */

'use strict';

var gulp = require('gulp');
var gUtil = require('gulp-util');
var conf = require('./config');

var analyseLangObject = function(lang1Key, lang1Value, lang2Key, lang2Value, results, parent) {
  if (typeof lang1Value === 'object') {
    if (typeof lang2Value !== 'object' || lang2Value === null) {
      results.push(parent + '.' + lang1Key);
    } else {
      parent = parent ? parent + '.' : '';
      for (var keyObj in lang1Value) {
        if (lang1Value.hasOwnProperty(keyObj)) {
          analyseLangObject(keyObj, lang1Value[keyObj], keyObj, lang2Value[keyObj], results, parent + lang2Key);
        }
      }
    }
  } else if (typeof lang2Value === 'undefined' || lang2Value === null || lang2Value === '') {
    results.push(parent + '.' + lang1Key);
  }
  return results;
};

// TODO: Check that keys are unique
gulp.task('languages', function(cb) {
  var en = require('../app/languages/en.json');
  var fr = require('../app/languages/fr.json');

  // Keys not in both i18n files
  var errors = []
    .concat(analyseLangObject('FR', fr, 'EN', en, [], ''))
    .concat(analyseLangObject('EN', en, 'FR', fr, [], ''));
  errors.forEach(function(key) {
    gUtil.log(gUtil.colors.yellow(key + ' translation does not exist'));
  });

  if (errors.length) {
    process.exit(1);
  }

  cb();
});

gulp.task('eslint', function() {
  var eslint = require('gulp-eslint');
  var friendlyFormatter = require('eslint-friendly-formatter');

  return gulp.src(conf.src.js)
    .pipe(eslint({quiet: true}))
    .pipe(eslint.format(friendlyFormatter));
});

gulp.task('jsinspect', function() {
  var jsinspect = require('gulp-jsinspect');
  return gulp.src([conf.build.dir + '/scripts/**/*.js', '!' + conf.build.dir + '/scripts/views/**/*.js'])
    .pipe(jsinspect({
      threshold: 15,
      identifiers: true,
      suppress: 0
    }));
});

gulp.task('htmlhint', function() {
  var htmlhint = require('gulp-htmlhint');

  return gulp.src(['app/views/**/*.html', 'app/scripts/**/*.html'])
    .pipe(htmlhint({htmlhintrc: '.htmlhintrc'}))
    .pipe(htmlhint.reporter());
});

gulp.task('csshint', ['sass:hint'], function() {
  var recess = require('gulp-recess');

  // return gulp.src(conf.build.dir + '/styles/css/**/private.css')
  return gulp.src('app/styles/**/*.sass')
    .pipe(recess())
    .pipe(recess.reporter());
});
