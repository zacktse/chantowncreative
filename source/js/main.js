(function(){

  /*
		By Osvaldas Valutis, www.osvaldas.info
		Available for use under the MIT License
	*/
	$('#gallery-container').mixItUp();

	;( function ( document, window, index )
	{
		'use strict';

		// var elSelector		= '.main-header',
			var elSelector		= 'body',
			elClassHidden	= 'header--hidden',
			elClassNarrow	= 'header--narrow',
			elNarrowOffset	= 50,
			throttleTimeout	= 500,
			element			= document.querySelector( elSelector );

		if( !element ) return true;

		var dHeight			= 0,
			wHeight			= 0,
			wScrollCurrent	= 0,
			wScrollBefore	= 0,
			wScrollDiff		= 0,

			hasElementClass		= function( element, className ){ return element.classList ? element.classList.contains( className ) : new RegExp( '(^| )' + className + '( |$)', 'gi' ).test( element.className ); },
			addElementClass		= function( element, className ){ element.classList ? element.classList.add( className ) : element.className += ' ' + className; },
			removeElementClass	= function( element, className ){ element.classList ? element.classList.remove( className ) : element.className = element.className.replace( new RegExp( '(^|\\b)' + className.split( ' ' ).join( '|' ) + '(\\b|$)', 'gi' ), ' ' ); },

			throttle = function( delay, fn )
			{
				var last, deferTimer;
				return function()
				{
					var context = this, args = arguments, now = +new Date;
					if( last && now < last + delay )
					{
						clearTimeout( deferTimer );
						deferTimer = setTimeout( function(){ last = now; fn.apply( context, args ); }, delay );
					}
					else
					{
						last = now;
						fn.apply( context, args );
					}
				};
			};



		// scroll handlers
		window.addEventListener( 'scroll', throttle( throttleTimeout, function()
		{
			dHeight			= document.body.offsetHeight;
			wHeight			= window.innerHeight;
			wScrollCurrent	= window.pageYOffset;
			wScrollDiff		= wScrollBefore - wScrollCurrent;

			if( wScrollCurrent > elNarrowOffset ) // toggles "narrow" classname
			{
				if( !hasElementClass( element, elClassNarrow ) )
					addElementClass( element, elClassNarrow );
			}
			else removeElementClass( element, elClassNarrow );

			if( wScrollCurrent <= 0 ) // scrolled to the very top; element sticks to the top
				removeElementClass( element, elClassHidden );

			else if( wScrollDiff > 0 && hasElementClass( element, elClassHidden ) ) // scrolled up; element slides in
				removeElementClass( element, elClassHidden );

			else if( wScrollDiff < 0 ) // scrolled down
			{
				if( wScrollCurrent + wHeight >= dHeight && hasElementClass( element, elClassHidden ) ) // scrolled to the very bottom; element slides in
					removeElementClass( element, elClassHidden );

				else // scrolled down; element slides out
					addElementClass( element, elClassHidden );
			}

			wScrollBefore = wScrollCurrent;

      showBackToTopLink();


		}));


    function showBackToTopLink()
    {
        var scrollBarPosition = window.pageYOffset | document.body.scrollTop;
        var bk2TopLink = document.querySelectorAll('.back-to-top')[0];
        // show back to top link after user has scrolled 200px from the top
        if(scrollBarPosition > 40) {
          bk2TopLink.classList.add('visible');
        }
        else {
            bk2TopLink.classList.remove('visible');
        }
    }

	}( document, window, 0 ));



	// isotope / masonry-grid

	var $grid = $('.masonry-grid').isotope({
    itemSelector: '.grid-item',
		percentPosition: true,
    masonry: {
      columnWidth: 100
    }
  });


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

	// filter functions
  var filterFns = {
    // show if number is greater than 50
    // numberGreaterThan50: function() {
    //   var number = $(this).find('.number').text();
    //   return parseInt( number, 10 ) > 50;
    // },
    // // show if name ends with -ium
    // ium: function() {
    //   var name = $(this).find('.name').text();
    //   return name.match( /ium$/ );
    // }
  };

	// bind isotope filter button click
 $('.filter-btns').on( 'click', 'button', function() {
	 var filterValue = $( this ).attr('data-filter');
	 // use filterFn if matches value
	 //filterValue = filterFns[ filterValue ] || filterValue;


	 $grid.isotope({
		 filter: filterValue,
		 itemSelector: '.grid-item',
		 masonry: {
			 colmunWidth: '.grid-sizer'
		 },
		 sortBy:'random'
		 });
 });
 // change is-checked class on buttons
 $('.filter-btns').each( function( i, buttonGroup ) {
	 var $buttonGroup = $( buttonGroup );
	 $buttonGroup.on( 'click', 'button', function() {
		 $buttonGroup.find('.is-checked').removeClass('is-checked');
		 $( this ).addClass('is-checked');
	 });
 });





	var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
								pid: linkEl.getAttribute('data-artwork-title')
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');



	// // handle url redirects
	// $('.content-main').on( 'click', 'button.fancy-btn', function() {
	// 	var url = $( this ).attr('data-url');
	// 	Window.location(url);
	// });


	// scroll to top
	$('.back-to-top a').on('click', function(e) {
		 e.preventDefault();
		 		 $('body,html').animate({
				 scrollTop: 0
		 }, 500);
		});

})();
