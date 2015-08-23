(function(){












 // change is-checked class on buttons
 $('.filter-btns').each( function( i, buttonGroup ) {
	 var $buttonGroup = $( buttonGroup );
	 $buttonGroup.on( 'click', 'button', function() {
		 $buttonGroup.find('.is-checked').removeClass('is-checked');
		 $( this ).addClass('is-checked');
	 });
 });


 var pixel_bg = new DeadPixels();
 //pixel_bg.initialize();




	// // handle url redirects
	// $('.content-main').on( 'click', 'button.fancy-btn', function() {
	// 	var url = $( this ).attr('data-url');
	// 	Window.location(url);
	// });







})();
