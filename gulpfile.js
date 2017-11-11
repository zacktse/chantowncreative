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
  // responsive = require('gulp-responsive'), // used to resize images
  imagemin = require('gulp-imagemin'), // used to compress images
  // pngquant = require('imagemin-pngquant'),
  parallel = require('concurrent-transform'),
  changed = require('gulp-changed'), // only process files that have changed
  // imageResize = require('gulp-image-resize'),
  // svgSprite = require('gulp-svg-sprite'), // generate svgs sprites and sprites scss
  // svg2png = require('gulp-svg2png'), // generates png fallback of the svg sprite
  os = require("os"),
  ftp = require('vinyl-ftp'),
  fs = require('fs'),
  // iconify = require('gulp-iconify'),
  handlebars = require('gulp-compile-handlebars'), // used to pre-compile the handlebars tempate for the portfolio gallery
  sizeOf = require('image-size'), // get image widths and heights by reading the image file
  size = require('gulp-size'), // used to output size of files in terminal

  combineMq = require('gulp-combine-mq'),
  minifyHTML = require('gulp-minify-html'), // compress static html files
  browserSync = require('browser-sync').create(),
  runSequence = require('run-sequence');
  // neat.with('source/sass/');   // set path to sass for bourbon neat




// get FTP details locally or from ENVIRONMENT Vars inside Netlify or Circle CI
if (process.env.NODE_ENV == 'PRODUCTION' || process.env.NODE_ENV == 'STAGING') {

  var ftp_details = {
    "host": process.env.FTP_HOST,
    "user": process.env.FTP_USER,
    "password": process.env.FTP_PASSWORD,
    "parallel": 5,
    "log": "gutils.log"
  };

} else {
  // local development environment
  var ftp_details = require('./ftp-details.json'); // grab local FTP settings file that's not tracked in git
}


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
      title: "Size of JS after minifying and gzip: ",
      gzip: true
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
      title: "Size of JS after minifying and gzip: ",
      gzip: true
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
      title: "Size of CSS after minifying and gzip: ",
      gzip: true
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
            {
              width: 600,
              rename: {
                //path.dirname += "";
                suffix: "_w600"
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
## fetchFromDatoCMS
## Get Data from dato CMS by exec shell script
## (this function creates portfolioImages.json file which is used to generate gallery html)
##
*******************************************************************************/
var exec = require('child_process').exec;


gulp.task('fetchFromDatoCMS', function (cb) {
  return exec('./node_modules/.bin/dato dump --token=a4754214d83c6ab0c00aaf348884dca174756847ef99fb7459', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

/*******************************************************************************
## Compile Portfolio
## generates html for the portfolio section which appears on the create.html page by accessing the json data
## from datoCMS (portfolioImages.json) and running it through a handlebars template
##
*******************************************************************************/

gulp.task('compilePortfolio', function () {

    var templateData = require ('./source/js/json/portfolioImages.json');
    var options = {
        helpers : {
            capitals : function(str){
                return str.toUpperCase();
            },
            ifGreaterThanEight : function(index, options) {
              // handlebars index is zero based
              if(index > 7){
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
            },
            getYearFromDate : function(theDate) {
              var year = theDate.slice(0,4);
              return year;
            }
        }
    };

    return gulp.src('source/templates/handlebars/portfolio/portfolio.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_portfolioInner.html'))
      .pipe(gulp.dest('source/prototypes/partials/widgets'));
});



/*******************************************************************************
## Compile Full Gallery
## generates html for the hidden full gallery section by accessing the json data
## from datoCMS (portfolioImages.json) and running it through a handlebars template
##
*******************************************************************************/

gulp.task('compileFullGallery', function () {

    var templateData = require ('./source/js/json/fullGalleryImages.json');
    var options = {
        helpers : {
            capitals : function(str){
                return str.toUpperCase();
            },
            ifGreaterThanEight : function(index, options) {
              // handlebars index is zero based
              if(index > 7){
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
            },
            getYearFromDate : function(theDate) {
              var year = theDate.slice(0,4);
              return year;
            }
        }
    };

    return gulp.src('source/templates/handlebars/gallery/gallery.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_fullGalleryInner.html'))
      .pipe(gulp.dest('source/prototypes/partials/widgets'));
});

/*******************************************************************************
## Compile Books
## generates html for the books section by accessing the json data
## from datoCMS (books.json) and running it through a handlebars template
*******************************************************************************/

gulp.task('compileBooks', function () {

    var templateData = require ('./source/js/json/books.json');
    var options = {
    };

    return gulp.src('source/templates/handlebars/books/books.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_bookLinks.html'))
      .pipe(gulp.dest('source/prototypes/partials/widgets'));
});

/*******************************************************************************
## Compile Clients
## generates html for the books section by accessing the json data
## from datoCMS (clients.json) and running it through a handlebars template
*******************************************************************************/

gulp.task('compileClients', function () {

    var templateData = require ('./source/js/json/clients.json');
    var options = {
    };

    return gulp.src('source/templates/handlebars/clients/clients.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_clientImages.html'))
      .pipe(gulp.dest('source/prototypes/partials/widgets'));
});


/*******************************************************************************
## Compile Homepage
## generates html for the homepage by accessing the json data
## from datoCMS (homePage.json) and running it through the handlebars template
##
*******************************************************************************/

gulp.task('compileHomepage', function () {

    var templateData = require ('./source/js/json/homePage.json');
    var options = {
      noEscape: true
    };

    return gulp.src('source/templates/handlebars/pages/homePage.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_home.html'))
      .pipe(gulp.dest('source/prototypes/partials/page-content/'));
});


/*******************************************************************************
## Compile ConsultPage
## generates html for the consult Page by accessing the json data
## from datoCMS (consultPage.json) and running it through the handlebars template
##
*******************************************************************************/

gulp.task('compileConsultPage', function () {

    var templateData = require ('./source/js/json/consultPage.json');
    var options = {
      noEscape: true
    };

    return gulp.src('source/templates/handlebars/pages/consultPage.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_consult.html'))
      .pipe(gulp.dest('source/prototypes/partials/page-content/'));
});

/*******************************************************************************
## Compile CreatePage
## generates html for the create Page by accessing the json data
## from datoCMS (createPage.json) and running it through the handlebars template
##
*******************************************************************************/

gulp.task('compileCreatePage', function () {

    var templateData = require ('./source/js/json/createPage.json');
    var options = {
      noEscape: true
    };

    return gulp.src('source/templates/handlebars/pages/createPage.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_create.html'))
      .pipe(gulp.dest('source/prototypes/partials/page-content/'));
});

/*******************************************************************************
## Compile ContactPage
## generates html for the contact Page by accessing the json data
## from datoCMS (contactPage.json) and running it through the handlebars template
##
*******************************************************************************/

gulp.task('compileContactPage', function () {

    var templateData = require ('./source/js/json/contactPage.json');
    var options = {
      noEscape: true
    };

    return gulp.src('source/templates/handlebars/pages/contactPage.handlebars')
      .pipe(handlebars(templateData, options))
      .pipe(rename('_contact.html'))
      .pipe(gulp.dest('source/prototypes/partials/page-content/'));
});
/*******************************************************************************
## BuildFromDato
## get data from DatoCMS, then compile the handlbars templates to HTML with it
********************************************************************************/
gulp.task('buildFromDato', function(callback) {
  runSequence('fetchFromDatoCMS',
              ['compilePortfolio','compileFullGallery','compileClients','compileBooks'],
              ['compileContactPage', 'compileHomepage', 'compileCreatePage', 'compileConsultPage'],
              callback);
});
//
//
// gulp.series('fetchFromDatoCMS', 'compileGallery', function(done) {
//   console.log("gallery image data loaded from Dato CMS and galleryHTML compiled");
// }));


/*******************************************************************************
## Build HTML Templates
## get gallery data from DatoCMS, then compile all html templates
********************************************************************************/
gulp.task('buildHtmlTemplates', function(callback) {
  runSequence('buildFromDato',
              'buildhtml',
              callback);
});



/*******************************************************************************
##  WATCH TASKS
##  Check files for changes and run task...
*******************************************************************************/

gulp.task('watch', function() {
  // gulp.watch('source/js/**/*.js', ['js-lint', 'js-uglify', 'js-concat','js-copy-vendorscripts']);    //Watch Scripts

  browserSync.init({

  });

  gulp.watch('source/js/**/*.js', ['js-watch']); // Watch Scripts

  gulp.watch('source/sass/**/*.scss', ['sass']); // Watch Styles
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
##  GULP Build
##  Build the site ready for deployment
*******************************************************************************/

gulp.task('build', [
  'buildHtmlTemplates',
  'copy-static-img-assets',
  // 'iconify',
  'build_fonts',
  //'js-uglify',
  //'js-lint',
  //'js-concat',
  'js-browserify',
  'js-copy-scripts',
  'js-copy-json',
  // 'responsive-imgs',
  'copy-favicon',
  'copy-sprites',
  'sass']);





/*******************************************************************************
##  GULP TASKS
##  Go Gulp Go! // "gulp" or "gulp scripts" etc...
*******************************************************************************/

gulp.task('default', [
  'buildHtmlTemplates',
  'copy-static-img-assets',
  // 'iconify',
  'build_fonts',
  //'js-uglify',
  //'js-lint',
  //'js-concat',
  'js-browserify',
  'js-copy-scripts',
  'js-copy-json',
  // 'responsive-imgs',
  'copy-favicon',
  'copy-sprites',
  'sass',
  'connect',
  'watch']);
