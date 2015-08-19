
window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.rias = window.lazySizesConfig.rias || {};

// configure available widths to replace with the {width} placeholder
window.lazySizesConfig.rias.widths = [320, 480, 640, 960];
window.lazySizesConfig.rias.widthmap = {
  320: '_small@2x',
  640: '_medium@2x',
  940: '_large@2x',
  1440: '_x-large@2x'
};
window.lazySizesConfig.rias.absUrl = true;

// document.addEventListener('lazybeforeunveil', function(e){
//   if ($grid) {
// 		$grid.isotope({
// 	    itemSelector: '.grid-item',
// 			percentPosition: true,
// 	    masonry: {
// 	      columnWidth: 100
// 	    },
// 			sortBy:'random'
// 		  });
// 	}
// });
