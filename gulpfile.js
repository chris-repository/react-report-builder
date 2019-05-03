'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

gulp.task('sass', done => {
  gulp.src('./src/style/*')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(concat('react-report-builder.min.css'))
    .pipe(gulp.dest('./lib'))
  done();
});

gulp.task('default', gulp.parallel('sass'));
