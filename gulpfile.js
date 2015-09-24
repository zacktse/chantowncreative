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
    debug        = require('gulp-debug'),
    gutils       = require('gulp-util'), // gulp utilities (date)
    templator    = require('gulp-file-include'), // used to build preototype files from multiple includes
    browserify   = require('browserify'),
    source       = require('vinyl-source-stream'),
    streamify    = require('gulp-streamify'),
    header       = require('gulp-header'), // adds header to top of files (last updated message)
    uglify       = require('gulp-uglify'), //require uglify
    sass         = require('gulp-sass'), //require sass
    sourcemaps   = require('gulp-sourcemaps'), // sass sourcemaps
    plumber      = require('gulp-plumber'), //require plumber
    connect      = require('gulp-connect'), // local server // initialise server
    livereload   = require('gulp-livereload'), // livereload
    browserSync  = require('browser-sync').create(),
    embedlr      = require("gulp-embedlr"), // embed livereload snippet in html pages
    autoprefixer = require('gulp-autoprefixer'), // sets missing browserprefixes
    concat       = require('gulp-concat'), // concatinate js
    rename       = require("gulp-rename"), // rename files
    jshint       = require('gulp-jshint'), // check if js is ok
    cssmin       = require('gulp-cssmin'), // minify the css files
    stylish      = require('jshint-stylish'), // make errors look good in shell
    responsive   = require('gulp-responsive'), // used to resize images
    imagemin     = require('gulp-imagemin'), // used to compress images
    pngquant     = require('imagemin-pngquant'),
    parallel     = require('concurrent-transform'),
    changed      = require('gulp-changed'), // only process files that have changed
    imageResize  = require('gulp-image-resize'),
    os           = require("os"),
    ftp          = require('vinyl-ftp'),
    ftp_details  = require('./ftp-details.json');
    // neat.with('source/sass/');   // set path to sass for bourbon neat

/*******************************************************************************
## PATHS Source & Destination (RELATIVE TO ROOT FOLDER)
*******************************************************************************/

var path = {
    prototypes     : 'source/prototypes/**/*.tpl.html' , // prototypes
    templates      : 'source/templates/*.tpl.html', // template files
    sass_src       : 'source/sass/*.scss', // all sass files
    sass_dest      : 'build/assets/css', // where to put minified css
    js_lint_src    : 'build/assets/js/*.js', // all js that should be linted
    js_uglify_src  : 'source/js/libs/*.js', // all js files that should not be concatinated
    js_concat_src  : 'source/js/*.js', // all js files that should be concatinated
    js_vendor_src  : 'source/js/vendor/*.js', // vendor js scripts
    js_dest        : 'build/assets/js', // where to put minified js
    js_vendor_dest : 'build/assets/js/vendor', // where to copy vendor js
    resp_png_src   : ['source/img/**/*.png','!source/img/favicon/*.*','!source/img/vendor/*.*','!source/img/clients/*.*'],
    resp_jpg_src   : ['source/img/**/*.jpg','!source/img/favicon/*.*','!source/img/vendor/*.*'],
    img_src        : ['source/img/**/*.gif','source/img/**/*.svg', 'source/img/clients/*.png'], // images for the website assets
    img_dest       : 'build/assets/img', // where to build out images to
    fonts_src      : 'source/fonts/**/**.*', // where to grab fonts from
    fonts_dest     : 'build/assets/fonts', // where to place fonts
    favicon_src    : 'source/img/favicon/*.*' // 'dem favicons
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



// js concat and require modules and minify JS (using browserify and uglify)
gulp.task('js-browserify', function() {
  return browserify('./source/js/index.js', { debug: true})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
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
        .pipe(sourcemaps.init())                            // Use plumber
        .pipe(sass({                                        // task
            // includePaths: ['styles'].concat(neat),        // Make node-neat work
            includePaths: require('node-neat').includePaths,
            // style: 'expanded'                             // choose style //expanded,
            style: 'compressed'
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
## responsive images
## Generates different sized images from the src images for serving to different devices
## and copies them to the build folder
*******************************************************************************/
gulp.task('responsive-imgs', function() {
  // jpgs
  gulp.src(path.resp_jpg_src)
    .pipe(plumber())
    .pipe(changed('./build/assets/img/'))
    .pipe(gulp.dest('./build/assets/img/')) // copy full size images
    .pipe(debug({title: 'image:'}))
    // .pipe(parallel(
    //   imageResize({ width : 640 }), os.cpus().length
    // ))
    .pipe(parallel(
      responsive(
      {
        '**/*.jpg' : [
          {
            width: 320,
            rename: {
              //path.dirname += "";
              suffix: "_small"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 640,
            rename: {
              //path.dirname += "";
              suffix: "_small@2x"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 650,
            rename: {
              //path.dirname += "";
              suffix: "_medium"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 1300,
            rename: {
              //path.dirname += "";
              suffix: "_medium@2x"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 940,
            rename: {
              //path.dirname += "";
              suffix: "_large"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 1880,
            rename: {
              //path.dirname += "";
              suffix: "_large@2x"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 1440,
            rename: {
              //path.dirname += "";
              suffix: "_x-large"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          },
          {
            width: 2880,
            rename: {
              //path.dirname += "";
              suffix: "_x-large@2x"
              //path.extname = ".md"
            },
            background: {r: 255, g: 255, b: 255, a: 255},
            embed: true,
            withoutEnlargement: false
          }
        ]
      })
    ))
    .pipe(gulp.dest('./build/assets/img/'));

    // pngs
    gulp.src(path.resp_png_src)
      .pipe(plumber())
      .pipe(changed('./build/assets/img/'))
      .pipe(gulp.dest('./build/assets/img/')) // copy full size images
      .pipe(debug({title: 'image:'}))
      // .pipe(parallel(
      //   imageResize({ width : 640 }), os.cpus().length
      // ))
      .pipe(parallel(
        responsive(
        {
          '**/*.png' : [
            {
              width: 320,
              rename: {
                //path.dirname += "";
                suffix: "_small"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 640,
              rename: {
                //path.dirname += "";
                suffix: "_small@2x"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 650,
              rename: {
                //path.dirname += "";
                suffix: "_medium"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 1300,
              rename: {
                //path.dirname += "";
                suffix: "_medium@2x"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 940,
              rename: {
                //path.dirname += "";
                suffix: "_large"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 1880,
              rename: {
                //path.dirname += "";
                suffix: "_large@2x"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 1440,
              rename: {
                //path.dirname += "";
                suffix: "_x-large"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 2880,
              rename: {
                //path.dirname += "";
                suffix: "_x-large@2x"
                //path.extname = ".md"
              },
              background: {r: 255, g: 255, b: 255, a: 255},
              embed: true,
              withoutEnlargement: false
            }
          ]
        })
      ))

      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true,  use: [pngquant()] }))
      // .pipe(rename(function(dir,base,ext){                // append the filename with  '-sml' title before file extension
      //     var trunc = base.split('.')[0];
      //     return trunc + '-sml' + ext;
      // }))
      .pipe(gulp.dest('./build/assets/img/'));

    // svgs + gifs
    gulp.src(path.img_src)
      .pipe(plumber())
      .pipe(gulp.dest('./build/assets/img/'));

});


gulp.task('copy-favicon', function() {
  // favicon sheet
  gulp.src(path.favicon_src)
    .pipe(plumber())
    .pipe(gulp.dest('./build/'))
  .pipe(connect.reload());
});


/*******************************************************************************
## build images
## builds out image assets and copys to build folder
##
*******************************************************************************/
// gulp.task('build_imgs', function() {
//   gulp.src(path.img_src)
//     .pipe(plumber())
//     .pipe(gulp.dest('./build/assets/img'));
//   gulp.src(path.favicon_src)
//     .pipe(plumber())
//     .pipe(gulp.dest('./build/'))
//   .pipe(connect.reload());
// });



/*******************************************************************************
## fonts
## sends fonts to the build folder
##
*******************************************************************************/
gulp.task('build_fonts', function() {
  gulp.src(path.fonts_src)
    .pipe(plumber())
    .pipe(gulp.dest(path.fonts_dest));
});



/*******************************************************************************
##  WATCH TASKS
##  Check files for changes and run task...
*******************************************************************************/

gulp.task('watch', function(){
    // gulp.watch('source/js/**/*.js', ['js-lint', 'js-uglify', 'js-concat','js-copy-vendorscripts']);    //Watch Scripts

    gulp.watch('source/js/**/*.js', ['js-browserify', 'js-copy-vendorscripts']);    //Watch Scripts

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
    .pipe(conn.newer('./chantown.com/newwebtest/')) // only upload newer files
    .pipe(conn.dest('./chantown.com/newwebtest/'));
});




/*******************************************************************************
##  GULP TASKS
##  Go Gulp Go! // "gulp" or "gulp scripts" etc...
*******************************************************************************/

gulp.task('default', [
    'buildhtml',
    'build_fonts',
    //'js-uglify',
    //'js-lint',
    //'js-concat',
    'js-browserify',
    'js-copy-vendorscripts',
    'js-uglify',
    'responsive-imgs',
    'copy-favicon',
    'sass',
    'connect',
    'watch']);
