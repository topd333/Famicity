/**
 * Minification tasks
 */

'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var angularFileSort = require('gulp-angular-filesort');
var replace = require('gulp-replace-task');
var conf = require('./config');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var sourceMaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

var devLibs = '<script src="/bower_components/jquery/dist/jquery.js"></script>\n' +
  '\t<script src="/bower_components/angular/angular.js"></script>\n' +
  '\t<script src="/bower_components/angular-resource/angular-resource.js"></script>\n' +
  '\t<script src="/bower_components/angular-cookies/angular-cookies.js"></script>\n' +
  '\t<script src="/bower_components/angular-animate/angular-animate.js"></script>\n' +
  '\t<script src="/bower_components/angular-sanitize/angular-sanitize.js"></script>';

if (conf.weinre) {
  devLibs += '\n\t<script src="/libs/weinre.js"></script>';
}

gulp.task('inject', function() {
  var sources = gulp.src([
    conf.build.dir + '/scripts/**/*.js', '!' + conf.build.dir + '/scripts/config/config.js'
  ], {read: true});
  return gulp.src('app/index.html')
    .pipe(inject(sources.pipe(angularFileSort()), {ignorePath: conf.build.dir}))
    .pipe(replace({
      patterns: [
        {
          match: 'thirdPartyLibs',
          replacement: devLibs
        }
      ]
    }))
    .pipe(gulp.dest(conf.build.dir));
});

gulp.task('inject:build', function() {
  var sources = gulp.src([
    conf.tmp + '/scripts/**/*.js',
    '!' + conf.tmp + '/scripts/config/config.js'
  ], {read: true});
  return gulp.src('app/index.html')
    .pipe(inject(sources.pipe(angularFileSort()), {ignorePath: conf.tmp}))
    .pipe(replace({
      patterns: [
        {
          match: 'thirdPartyLibs',
          replacement: '<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>\n' +
          '\t<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular.min.js"></script>\n' +
          '\t<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-resource.min.js"></script>\n' +
          '\t<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-cookies.min.js"></script>\n' +
          '\t<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-animate.min.js"></script>\n' +
          '\t<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.4/angular-sanitize.min.js"></script>'
        }
      ]
    }))
    .pipe(gulp.dest(conf.build.dir));
});

gulp.task('imagemin', function() {
  var stream;
  if (!conf.imgMin) {
    stream = gulp.src(['app/images/**/*', 'app/scripts/**/*.png', 'app/scripts/**/*.jpg', 'app/scripts/**/*.gif', 'app/scripts/**/*.jpeg'], {base: 'app'})
      .pipe(gulp.dest(conf.build.dir));
  } else {
    var imagemin = require('gulp-imagemin');
    stream = gulp.src(['app/images/**/*', 'app/scripts/**/*.png', 'app/scripts/**/*.jpg', 'app/scripts/**/*.gif', 'app/scripts/**/*.jpeg'], {base: 'app'})
      .pipe(imagemin({progressive: true, optimizationLevel: 3}))
      .pipe(gulp.dest(conf.build.dir));
  }
  return stream;
});

gulp.task('jsonmin', function() {
  var jsonmin = require('gulp-jsonminify');
  return gulp.src(['app/languages/*.json'], {base: 'app'})
    .pipe(jsonmin())
    .pipe(gulp.dest(conf.build.dir));
});

gulp.task('usemin', function() {
  var usemin = require('gulp-usemin');
  var uglify = require('gulp-uglify');
  var rev = require('gulp-rev');

  return gulp.src([
    conf.build.dir + '/index.html', '!app/index.html', 'app/**/*.html', '!' + conf.src.bowerComponents + '/**/*.html',
    '!app/libs/**/*.html'
  ])
    .pipe(usemin({
      html: ['concat', minifyHtml({empty: true})],
      css: ['concat', minifyCss(), rev()],
      js: [
        'concat', sourceMaps.init({debug: true}), ngAnnotate(), uglify(), rev(),
        sourceMaps.write('scripts/sourceMaps', {
          sourceMappingURLPrefix: conf.build.url,
          debug: true
        })
      ]
    }))
    // Replace relative paths by cdn subdomain absolute paths
    .pipe(replace({
      patterns: [
        {
          match: /src=\/scripts\/(famicity\.min-(?:[^"]*)\.js)/,
          replacement: 'src=//devstatic1.famicity.com/scripts/$1'
        }, {
          match: /\/scripts\/config\/config\.js/,
          replacement: '//devstatic1.famicity.com/scripts/config/config.js?v=' + conf.build.version
        }, {
          match: /\/styles\/css\/(famicity\.min-(?:[^"]*)\.css)/,
          replacement: '//devstatic2.famicity.com/styles/css/$1'
        }
      ]
    }))
    .pipe(gulp.dest(conf.build.dir));
});
