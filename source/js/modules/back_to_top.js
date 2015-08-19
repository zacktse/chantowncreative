'use strict';
var $ = require('jquery');


// scroll to top
$('.back-to-top a').on('click', function(e) {
   e.preventDefault();
       $('body,html').animate({
       scrollTop: 0
   }, 500);
  });
