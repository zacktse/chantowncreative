var $ = require('jquery');
var equalheights = require('./modules/equal_heights');
var back_to_top = require('./modules/back_to_top');
var isotope = require('./modules/isotope');
var scroll = require('./modules/scroll');
// var particlesJS = require('./modules/particles.js');
// var dp = require('./modules/pixels');
var StickyHeader = require('./modules/sticky-header');
// var Instafeed = require("./modules/instafeed.min");
// var pixel_bg = new dp.DeadPixels();

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



// execute photoswipe function if there is a gallery on the page
if (document.querySelector('.my-gallery') !== null) {
  PhotoSwipe.initPhotoSwipeFromDOM('.my-gallery');
}



/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', '/assets/json/particlesjs-config.json', function() {
    console.log('callback - particles-js config loaded');
});



//  (function(win, doc, $){
  
  
//   win.colorSwarm = function(canvas) {
  
//       var ctx;
//       var circles;
//       var tick = 0;
//       var numCircles = 250;
//       if (window.innerWidth < 400) {
//           numCircles = 100;
//       }
//       var h = eval(canvas.getAttribute('h') || '2/3');
      
    
//     // returns a random color from an array of possible colour values (colors array)
//       var randomColor = function() {
//         var colors = ['#FF5000', '#0078AE', '#F65097'];
//         return colors[Math.floor(Math.random() * colors.length)]
//       };
    
//       var resize = window.resize = function() {
//         //   canvas.height = $(canvas).parent().outerHeight() * h;
//         canvas.height = doc.body.offsetHeight; 
//         canvas.width = window.innerWidth;
//       };
  
//       $(function() {
//           ctx = canvas.getContext('2d');
//           resize();
        
//           circles = [];
  
//           for (var i=0; i<numCircles; i++) {
//               var x = Math.random()*canvas.width;
//               var y = Math.random()*canvas.height;
//               var c = new Circle(x, y, canvas.width, canvas.height);
//               c.draw();
//               circles.push(c);
//           }
  
//           var loop = function() {
//               window.requestAnimFrame(loop);
//               ctx.clearRect(0, 0, canvas.width, canvas.height);
//               for (var i=0; i<circles.length; i++) {
//               circles[i].frame();
//               }
//           };
  
//           window.requestAnimFrame = function(){
//               return window.requestAnimationFrame ||
//               window.webkitRequestAnimationFrame ||
//               window.mozRequestAnimationFrame ||
//               window.oRequestAnimationFrame ||
//               window.msRequestAnimationFrame ||
//               function(a) { window.setTimeout(a,1E3/60); };
//           }();
  
//           loop();
//       });
  
    
    
  
    
      
    
//       var Circle = function(x, y) {
//           this.pos = [ x, y ];
//           this.r = (1.5*Math.random())+0.2;
//           this.c = randomColor();
//           this.v = [
//               (Math.random()-0.5)*0.08,
//               (Math.random()-0.5)*0.08
//           ];
//       };
  
//       Circle.prototype.getBound = function(i) {
//           return i ? canvas.height : canvas.width;
//       };
  
//       var i;
//       Circle.prototype.frame = function() {
//           for (i=0; i<2; i++) {
//               if (this.pos[i] > this.getBound(i)-10) { this.v[i] *= -1; }
//               else if (this.pos[i] < 10) { this.v[i] *= -1; }
//               this.pos[i] += this.v[i]*10;
//           }
  
//           this.draw();
//       };
  
//       Circle.prototype.draw = function() {
//           ctx.fillStyle = this.c;
//           ctx.beginPath();
//           ctx.arc(this.pos[0], this.pos[1], this.r, 0, 2 * Math.PI, false);
//           ctx.fill();
//       };
//   }
  
//   $(function() {
//       $('canvas[color-swarm]').each(function() {
//           colorSwarm(this);
//       });
//   })
  
  
  
//   })(window, document, $);