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
    }]
});



// execute photoswipe function if there is a gallery on the page
if (document.querySelector('.my-gallery') !== null) {
  PhotoSwipe.initPhotoSwipeFromDOM('.my-gallery');
}

/*
* FlowType.JS v1.1
* Copyright 2013-2014, Simple Focus http://simplefocus.com/
*
* FlowType.JS by Simple Focus (http://simplefocus.com/)
* is licensed under the MIT License. Read a copy of the
* license in the LICENSE.txt file or at
* http://choosealicense.com/licenses/mit
*
* Thanks to Giovanni Difeterici (http://www.gdifeterici.com/)
*/

$.fn.flowtype = function(options) {

  // Establish default settings/variables
  // ====================================
  var settings = $.extend({
      maximum: 9999,
      minimum: 1,
      maxFont: 9999,
      minFont: 1,
      fontRatio: 35
    }, options),

    // Do the magic math
    // =================
    changes = function(el) {
      var $el = $(el),
        elw = $el.width(),
        width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw,
        fontBase = width / settings.fontRatio,
        fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
      $el.css('font-size', fontSize + 'px');
    };

  // Make the magic visible
  // ======================
  return this.each(function() {
    // Context for resize callback
    var that = this;
    // Make changes upon resize
    $(window).resize(function() {
      changes(that);
    });
    // Set changes on load
    changes(this);
  });
};

// $('body').flowtype();
