'use strict'
var ScrollMagic = require('scrollmagic');
//var TweenMax = require('../vendor/tweenMax.min.js');
require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap');
var gsap = require("gsap");

var controller = new ScrollMagic.Controller({
    globalSceneOptions: {triggerHook: "onLeave"}
});
// init scene
// var scene = new ScrollMagic.Scene({
//         duration: 300,
//         offset: 100
//     })
//     .addTo(controller)

var pinNav = new ScrollMagic.Scene({
  triggerElement: '#js-global-nav'
}).setPin('#js-global-nav').setClassToggle("#js-global-nav", "pinned").addTo(controller);
