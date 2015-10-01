'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('browserify');
var replace = require('gulp-replace');
var fs = require('fs');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

/**
 * Concatenate all dictionaries
 */
gulp.task('concat', function() {
  return gulp.src('./data/*.txt')
  .pipe(concat('data.txt'))
  .pipe(gulp.dest('./dist/tmp/'));
});

/**
 * Copy all files in libs
 */
gulp.task('copy', function() {
  return gulp.src(['./lib/*.js']) 
  .pipe(gulp.dest('./dist/tmp'));
});

/**
 * Replace the dynamic files path of dictionaries with the static concatenated file
 */
gulp.task('replace', ['copy'], function() {
  return gulp.src('./dist/tmp/dict.js')    
  .pipe(replace(/files = this\.sortuniq\(this\.flatten\(files\.map\(function\(x\)\{return glob\.sync\(x\)\}\)\)\)/, ''))
  .pipe(replace(/files.length/, 1))
  .pipe(replace(/files\[i\]/, '"./dist/tmp/data.txt"'))
  .pipe(gulp.dest('./dist/tmp'));
});

/**
 * Browserify the wordcut.js and export it as "wordcut"
 */
gulp.task('brfs', ['copy', 'concat', 'replace'], function() {
  var file = './dist/tmp/wordcut.js';
  return browserify(file)
  .transform('brfs')
  .require(file, {expose: 'wordcut'})
  .bundle()
  .pipe(fs.createWriteStream('./dist/wordcut.js'));
});

/**
 * Minify
 */
gulp.task('min', ['brfs'], function() {
  return gulp.src('./dist/wordcut.js')
  .pipe(uglify())
  .pipe(rename('wordcut.min.js'))
  .pipe(gulp.dest('./dist')); 
});

/**
 * Remove tmp files
 */
gulp.task('rm', ['brfs'], function() {
  return del(['./dist/tmp']);
});

gulp.task('build', ['copy', 'concat', 'replace', 'brfs', 'min', 'rm']);
