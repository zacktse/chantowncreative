
window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.rias = window.lazySizesConfig.rias || {};
//window.lazySizesConfig.expand = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) > 600 ? 600 : 319;

// state available widths to replace with the {width} placeholder
window.lazySizesConfig.rias.widths = [320, 480, 640, 960, 1440];
window.lazySizesConfig.rias.widthmap = {
  320: '_small@2x',
  480: '_small@2x',
  640: '_medium',
  940: '_large',
  1440: '_x-large'
};
//window.lazySizesConfig.rias.absUrl = true;

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
