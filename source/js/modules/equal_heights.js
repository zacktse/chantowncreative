var $ = require('jquery');

$.fn.equalHeights = function(px) {
  $(this).each(function(){
    var currentTallest = 0;
    $(this).children().each(function(i){
      if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
    });
    if (!px && Number.prototype.pxToEm) currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
    // for ie6, set height since min-height isn't supported
    $(this).children().css({'height': currentTallest});
    $(this).children().css({'min-height': currentTallest});
  });
  return this;
};

// make cta blocks equal height
$('.cta-block').equalHeights();
