/*==============================================================================
##  Chantown Creative website - July 2015
##
##  Based on, and borrowed from, a combination of the UAL gulpfile (private repo)
##  and https://github.com/thesherps/gulp.bourbon.boilerplate
##
##
==============================================================================*/

/*******************************************************************************
## Require Stuff
*******************************************************************************/

var gulp = require('gulp'), //require gulp
  debug = require('gulp-debug'),
  gutils = require('gulp-util'), // gulp utilities (date)
  templator = require('gulp-file-include'), // used to build preototype files from multiple includes
  browserify = require('browserify'),
  //exorcist = require('exorcist'), // separates out the js map for browserify to an external file
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  transform = require('vinyl-transform'),
  gutil = require('gulp-util'),
  streamify = require('gulp-streamify'),
  header = require('gulp-header'), // adds header to top of files (last updated message)
  uglify = require('gulp-uglify'), //require uglify
  sass = require('gulp-sass'), //require sass
  sourcemaps = require('gulp-sourcemaps'), // sass sourcemaps
  plumber = require('gulp-plumber'), //require plumber
  connect = require('gulp-connect'), // local server // initialise server
  livereload = require('gulp-livereload'), // livereload
  embedlr = require("gulp-embedlr"), // embed livereload snippet in html pages
  autoprefixer = require('gulp-autoprefixer'), // sets missing browserprefixes
  concat = require('gulp-concat'), // concatinate js
  rename = require("gulp-rename"), // rename files
  jshint = require('gulp-jshint'), // check if js is ok
  cssmin = require('gulp-cssmin'), // minify the css files
  shorthand = require('gulp-shorthand'), // convert CSS to shorthand
  stylish = require('jshint-stylish'), // make errors look good in shell
  responsive = require('gulp-responsive'), // used to resize images
  imagemin = require('gulp-imagemin'), // used to compress images
  pngquant = require('imagemin-pngquant'),
  parallel = require('concurrent-transform'),
  changed = require('gulp-changed'), // only process files that have changed
  imageResize = require('gulp-image-resize'),
  svgSprite = require('gulp-svg-sprite'), // generate svgs sprites and sprites scss
  svg2png = require('gulp-svg2png'), // generates png fallback of the svg sprite
  os = require("os"),
  ftp = require('vinyl-ftp'),
  fs = require('fs'),
  iconify = require('gulp-iconify'),
  // foreach = require('gulp-foreach'),
  // toJson = require('gulp-to-json'),
  handlebars = require('gulp-compile-handlebars'), // used to pre-compile the handlebars tempate for the portfolio gallery
  sizeOf = require('image-size'), // get image widths and heights by reading the image file
  size = require('gulp-size'), // used to output size of files in terminal
  ftp_details = require('./ftp-details.json'),
  combineMq = require('gulp-combine-mq'),
  minifyHTML = require('gulp-minify-html'), // compress static html files
  browserSync = require('browser-sync').create();
  // neat.with('source/sass/');   // set path to sass for bourbon neat

/*******************************************************************************
## PATHS Source & Destination (RELATIVE TO ROOT FOLDER)
*******************************************************************************/

var path = {
  prototypes: 'source/prototypes/**/*.tpl.html', // prototypes
  templates: 'source/templates/*.tpl.html', // template files
  sass_src: 'source/sass/*.scss', // all sass files
  sass_dest: 'build/assets/css', // where to put minified css
  js_lint_src: 'build/assets/js/*.js', // all js that should be linted
  js_uglify_src: 'source/js/libs/*.js', // all js files that should not be concatinated
  js_concat_src: 'source/js/*.js', // all js files that should be concatinated
  js_vendor_src: 'source/js/vendor/*.js', // vendor js scripts
  js_dest: 'build/assets/js', // where to put minified js
  js_vendor_dest: 'build/assets/js/vendor', // where to copy vendor js
  js_json_src: 'source/js/json/*.js', // json files
  js_json_dest: 'build/js/json', // json files destination in build folder
  resp_png_src: ['source/img/*.png', '!source/img/favicon/*.*', '!source/img/vendor/*.*', '!source/img/clients/*.*'],
  resp_jpg_src: ['source/**/*.jpg', '!source/img/favicon/*.*', '!source/img/vendor/*.*'],
  // resp_img_src: ['source/img/**/*.jpg','source/img/**/*.png','!source/img/favicon/*.*','!source/img/vendor/*.*'],

  img_src: ['source/img/**/*.gif', 'source/img/*.jpg', 'source/img/*.png', 'source/img/**/*.svg', 'source/img/clients/*.png', 'source/sass/components/photoswipe/**/*.png', 'source/sass/components/photoswipe/**/*.svg'], // images for the website assets

  gallery_images: ['source/img/gallery/**/*.jpg', 'source/img/gallery/**/*.png'],
  // images for the portfolio gallery

  img_dest: 'build/assets/img', // where to build out images to
  fonts_src: 'source/fonts/**/**.*', // where to grab fonts from
  fonts_dest: 'build/assets/fonts', // where to place fonts
  favicon_src: 'source/img/favicon/*.*' // 'dem favicons
};






/*******************************************************************************
## JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
  gulp.src(path.js_lint_src) // get the files
    .pipe(plumber())
    .pipe(jshint()) // lint the files
    .pipe(jshint.reporter(stylish)) // present the results in a beautiful way
    .pipe(connect.reload());
});

//minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
  gulp.src(path.js_uglify_src) // get the files
    .pipe(plumber())
    .pipe(size({
      title: "Size of JS before minifying: "
    }))
    .pipe(uglify()) // uglify the files
    .pipe(rename(function(dir, base, ext) { // give the files a min suffix
      var trunc = base.split('.')[0];
      return trunc + '.min' + ext;
    }))
    .pipe(size({
      title: "Size of JS after minifying: "
    }))
    .pipe(gulp.dest(path.js_dest)); // where to put the files
});

// minify & concatinate all other js
gulp.task('js-concat', function() {
  gulp.src(path.js_concat_src) // get the files
    .pipe(plumber())

    .pipe(uglify()) // uglify the files
    .pipe(concat('main.min.js')) // concatinate to one file
    .pipe(header('/* Last Updated:' + gutils.date('mmm d, yyyy h:MM:ss TT') + '*/\n')) // Add date top of the file

    .pipe(gulp.dest(path.js_dest)); // where to put the files
});



// js concat and require modules and minify JS (using browserify and uglify)
// gulp.task('js-browserify', function() {
//   return browserify('./source/js/index.js', {
//     debug: true
//   })
//     .bundle()
//     .pipe(source('bundle.js'))
//     .pipe(size({
//       title: "Size of JS before minifying: "
//     }))
//
//     .pipe(gulp.dest(path.js_dest)) // where to put the files
//     .pipe(size({
//       title: "Size of JS after minifying: "
//     }))
//
//
// //.pipe(streamify(uglify()))
// });


// gulp.task('js-browserify', function() {
//   var browserified = transform(function(filename) {
//     var b = browserify(filename);
//     return b.bundle();
//   });
//
//   return gulp.src(['./source/js/index.js'])
//     .pipe(browserified)
//     .pipe(uglify())
//     .pipe(gulp.dest('build/assets/js'));
// });


gulp.task('js-browserify', function() {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './source/js/index.js',
    debug: false // set this to false to disable source maps
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({
    //   loadMaps: false
    // }))
    .pipe(size({
      title: "Size of JS before minifying: "
    }))
    // Add transformation tasks to the pipeline here.
    .pipe(uglify(
      {
        options: {
          compress: {
            dead_code: true, // discard unreachable code
            drop_debugger: true, // discard “debugger” statements
            global_defs: { // global definitions
              "DEBUG": false, // matters for some libraries
            },
            conditionals: true, // optimize if-s and conditional expressions
            comparisons: true, // optimize comparisons
            evaluate: true, // evaluate constant expressions
            booleans: true, // optimize boolean expressions
            loops: true, // optimize loops
            unused: true, // drop unused variables/functions
            hoist_funs: true, // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: true, // optimize if-s followed by return/continue
            join_vars: true, // join var declarations
            warnings: true // warn about potentially dangerous optimizations/code
          }
        }
      }))
    .pipe(size({
      title: "Size of JS after minifying: "
    }))
    .on('error', gutil.log)
    //.pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('./build/assets/js'));
});



// copy  js to build folder
gulp.task('js-copy-scripts', function() {
  gulp.src(path.js_vendor_src)
    .pipe(plumber())
    .pipe(gulp.dest(path.js_vendor_dest));
  gulp.src(path.js_json_src)
    .pipe(plumber())
    .pipe(gulp.dest(path.js_json_dest))
});

gulp.task('js-copy-json', function() {
  gulp.src("./source/js/json/*.json")
    .pipe(gulp.dest("build/assets/json/"))
});

/*******************************************************************************
## SASS TASKS
*******************************************************************************/

gulp.task('sass', function() {
  gulp.src(path.sass_src) // source
    .pipe(plumber())
    .pipe(sourcemaps.init()) // Use plumber
    .pipe(sass({ // task
      // includePaths: ['styles'].concat(neat),        // Make node-neat work
      includePaths: require('node-neat').includePaths,
      // style: 'expanded'                             // choose style //expanded,
      style: 'expanded'
    }))
    .pipe(header('/* Last Updated:' + gutils.date('mmm d, yyyy h:MM:ss TT') + '*/\n')) // Add date top of the file
    .pipe(sourcemaps.write())
    .pipe(autoprefixer( // complete css with correct vendor prefixes
      'last 2 version',
      '> 1%',
      'ie 8',
      'ie 9',
      'ios 6',
      'android 4'
    ))
    .pipe(size({
      title: "Size of CSS before minifying: "
    }))
    .pipe(combineMq({
      beautify: false
    }))
    //.pipe(shorthand())  // removed becuase it was breaking shit
    .pipe(cssmin()) // minify css
    .pipe(size({
      title: "Size of CSS after minifying: "
    }))
    .pipe(gulp.dest(path.sass_dest)) //destination
    .pipe(connect.reload());
});


gulp.task('sass-watch', ['sass'], browserSync.reload);


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
    .pipe(changed('./build/assets/'))
    .pipe(gulp.dest('./build/assets/')) // copy full size images
    .pipe(debug({
      title: 'processing .jpg images:'
    }))
    // process JPGs
    .pipe(parallel(
      responsive(
        {
          '**/*.jpg': [
            {
              width: 400,
              rename: {
                //path.dirname += "";
                suffix: "_w400"
              //path.extname = ".md"
              },
              background: {
                r: 255,
                g: 255,
                b: 255,
                a: 255
              },
              embed: true,
              withoutEnlargement: false
            },
            // {
            //   width: 600,
            //   rename: {
            //     //path.dirname += "";
            //     suffix: "_w600"
            //   //path.extname = ".md"
            //   },
            //   background: {
            //     r: 255,
            //     g: 255,
            //     b: 255,
            //     a: 255
            //   },
            //   embed: true,
            //   withoutEnlargement: false
            // },
            {
              width: 800,
              rename: {
                //path.dirname += "";
                suffix: "_w800"
              //path.extname = ".md"
              },
              background: {
                r: 255,
                g: 255,
                b: 255,
                a: 255
              },
              embed: true,
              withoutEnlargement: false
            },
            {
              width: 1000,
              rename: {
                //path.dirname += "";
                suffix: "_w1000"
              //path.extname = ".md"
              },
              background: {
                r: 255,
                g: 255,
                b: 255,
                a: 255
              },
              embed: true,
              withoutEnlargement: false
            },
            // {
            //   width: 1500,
            //   rename: {
            //     //path.dirname += "";
            //     suffix: "_w1500"
            //   //path.extname = ".md"
            //   },
            //   background: {
            //     r: 255,
            //     g: 255,
            //     b: 255,
            //     a: 255
            //   },
            //   embed: true,
            //   withoutEnlargement: false
            // },
            {
              width: 2000,
              rename: {
                //path.dirname += "";
                suffix: "_w2000"
              //path.extname = ".md"
              },
              background: {
                r: 255,
                g: 255,
                b: 255,
                a: 255
              },
              embed: true,
              withoutEnlargement: false
            }
          // {
          //   width: 2500,
          //   rename: {
          //     //path.dirname += "";
          //     suffix: "_w2500"
          //   //path.extname = ".md"
          //   },
          //   background: {
          //     r: 255,
          //     g: 255,
          //     b: 255,
          //     a: 255
          //   },
          //   embed: true,
          //   withoutEnlargement: false
          // },
          ]
        }, {
          errorOnUnusedImage: false
        })))
    .pipe(imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./build/assets/'));


});


gulp.task('copy-static-img-assets', function() {
  // svgs, pngs + gifs
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
## generate icons
## builds out png icon fallbacks  from svgs
*******************************************************************************/
// gulp.task('iconify', function() {
//   iconify({
//     src: './img/icons/*.svg',
//     pngOutput: './img/icons/png',
//     scssOutput: './scss',
//     cssOutput: './css',
//     styleTemplate: '_icon_gen.scss.mustache',
//     defaultWidth: '300px',
//     defaultHeight: '200px',
//     svgoOptions: {
//       enabled: true,
//       options: {
//         plugins: [
//           {
//             removeUnknownsAndDefaults: false
//           },
//           {
//             mergePaths: false
//           }
//         ]
//       }
//     }
//   });
// });




/*******************************************************************************
## SVG Sprites
## creates svg sprites
***********************************************************************
*/

SVGconfig = {
  shape: {
    dimension: { // Set maximum dimensions
      maxWidth: 30,
      maxHeight: 30
    },
    spacing: { // Add padding
      padding: 5
    },
  //dest: 'intermediate-svg' // Keep the intermediate files
  },
  mode: {
    // view: { // Activate the «view» mode
    //   bust: false,
    //   render: {
    //     scss: {
    //       layout: "diagonal"
    //     } //true // Activate Sass output (with default options)
    //   }
    // },
    //symbol: true, // Activate the «symbol» mode
    css: {
      "layout": "diagonal",
      "example": true,
      "render": {
        "scss": {
          "dest": "_sprites.scss",
          "template": "./source/img/icons/svg/_sprite-template.scss"
        }
      },
      "sprite": "sprite.svg",
      "prefix": ".icn-",
      "bust": false
    }
  }
};


gulp.task('build_svg_sprites', function() {
  gulp.src('*.svg', {
    cwd: './source/img/icons/svg'
  })
    .pipe(plumber())
    .pipe(svgSprite(SVGconfig))
    .pipe(gulp.dest('./source/img/icons/sprites'));
});

gulp.task('generate_fallback_png_sprite', function() {
  return gulp.src('./source/img/icons/sprites/css/*.svg')
    .pipe(plumber())
    .pipe(svg2png())
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest('./source/img/icons/sprites/css'));
});

gulp.task('copy-sprites', function() {
  gulp.src('./source/img/icons/sprites/css/*.svg')
    .pipe(plumber())
    .pipe(gulp.dest('./build/assets/img/sprites/'));
  gulp.src('./source/img/icons/sprites/css/*.png')
    .pipe(plumber())
    .pipe(gulp.dest('./build/assets/img/sprites/'));

});



/*******************************************************************************
## Build image Gallery JSON
## creates the JSON file which contains information about the images in the gallery folder to use with the Photoswipe gallery implementation on the front end of the website
##
*******************************************************************************/
gulp.task('build_gallery_json', function() {
  // return gulp.src(path.gallery_images)
  //   .pipe(plumber())
  //   .pipe(foreach(function(stream, file){
  //       //.pipe(sizeOf(file))
  //       .pipe(debug({title: file}))
  //   }));
  gulp.src(path.gallery_images)
    .pipe(require('gulp-filelist')('filelist.json'))
    .pipe(gulp.dest('out'));

    // .pipe(toJson({
    //   filename: 'gallery.json'
    // strip: /^.+\/?\\?public\/?\\?/ //create just file names by removing everything from left of public/ folder

});




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

gulp.task('watch', function() {
  // gulp.watch('source/js/**/*.js', ['js-lint', 'js-uglify', 'js-concat','js-copy-vendorscripts']);    //Watch Scripts

  browserSync.init({

  });

  gulp.watch('source/js/**/*.js', ['js-watch']); //Watch Scripts

  gulp.watch('source/sass/**/*.scss', ['sass']); //Watch Styles
  gulp.watch('source/prototypes/**/**/*.tpl.html', ['buildhtml']); // Watch prototypes
  gulp.watch('source/templates/**/**/*.tpl.html', ['buildhtml']); // Watch templates

});

gulp.task('js-watch', ['js-browserify', 'js-copy-scripts', 'js-copy-json'], browserSync.reload);



/*******************************************************************************
##  Minify image assets
##  minifies the images in assets/img
*******************************************************************************/

gulp.task('minify-images', function() {
  return gulp.src(['./build/assets/img/**/*.png', './build/assets/img/**/*.jpg'])
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: false,
      interlaced: true,
    //use: [pngquant()]
    }))
    .pipe(gulp.dest('./build/assets/img/'));
});

/*******************************************************************************
##  Minify HTML
##  minifies the html pages - before uploading to production
*******************************************************************************/

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src('./build/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./build/'));
});



/*******************************************************************************
##  DEPLOY TASKS
##  upload and sync files to live or staging environments...
*******************************************************************************/

// deploy to production - www.chantown.com/

// minify images and built html first, then ftp files to the live server in the root directory
gulp.task('deploy-to-production', ['minify-images', 'minify-html', 'deploy-files-to-production']);


gulp.task('deploy-files-to-production', function() {
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
    .pipe(conn.newer('./chantown.com/')) // only upload newer files
    .pipe(conn.dest('./chantown.com/'));
});




// deploy to staging - www.chantown.com/newwebtest/
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
  'copy-static-img-assets',
  // 'iconify',
  'build_fonts',
  //'js-uglify',
  //'js-lint',
  //'js-concat',
  'js-browserify',
  'js-copy-scripts',
  'js-copy-json',
  'responsive-imgs',
  'copy-favicon',
  'copy-sprites',
  'sass',
  'connect',
  'watch']);
