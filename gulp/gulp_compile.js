/**
 * Compile tasks
 */

'use strict';

var gulp = require('gulp');
var conf = require('./config');

gulp.task('js', function() {
  var es6 = require('gulp-babel');
  var sourceMaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');
  return gulp.src(conf.src.js)
    .pipe(sourceMaps.init())
    .pipe(es6())
    .pipe(ngAnnotate())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(conf.build.dir + '/scripts'));
});

gulp.task('js:build', function() {
  var es6 = require('gulp-babel');
  var stripDebug = require('gulp-strip-debug');
  return gulp.src(conf.src.js)
    .pipe(es6())
    .pipe(stripDebug())
    .pipe(gulp.dest(conf.tmp + '/scripts'));
});

function buildTemplates(dest) {
  var ngHtml2Js = require('gulp-ng-html2js');
  var minifyHtml = require('gulp-minify-html');

  return gulp.src(conf.src.cachedTemplates, {base: 'app'})
    .pipe(minifyHtml({empty: true}))
    .pipe(ngHtml2Js({
      moduleName: 'famicity.views',
      prefix: '/'
    }))
    .pipe(gulp.dest(dest));
}

gulp.task('templates', function() {
  return buildTemplates(conf.build.dir + '/scripts/views');
});

gulp.task('templates:build', function() {
  return buildTemplates(conf.tmp + '/scripts/views');
});

gulp.task('sass', function() {
  var plumber = require('gulp-plumber');
  var sourceMaps = require('gulp-sourcemaps');
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  return gulp.src(conf.src.sassBuilds)
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%']
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(conf.build.dir + '/styles/css'));
});

// Same as 'sass' task, but do not write sourcemap
// Used for 'csshint'
gulp.task('sass:hint', ['clean'], function() {
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  return gulp.src(conf.src.sassBuilds)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%']
    }))
    .pipe(gulp.dest(conf.build.dir + '/styles/css'));
});

gulp.task('sass:build', function() {
  var plumber = require('gulp-plumber');
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  return gulp.src(conf.src.sassBuilds)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', '> 1%']
    }))
    .pipe(gulp.dest(conf.tmp + '/styles/css'));
});

gulp.task('css-check', function() {
  var checkCSS = require('gulp-check-unused-css');

  gulp
    .src([conf.build.dir + '/styles/css/famicity.css', conf.build.dir + '/**/*.html'])
    .pipe(checkCSS({angular: true}));
});
gulp.task('watch', function() {
  var es6 = require('gulp-babel');
  var watch = require('gulp-watch');
  var batch = require('gulp-batch');
  var plumber = require('gulp-plumber');
  var sourceMaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');

  if (!conf.watch) {
    return true;
  }

  watch(['app/**/*.{html,css,jpg,png,js,json}', '!app/scripts/**/*.js'], batch(function(files) {
    return files.pipe(gulp.dest(conf.build.dir));
  }));

  watch(conf.src.js, batch(function(files, cb) {
    files
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(es6())
      .pipe(ngAnnotate())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest(conf.build.dir + '/scripts'));
    gulp.start('test:unit:dev', cb);
  }));

  watch(conf.src.sass, batch(function(files, cb) {
    return gulp.start('sass', cb);
  }));

  watch(conf.src.cachedTemplates, batch(function(files, cb) {
    return gulp.start('templates', cb);
  }));

  watch([conf.src.styleGuide + '/content.md', conf.src.styleGuide + '/parts/**'], batch(function(files, cb) {
    return gulp.start('guide', cb);
  }));
});
