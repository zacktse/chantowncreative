'use strict'
var ScrollMagic = require('scrollmagic');
//var TweenMax = require('../vendor/tweenMax.min.js');
//require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
// var gsap = require("gsap");

var wWidth = window.innerWidth;
if (wWidth < 960) {
  var controller = new ScrollMagic.Controller({
      globalSceneOptions: {triggerHook: "onLeave"}
  });


  var pinNav = new ScrollMagic.Scene({
    triggerElement: '#js-global-nav'
  }).setPin('#js-global-nav').setClassToggle("#js-global-nav", "pinned").addTo(controller);

  var _isotpe = document.getElementById('isotope-filters');
  if (_isotpe !== null && _isotpe.length > 0 ) {
    var pinFilters = new ScrollMagic.Scene({
      triggerElement: '#isotope-filters'
    }).setPin('#isotope-filters').setClassToggle("#isotope-filters", "pinned").addTo(controller);
  }

}
