var $ = require('jquery');
var equalheights = require('./modules/equal_heights');
var back_to_top = require('./modules/back_to_top');
var isotope = require('./modules/isotope');
var scroll = require('./modules/scroll');
var dp = require('./modules/pixels');
var StickyHeader = require('./modules/sticky-header');
// var Instafeed = require("./modules/instafeed.min");
var pixel_bg = new dp.DeadPixels();

Blazy = require('./vendor/blazy.min.js');

window.bLazy = new Blazy({
  selector: '.b-lazy', // all images
  offset: 200,
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

pixel_bg.initialize();


// execute photoswipe function if there is a gallery on the page
if (document.querySelector('.my-gallery') !== null) {
  PhotoSwipe.initPhotoSwipeFromDOM('.my-gallery');
}


// if (document.getElementById('instafeed') ) {
//     var feed = new Instafeed({
//         accessToken: '5667361962.1677ed0.939ab53a59ef4ecdb67d5c69f25cbd15'
//     });
//     feed.run();
// }
