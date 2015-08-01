var gulp = require('./gulp')([
    'browserify',
    'compass',
    'images',
    'open',
    'watch',
    'server'
]);


/*******************************************************************************
##  GULP TASKS
##  top level or public gulp tasks
*******************************************************************************/

gulp.task('default', [
                      'buildhtml',
                      'build_fonts',
                      'js-uglify',
                      'js-lint',
                      'js-concat',
                      'js-copy-vendorscripts',
                      'responsive-imgs',
                      'copy-favicon',
                      'sass',
                      'connect',
                      'watch']);
