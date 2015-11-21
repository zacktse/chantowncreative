'use strict'
var ScrollMagic = require('scrollmagic');
//var TweenMax = require('../vendor/tweenMax.min.js');
//require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
// var gsap = require("gsap");

var wWidth = window.innerWidth;
//console.log("document innerWidth is: " + wWidth);
//if ( (wWidth < 960) ) {
//console.log("on mobile");
var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
    triggerHook: "onLeave"
  }
});




var pinNav = new ScrollMagic.Scene({
  triggerElement: '#js-global-nav'
}).setPin('#js-global-nav').setClassToggle("#js-global-nav", "pinned").addTo(controller);

//} // end if < 960


if ( (wWidth > 960) ) {
  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: "onLeave"
    }
  });
  if (document.title === "Create: Chantown Creative") {

    var filtersController = new ScrollMagic.Controller({
      globalSceneOptions: {
        triggerHook: "onLeave"
      }
    });

    var pinFilters = new ScrollMagic.Scene({
      triggerElement: '#isotope-filters'
    }).setPin('#isotope-filters').setClassToggle("#isotope-filters", "pinned").addTo(filtersController);
    //}).setClassToggle("#isotope-filters", "pinned").addTo(filtersController);

  }

}

// stick isotope filters to top of viewport after scrolling past them on the create page on desktop only
// var _isotpe = "";
// var _isotpe = document.getElementById('isotope-filters');
//
// if ((wWidth > 960) && (_isotpe !== null && _isotpe.length > 0)) {
//
//
//
// }
