(function(){

 // change is-checked class on buttons
 $('.filter-btns').each( function( i, buttonGroup ) {
	 var $buttonGroup = $( buttonGroup );
	 $buttonGroup.on( 'click', 'button', function() {
		 $buttonGroup.find('.is-checked').removeClass('is-checked');
		 $( this ).addClass('is-checked');
	 });
 });


// var window_height = window.innerHeight();
// $("html, body").height(window_height);

window.onload = function() {
  // var header_pixel_bg = new DeadPixels('.header-pixels-container');
  var body_pixel_bg = new DeadPixels('.body-pixels-container');
}


})();
