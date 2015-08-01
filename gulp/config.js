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
    resp_png_src: ['source/img/**/*.png','!source/img/favicon/*.*','!source/img/vendor/*.*'],
    resp_jpg_src: ['source/img/**/*.jpg','!source/img/favicon/*.*','!source/img/vendor/*.*'],
    img_src : ['source/img/**/*.gif','source/img/**/*.svg'],                          // images for the website assets
    img_dest : 'build/assets/img',                          // where to build out images to
    fonts_src : 'source/fonts/**/**.*',                     // where to grab fonts from
    fonts_dest : 'build/assets/fonts',                     // where to place fonts
    favicon_src: 'source/img/favicon/*.*'                   // 'dam favicons
};
