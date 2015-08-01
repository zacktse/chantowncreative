/*******************************************************************************
## Connect: setup a local server with live reload
*******************************************************************************/
var gulp     = require('gulp'),
    connect = require ('gulp-connect'),                     // local server
    livereload = require('gulp-livereload');


gulp.task('connect', function() {
  return connect.server({
    port: 4321,
    // root: [__dirname],
    root: "./build/",
    livereload: true
  });
});
