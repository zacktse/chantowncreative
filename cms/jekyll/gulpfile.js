var gulp = require('gulp');
var shell = require('gulp-shell');
var browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var bourbon = require("node-bourbon").includePaths;
var neat = require("node-neat").includePaths;




var assets = {
  'js': [
    "bower_components/jquery/dist/jquery.js",
    "bower_components/highlightjs/highlight.pack.js",
    "bower_components/jquery-timeago/jquery.timeago.js",
    "_js/*.js"
  ],
  'sass': ["assets/sass/main.scss"]
};

/* Generates the CSS file from the sass files in assets/sass folder */
gulp.task('css', function() {
  gulp.src(assets.sass)
    .pipe(sass({
      includePaths: bourbon,
      includePaths: neat
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(minify({
      keepBreaks: true
    }))
    .pipe(gulp.dest('assets/css'));
});


/* Task for building jekyll when something changed: */
gulp.task('build', shell.task(['bundle exec jekyll build --watch']));
/* Or if you don't use bundle:
   gulp.task('build', shell.task(['jekyll build --watch'])); */

/* Task for serving blog with Browsersync */
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: '_site/'
    }
  });
  /* Reloads page when some of the already built files changed: */
  gulp.watch('_site/**/*.*').on('change', browserSync.reload);
  gulp.watch(assets.sass).on('change', 'css');
});

gulp.task('default', ['build', 'css', 'serve']);
