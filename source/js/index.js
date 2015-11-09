var $ = require('jquery');
var visible = require('./modules/visible');
var activePageHighlight = require('./modules/active_page_highlight');
var equalheights = require('./modules/equal_heights');
var back_to_top = require('./modules/back_to_top');
var isotope = require('./modules/isotope');
var scroll = require('./modules/scroll');
var dp = require('./modules/pixels');
var StickyHeader = require('./modules/sticky-header');
var pixel_bg = new dp.DeadPixels();




pixel_bg.initialize();

Blazy = require('./vendor/blazy.min.js');

window.bLazy = new Blazy({
  selector: '.b-lazy', // all images
  breakpoints: [
    {
      width: 420, // max-width
      src: 'data-src-small'
    },
    {
      width: 959, // max-width
      src: 'data-src-medium'
    },
    {
      width: 1440, // max-width
      src: 'data-src-large'
    }],
  successClass: 'b-loaded',
  success: function(ele) {
    ele.parentNode.classList.add("loaded");
  }
}
);



// execute photoswipe function if there is a gallery on the page
if (document.querySelector('.my-gallery') !== null) {
  PhotoSwipe.initPhotoSwipeFromDOM('.my-gallery');
}
