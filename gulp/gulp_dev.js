/**
 * Compile tasks
 */

'use strict';

var gulp = require('gulp');
var marked = require('gulp-markdown');
var replace = require('gulp-replace-task');
var fs = require('fs');
var path = require('path');
var conf = require('./config');
var marked2 = require('marked');
var renderer = new marked2.Renderer();
var rename = require('gulp-rename');
var cheerio = require('cheerio');
var rseq = require('run-sequence');

var guideFiles = conf.src.styleGuide;

function escape(text) {
  var string;
  if (text) {
    string = text.toLowerCase().replace(/[^\w]+/g, '-');
  } else {
    string = '';
  }
  return string;
}

renderer.heading = function(text, level) {
  var escapedText = escape(text);

  return '<h' + level + ' title="' + text + '" class="styleguide-heading"><a id="' + escapedText + '" ui-sref="{\'#\':\'' + escapedText +
    '\'}" ui-sref-opts="{reload:true}" href="' + escapedText + '"><span class="header-link">' +
    text + '</span></a>' + '</h' + level + '>';
};

gulp.task('markdown', function() {
  return gulp.src(guideFiles + '/content.md')
    // include .md files in the main .md file
    .pipe(replace({
      patterns: [
        {
          match: /(?:@include ([^\.]*.md);)/g,
          replacement: function(pattern, file) {
            return fs.readFileSync(guideFiles + path.sep + file, 'utf-8').toString();
          }
        }
      ]
    }))
    // replace html and javascript pieces of code to add the result of this code
    .pipe(replace({
      patterns: [
        {
          match: /(%% result %%(?:\n|\r\n)```(?:\n|\r\n)([^`]+)```\n```(?:\n|\r\n)([^`]+)```)/g,
          replacement: '\n\n<div class="guide-result">\n\n$3</div>' + '\n\n' + '```js\n$2\n```' + '\n\n' + '```html\n$3\n```'
        }
      ]
    }))
    // replace html pieces of code to add the result of this code
    .pipe(replace({
      patterns: [
        {
          match: /(%% result %%(?:\n|\r\n)```(?:\n|\r\n)([^`]+)```)/g,
          replacement: '\n\n<div class="guide-result">\n\n$2</div>' + '\n\n' + '```html\n$2\n```'
        }
      ]
    }))
    // markdownify
    .pipe(marked({
      highlight: function(code, lang) {
        return require('highlight.js').highlightAuto(code, [lang]).value;
      },
      renderer: renderer,
      gfm: true,
      breaks: false
    }))
    // include the result of the markdowned content in the main html file
    .pipe(replace({
      patterns: [
        {
          match: /(?:@include ([^\.]*.html);)/g,
          replacement: function(pattern, file) {
            return fs.readFileSync(guideFiles + path.sep + file, 'utf-8').toString();
          }
        }
      ]
    }))
    .pipe(gulp.dest(guideFiles));
});

gulp.task('generate', function() {
  return gulp.src(guideFiles + '/style-guide_template.html')
    .pipe(replace({
      patterns: [
        {
          match: /(?:@include ([^\.]*.html);)/g,
          replacement: function(pattern, file) {
            return fs.readFileSync(guideFiles + path.sep + file, 'utf-8').toString();
          }
        }
      ]
    }))
    .pipe(rename({basename: 'style-guide'}))
    .pipe(gulp.dest(guideFiles));
});

function generateLink(title) {
  var escaped = escape(title);
  return '<a ui-sref="{\'#\': \'' + escaped + '\'}" ui-sref-opts="{reload: true}">' + title + '</a>';
}

gulp.task('menu', function() {
  return gulp.src(guideFiles + '/style-guide.html')
    .pipe(replace({
      patterns: [
        {
          match: /(?:@menu;)/,
          replacement: function() {
            var guide = fs.readFileSync(guideFiles + path.sep + 'style-guide.html', 'utf-8').toString();
            var menu = '';
            var $ = cheerio.load(guide);
            $('h1.styleguide-heading, h2.styleguide-heading').each(function(i, el) {
              if (el.name.toUpperCase() === 'H1') {
                if (i === 0) {
                  menu += '<li>' + generateLink($(el).attr('title')) + '<ul class="nav">';
                } else {
                  menu += '</ul></li><li>' + generateLink($(el).attr('title')) + '<ul class="nav">';
                }
              } else if (i === $('h1.styleguide-heading, h2.styleguide-heading').length - 1) {
                menu += '<li>' + generateLink($(el).attr('title')) + '</li></ul>';
              } else {
                menu += '<li>' + generateLink($(el).attr('title')) + '</li>';
              }
            });
            return menu;
          }
        }
      ]
    }))
    .pipe(gulp.dest(guideFiles));
});

gulp.task('guide:css', function() {
  return gulp.src('app/scripts/dev/style/guide/style.css', {base: 'app'})
    .pipe(gulp.dest(conf.build.dir));
});

gulp.task('guide', function(cb) {
  rseq(
    'markdown', 'generate', 'menu', 'guide:css',
    cb);
});
