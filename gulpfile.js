'use strict';

var browserify = require('browserify'),
	gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
  minifyCss = require('gulp-minify-css'),
  concat = require('gulp-concat'),
	karma = require('karma').server,
	path = require('path');

var configFile = path.resolve(__dirname, 'test/karma.conf.js');

/**
 * Build JS with souremaps for debugging
 */
gulp.task('js-debug', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/viz.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('iobio.viz.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))        
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});


/**
 * Build minified production ready JS lib
 */
gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/viz.js',
    debug: false
  });

  return b.bundle()
    .pipe(source('iobio.viz.min.js'))
    .pipe(buffer())    
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())          
    .pipe(gulp.dest('./'));
});

/**
 * Compile and minify css
 */
 gulp.task('css', function() {
  return gulp.src('src/css/*.css')
    .pipe(minifyCss())    
    .pipe(concat('iobio.viz.min.css'))
    .pipe(gulp.dest('./'))
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: configFile,
    singleRun: true
  }, done);
});

gulp.task('testTravis', function (done) {
  karma.start({
    configFile: configFile,
    singleRun: true,
    browsers: ['Firefox']
  }, done);
});

gulp.task('build', ['default'], function() { gulp.start('test') });
 
gulp.task('default', ['js', 'js-debug', 'css']);

