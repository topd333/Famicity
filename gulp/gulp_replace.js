/**
 * Replace tasks
 */

'use strict';

var gulp = require('gulp');
var conf = require('./config');

/**
 * Create the app configuration depending on build target
 */

function configFile(dev) {
  var replace = require('gulp-replace-task');
  return gulp.src('config/config.js')
    .pipe(replace({
      patterns: [
        {json: require('../config/environments/' + conf.build.target + '.json')},
        {match: 'version', replacement: conf.build.version},
        {match: 'development', replacement: dev}
      ]
    }))
    .pipe(gulp.dest(conf.build.dir + '/scripts/config'))
    // Tests will load config from here
    .pipe(gulp.dest(conf.tmp + '/scripts/config'));
}

gulp.task('replace', function() {
  configFile(true);
});

gulp.task('replace:build', function() {
  configFile(false);
});

function replaceForTests(dir) {
  var fs = require('fs');
  var replace = require('gulp-replace-task');
  return gulp.src('test/confs/*.js')
    .pipe(replace({
      patterns: [
        {
          match: /\/\/ @@inject/,
          replacement: function() {
            var index = fs.readFileSync(conf.build.dir + '/index.html').toString();
            var total = '';
            var match;
            var reg = /<script src="(\/(?:scripts|bower_components|angular|libs).*)"><\/script>/g;
            match = reg.exec(index);
            while (match !== null) {
              total += '\n      \'' + dir + match[1] + '\',';
              match = reg.exec(index);
            }
            return total;
          }
        }
      ]
    }))
    .pipe(gulp.dest('test'));
}

gulp.task('replace:tests', function() {
  return replaceForTests(conf.build.dir);
});

gulp.task('replace:tests:build', function() {
  return replaceForTests(conf.tmp);
});
