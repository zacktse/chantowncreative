/*==============================================================================
##  Chantown Creative website - July 2015
##
##  Based on, and borrowed heavily from, a combination of the UAL gulpfile (private repo)
##  and https://github.com/thesherps/gulp.bourbon.boilerplate
##
##
==============================================================================*/

/*******************************************************************************
## Require Stuff
*******************************************************************************/

var gulp = require ('gulp'),                                //require gulp
    gutils = require('gulp-util'),                          // gulp utilities (date)
    templator = require('gulp-file-include'),               // used to build preototype files from multiple includes
    header  = require('gulp-header'),                       // adds header to top of files (last updated message)
    uglify = require ('gulp-uglify'),                       //require uglify
    sass = require ('gulp-sass'),                           //require sass
    sourcemaps = require ('gulp-sourcemaps'),               // sass sourcemaps
    plumber = require ('gulp-plumber'),                     //require plumber
    connect = require ('gulp-connect'),                     // local server                                    // initialise server
    livereload = require('gulp-livereload'),                // livereload
    browserSync = require('browser-sync').create(),
    embedlr = require("gulp-embedlr"),                      // embed livereload snippet in html pages
    autoprefixer = require('gulp-autoprefixer'),            // sets missing browserprefixes
    concat = require('gulp-concat'),                        // concatinate js
    rename = require("gulp-rename"),                        // rename files
    jshint = require('gulp-jshint'),                        // check if js is ok
    cssmin = require('gulp-cssmin'),                        // minify the css files
    // neat = require('node-neat').includePaths             // make node-neat work
    stylish = require('jshint-stylish'),                    // make errors look good in shell
    ftp = require('vinyl-ftp'),
    ftp_details = require('./ftp-details.json');
    // neat.with('source/sass/');   // set path to sass for bourbon neat

/*******************************************************************************
## PATHS Source & Destination (RELATIVE TO ROOT FOLDER)
*******************************************************************************/

var path = {
    prototypes: 'source/prototypes/**/*.tpl.html' ,         // prototypes
    templates : 'source/templates/*.tpl.html',              // template files
    sass_src :  'source/sass/*.scss',                       // all sass files
    sass_dest : 'build/assets/css',                                // where to put minified css
    js_lint_src : 'build/assets/js/*.js',                          // all js that should be linted
    js_uglify_src : 'source/js/libs/*.js',                  // all js files that should not be concatinated
    js_concat_src : 'source/js/*.js',                       // all js files that should be concatinated
    js_vendor_src : 'source/js/vendor/*.js',                // vendor js scripts
    js_dest : 'build/assets/js',                                   // where to put minified js
    js_vendor_dest : 'build/assets/js/vendor',                     // where to copy vendor js
    img_src : 'source/img/**/*.*',                          // images for the website assets
    img_dest : 'build/assets/img'                                              // where to build out images to
};

/*******************************************************************************
## JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
    gulp.src(path.js_lint_src)                            // get the files
        .pipe(plumber())
        .pipe(jshint())                                     // lint the files
        .pipe(jshint.reporter(stylish))                     // present the results in a beautiful way
        .pipe(connect.reload());
});

//minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
    gulp.src(path.js_uglify_src)                          // get the files
        .pipe(plumber())
        .pipe(uglify())                                     // uglify the files
        .pipe(rename(function(dir,base,ext){                // give the files a min suffix
            var trunc = base.split('.')[0];
            return trunc + '.min' + ext;
        }))
        .pipe(gulp.dest(path.js_dest));                   // where to put the files
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
    gulp.src(path.js_concat_src)                          // get the files
        .pipe(plumber())
        .pipe(uglify())                                     // uglify the files
        .pipe(concat('main.min.js'))                        // concatinate to one file
        .pipe(header('/* Last Updated:' + gutils.date('mmm d, yyyy h:MM:ss TT')  + '*/\n')) // Add date top of the file
        .pipe(gulp.dest(path.js_dest));                   // where to put the files
});

// copy vendor js to build folder
gulp.task('js-copy-vendorscripts', function() {
  gulp.src(path.js_vendor_src)
    .pipe(plumber())
		.pipe(gulp.dest(path.js_vendor_dest));
});

/*******************************************************************************
## SASS TASKS
*******************************************************************************/

gulp.task('sass', function(){
    gulp.src(path.sass_src)                                 // source
        .pipe(plumber())
        .pipe(sourcemaps.init())                                  // Use plumber
        .pipe(sass({                                        // task
            // includePaths: ['styles'].concat(neat),        // Make node-neat work
            includePaths: require('node-neat').includePaths,
            // style: 'expanded'                             // choose style //expanded, compressed
        }))
        .pipe(header('/* Last Updated:' + gutils.date('mmm d, yyyy h:MM:ss TT')  + '*/\n')) // Add date top of the file
        .pipe(sourcemaps.write())
        //.pipe(autoprefixer(                                 // complete css with correct vendor prefixes
          //  'last 2 version',
          //  '> 1%',
        //    'ie 8',
        //    'ie 9',
        //    'ios 6',
        //    'android 4'
        //))
        //.pipe(cssmin())                                      // minify css

        .pipe(gulp.dest(path.sass_dest))                  //destination
        .pipe(connect.reload());
});

/*******************************************************************************
## Connect: setup a local server with live reload
*******************************************************************************/

gulp.task('connect', function() {
  connect.server({
    port: 4321,
    // root: [__dirname],
    root: "./build/",
    livereload: true
  });
});


/*******************************************************************************
## Live Reload
## Same as below. Just not as cool.
*******************************************************************************/

//Livereload goes here

/*******************************************************************************
## BROWSER SYNC
## Checks for changes in these files, triggers update of browser.
*******************************************************************************/

//http://localhost:3000/ is default.

// gulp.task('browser-sync', function() {
//     browserSync.init(['build/css/*.css', 'build/js/*.js', '*.html'], {
//         server: {
//             baseDir: './build/'
//         },
//         proxy: {
//                     host: 'chantown.dev',                          // development server
//                     port: '4321'                                // development server port
//                 }
//     });
// });

//set own settings... for Rails for example.

// gulp.task('browser-sync', function() {
//     browserSync.init(['css/*.css', 'js/*.js'], {        // files to inject
//         proxy: {
//             host: 'localhost',                          // development server
//             port: '2368'                                // development server port
//         }
//     });
// });




/*******************************************************************************
## build prototypes
## builds out HTML files from prototypes by including any templates linked in the files
## example syntax: @@include('./templates/_nav.html')
*******************************************************************************/
gulp.task('buildhtml', function() {
  gulp.src(path.prototypes)
    .pipe(plumber())
    .pipe(templator())
    .pipe(rename({
      extname: ""
     }))
    .pipe(rename({
      extname: ".html"
     }))
    .pipe(embedlr())
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload());
});

/*******************************************************************************
## build images
## builds out image assets and copys to build folder
##
*******************************************************************************/
gulp.task('build_imgs', function() {
  gulp.src(path.img_src)
    .pipe(plumber())
    .pipe(gulp.dest('./build/assets/img'))
    .pipe(connect.reload());
});

/*******************************************************************************
##  WATCH TASKS
##  Check files for changes and run task...
*******************************************************************************/

gulp.task('watch', function(){
    gulp.watch('source/js/**/*.js', ['js-lint', 'js-uglify', 'js-concat','js-copy-vendorscripts']);    //Watch Scripts
    gulp.watch('source/sass/**/*.scss', ['sass']);                             //Watch Styles
    gulp.watch('source/prototypes/**/**/*.tpl.html', ['buildhtml']);              // Watch prototypes
    gulp.watch('source/templates/**/**/*.tpl.html', ['buildhtml']);              // Watch templates

});



/*******************************************************************************
##  DEPLOY TASKS
##  upload and sync files to live or staging environments...
*******************************************************************************/


gulp.task('deploy-to-staging', function() {
  var conn = ftp.create({
    host: ftp_details.host,
    user: ftp_details.user,
    password: ftp_details.password,
    parallel: 10,
    log: gutils.log
  });
  var globs = [
    'build/**/**'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, {
      base: './build/',
      buffer: false
    })
    .pipe(plumber())
    .pipe(conn.newer('./chantown.com/newwebtest/joesfin')) // only upload newer files
    .pipe(conn.dest('./chantown.com/newwebtest/joesfin'));
});




/*******************************************************************************
##  GULP TASKS
##  Go Gulp Go! // "gulp" or "gulp scripts" etc...
*******************************************************************************/

gulp.task('default', ['buildhtml','js-uglify', 'js-lint', 'js-concat','js-copy-vendorscripts', 'build_imgs', 'sass', 'connect', 'watch']);
