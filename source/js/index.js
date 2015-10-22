var $ = require('jquery');
// var lazyloading = require('responsively-lazy');
// //var lazyloading = require('./modules/lazyloading');
// var Exports = require('./modules/exports');
var visible = require('./modules/visible');
var PhotoSwipe = require('./modules/photoswipe_gallery');
var activePageHighlight = require('./modules/active_page_highlight');
var equalheights = require('./modules/equal_heights');
var back_to_top = require('./modules/back_to_top');
var isotope = require('./modules/isotope');
var scroll = require('./modules/scroll');
var dp = require('./modules/pixels');

var StickyHeader = require('./modules/sticky-header');

var pixel_bg = new dp.DeadPixels();

pixel_bg.initialize();



// execute photoswipe function if there is a gallery on the page
if (document.querySelector('.my-gallery') !== null) {
  PhotoSwipe.initPhotoSwipeFromDOM('.my-gallery');
}
