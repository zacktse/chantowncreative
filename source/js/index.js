var $ = require('jquery');


var PhotoSwipe = require('./modules/photoswipe_gallery');
var activePageHighlight = require('./modules/active_page_highlight');
var equalheights = require('./modules/equal_heights');
var back_to_top = require('./modules/back_to_top');
var isotope = require('./modules/isotope');
var lazyloading = require('./modules/lazyloading');
var deadPixels = require('./modules/pixels');

var StickyHeader = require('./modules/sticky-header');

var test = new deadPixels.DeadPixels;

test.initialize();

// deadPixels.deadPixels();


// execute photoswipe function if there is a gallery on the page
if (document.querySelector('.my-gallery') !== null ) {
  PhotoSwipe.initPhotoSwipeFromDOM('.my-gallery');
}
