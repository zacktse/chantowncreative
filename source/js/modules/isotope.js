var $ = require('jquery');


var Isotope = require('isotope-layout');
//var Isotope = require('../vendor/isotope.pkgd.min.js');
// //var IsotopeCols = require('isotope-fit-columns');
//
var PhotoSwipe = require('../vendor/photoswipe.min.js');
var Handlebars = require('handlebars');
var PhotoSwipeUI_Default = require('../vendor/photoswipe-ui-default.min.js');


var gallery_items = {};

var runPhotoswipe = function() {
  var $window = $(window);
  var $images = $('#gallery_container figure img');

  var itemReveal = Isotope.Item.prototype.reveal;
  Isotope.Item.prototype.reveal = function() {
    itemReveal.apply(this, arguments);
    $(this.element).removeClass('isotope-hidden');
  };

  var itemHide = Isotope.Item.prototype.hide;
  Isotope.Item.prototype.hide = function() {
    itemHide.apply(this, arguments);
    $(this.element).addClass('isotope-hidden');
  };


  var isotope_gallery = new Isotope('.isotope-grid', {
    // percentPosition: true,
    masonry: {
      columnWidth: '.item',
      // columnWidth:160,
      // fitWidth: true,
      gutter: 10
    },
    itemSelector: '.item',
    transitionDuration: '.2s',
    stagger: '0.02s',

    /* masonry */
    hiddenStyle: {
      opacity: 0
    },
    visibleStyle: {
      opacity: 1
    },
  });



  // var filteredElems = isotope_gallery.getFilteredItemElements();
  // var firstEightElems = filteredElems.slice(0,7);
  // getFurthestRightXCoord(firstEightElems);

  // window.onresize = function() {
  //   var filteredElems = isotope_gallery.getFilteredItemElements();
  //   var firstEightElems = filteredElems.slice(0,7);
  //   getFurthestRightXCoord(firstEightElems);
  // };




  var timeout = false, // holder for timeout id
      delay = 200 // delay after event is "complete" to run callback

  // window.resize callback function
  function getDimensions() {
    var filteredElems = isotope_gallery.getFilteredItemElements();
    var firstEightElems = filteredElems.slice(0,7);
    getFurthestRightXCoord(firstEightElems);
    console.log('get dimensions ran');
  }

  // window.resize event listener
  window.addEventListener('resize', function() {
      // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(getDimensions, delay);
  });

  getDimensions();




  function onArrange() {
    window.bLazy.revalidate();
  }
  // bind event listener
  isotope_gallery.on( 'arrangeComplete', onArrange );

  isotope_gallery.on( 'layoutComplete', function( laidOutItems ) {

  } );

  // show the images once aligned
  _portfolio_gallery.find("figure").css("visibility", "visible");

  // bind isotope filter button click
  $('.filter-btns').on('click', 'button', function() {
    var filterValue = $(this).attr('data-filter');

    //$grid.filter(filter: filterValue,);
    isotope_gallery.arrange({
      filter: filterValue,
    });

  });

  // PHOTOSWIPE GALLERY
  var pswpElement = $('.pswp')[0];
  var isotopeContainer = $('.isotope-grid');
  var realViewportWidth; // create variable that will store real size of viewport
  var useLargeImages = false;
  var firstResize = true;
  var imageSrcWillChange;

  isotopeContainer.on('click', 'a', function(e) {
    e.preventDefault();
    var $items = isotopeContainer.find('figure:not(.isotope-hidden)'),
      self = $(this),
      parent = self.closest('figure'),
      index = $items.index(parent);

    var items = isotopeContainer.find('figure:not(.isotope-hidden)').get().map(function(item) {
      var figure = $(item),
        link = figure.children('a'),
        caption = figure.find('figcaption'),
        size = link.data('size').split('x'),
        mobileImgSrc = link.data('mobile-link');
      desktopSize = link.data('size-desktop').split('x'),
      mobileSize = link.data('size-mobile').split('x'),
      data = {
        src: link.attr('href'),
        w: +size[0],
        h: +size[1],
        mobile_src: mobileImgSrc,
        mobile_w: +mobileSize[0],
        mobile_h: +mobileSize[1]
      };

      if (caption.length) {
        data.title = caption.html();
      }
      return data;
    });

    //var _social_media_html = '<ul class=\"social-icons\"><li><a href=\"https://www.pinterest.com/chantown/\" class=\"icon pinterest\" title=\"Pinterest\"><i class=\"icon-pinterest-gray\"></i></a></li><li><a href=\"https://www.facebook.com/sharer/sharer.php?u=" + getPageURLForShare() + "\" class=\"icon etsy\" title=\"Share on Facebook\"><i class=\"icon-facebook-gray\"></i></a></li><li><a href=\"https://twitter.com/hkchantown\" class=\"icon twitter\" title=\"Twitter\"><i class=\"icon-twitter-gray\"></i></a></li></ul>';
    var currentPage = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
    var getSharingHTML = function() {
      return '<share-button></share-button>';
    };

    var options = {
      index: index,
      zoomEl: false, // disable zoom in on images
      maxSpreadZoom: 1,
      getDoubleTapZoom: function(isMouseClick, item) {
        return item.initialZoomLevel;
      },
      pinchToClose: false,
      shareButtons: [
        {
          id: 'pinterest',
          label: '<i class="icon-pinterest"></i> Pin it',
          url: 'http://www.pinterest.com/pin/create/button/?url=' + window.location.protocol + "//" + window.location.host + "/newwebtest/ + '{{url}}&media=' + window.location.protocol + " //" + window.location.host + "/" + '{{image_url}}&description={{text}}'
        },
        {
          id: 'facebook',
          label: '<i class="icon-facebook"></i> Share on Facebook',
          url: 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.protocol + "//" + window.location.host + "/newwebtest/" + '{{url}}'
        },
        {
          id: 'twitter',
          label: '<i class="icon-twitter"></i> Tweet',
          url: 'https://twitter.com/intent/tweet?text=Chantown Creative: Portfolio&url=http://chantown.com/create.html'
        }

      ],
      getThumbBoundsFn: function(index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = self.find('img')[0], // find thumbnail
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width
        };
      },
      addCaptionHTMLFn: function(item, captionEl /*, isFake */ ) {
        if (!item.title) {
          captionEl.children[0].innerHTML = '';
          return false;
        }

        captionEl.children[0].innerHTML = item.title;
        //captionEl.children[0].innerHTML += _social_media_html;
        captionEl.children[0].innerHTML += getSharingHTML();
        //captionEl.children[0].innerHTML += photoswipeInstance.currItem;
        captionEl.children[0].style.width = (item.w * item.fitRatio) + 'px';
        return true;
      },
      getImageURLForShare: function(shareButtonData) {
        // `shareButtonData` - object from shareButtons array
        //
        // `pswp` is the gallery instance object,
        // you should define it by yourself
        //
        return photoswipeInstance.currItem.src || '';
      },
      getPageURLForShare: function(shareButtonData) {
        return photoswipeInstance.currItem.src || window.location.href;
      },
      getTextForShare: function(shareButtonData) {
        var currTitle = $($.parseHTML(photoswipeInstance.currItem.title) || '').text();
        return currTitle || '';
      },


      // Parse output of share links
      parseShareButtonOut: function(shareButtonData, shareButtonOut) {
        // `shareButtonData` - object from shareButtons array
        // `shareButtonOut` - raw string of share link element
        //console.log(shareButtonOut);
        return shareButtonOut;
      }

    };


    var photoswipeInstance = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);




    var shareBtnOptions = function(imageObj) {
      var artworkTitle = imageObj.title.split('|')[0];
      //console.log(artworkTitle);
      var imageURL = window.location.protocol + "//" + window.location.host + "/newwebtest/" + imageObj.src;
      return {
        networks: {
          googlePlus: {
            enabled: false // Enable Google+. [Default: true]
          },
          twitter: {
            enabled: true, // Enable Twitter. [Default: true]
            url: imageURL, // the url you'd like to share to Twitter [Default: config.url]
            description: artworkTitle + ' @hkchantown', // text to be shared alongside your link to Twitter [Default: config.description]
          },
          facebook: {
            enabled: true, // Enable Facebook. [Default: true]
            load_sdk: false, // Load the FB SDK. If false, it will default to Facebook's sharer.php implementation.
            // NOTE: This will disable the ability to dynamically set values and rely directly on applicable Open Graph tags.
            // [Default: true]
            url: imageURL, // the url you'd like to share to Facebook [Default: config.url]
            //  app_id:       // Facebook app id for tracking shares. if provided, will use the facebook API
            title: artworkTitle + ' by Vickie Chan. http://chantown.com', // title to be shared alongside your link to Facebook [Default: config.title]
            //caption:      // caption to be shared alongside your link to Facebook [Default: null]
            //description:  // text to be shared alongside your link to Facebook [Default: config.description]
            //
            image: imageURL // image to be shared to Facebook [Default: config.image]
          },
          pinterest: {
            enabled: true, // Enable Pinterest. [Default: true]
            url: 'http://chantown.com', // the url you'd like to share to Pinterest [Default: config.url]
            image: imageURL, // image to be shared to Pinterest [Default: config.image]
            description: artworkTitle + ' by Vickie Chan. http://chantown.com' // text to be shared alongside your link to Pinterest [Default: config.description]
          },
          reddit: {
            enabled: false // Enable Reddit. [Default: true]
          },
          linkedin: {
            enabled: false
          },
          whatsapp: {
            enabled: false
          },
          email: {
            enabled: false // Enable Email. [Default: true]
          //title:        // the subject of the email [Default: config.title]
          //description:  // The body of the email [Default: config.description]
          }
        },
        ui: {
          flyout: 'middle left', // change the flyout direction of the shares. chose from `top left`, `top center`, `top right`, `bottom left`, `bottom right`, `bottom center`, `middle left`, or `middle right` [Default: `top center`]
          button_font: false, // include the Lato font set from the Google Fonts API. [Default: `true`]
          buttonText: ' ', // change the text of the button, [Default: `Share`]
          icon_font: false // include the minified Entypo font set. [Default: `true`]
        },
      };
    };

    // hide sticky header navigation when photoswipe opens
    photoswipeInstance.listen('initialZoomIn', function() {
      //console.log("opening photoSwipe... fading out the nav");
      $("header").find(".scrollmagic-pin-spacer").fadeOut(250);
      $("#isotope-filters.pinned").fadeOut(250);
      $(".back-to-top").addClass("behind-lightbox");
    });

    // show sticky filters again once closing photoswipe
    photoswipeInstance.listen('initialZoomOutEnd', function() {
      //console.log("closing photoSwipe");
      $("header").find(".scrollmagic-pin-spacer").fadeIn(250);
      $("#isotope-filters.pinned").fadeIn(250);
      $(".back-to-top").removeClass("behind-lightbox");
    });

    // show sticky filters again once closing photoswipe
    photoswipeInstance.listen('close', function() {
      //console.log("closing photoSwipe");
      $("header").find(".scrollmagic-pin-spacer").fadeIn(250);
      $("#isotope-filters.pinned").fadeIn(250);
      $(".back-to-top").removeClass("behind-lightbox");
    });

    // beforeResize event fires each time size of gallery viewport updates
    photoswipeInstance.listen('beforeResize', function() {
      // gallery.viewportSize.x - width of PhotoSwipe viewport
      // gallery.viewportSize.y - height of PhotoSwipe viewport
      // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
      //                          1 (regular display), 2 (@2x, retina) ...


      // calculate real pixels when size changes
      realViewportWidth = photoswipeInstance.viewportSize.x * window.devicePixelRatio;

      // Code below is needed if you want image to switch dynamically on window.resize

      // Find out if current images need to be changed
      if (useLargeImages && realViewportWidth < 1000) {
        useLargeImages = false;
        imageSrcWillChange = true;
      } else if (!useLargeImages && realViewportWidth >= 1000) {
        useLargeImages = true;
        imageSrcWillChange = true;
      }

      // Invalidate items only when source is changed and when it's not the first update
      if (imageSrcWillChange && !firstResize) {
        // invalidateCurrItems sets a flag on slides that are in DOM,
        // which will force update of content (image) on window.resize.
        photoswipeInstance.invalidateCurrItems();
      // console.log('run resize photoswipe');
      }

      if (firstResize) {
        firstResize = false;
      }

      imageSrcWillChange = false;

    });

    // function that decides whether to load mobile or desktop version of the full size image when clicking on one of the thumbnails

    // the photoswipe gettingData event fires each time PhotoSwipe retrieves image source & size
    photoswipeInstance.listen('gettingData', function(index, item) {
      // Set image source & size based on real viewport width
      if (useLargeImages) {
        item.src = item.src;
        item.w = item.w;
        item.h = item.h;
      } else {
        item.src = item.mobile_src;
        item.w = item.mobile_w;
        item.h = item.mobile_h;
      }
      var _pinterestHTML = 'http://www.pinterest.com/pin/create/button/?url=' + window.location.href + '&media=' + item.src + '&description=Chantown Creative';
      //console.log("this bitch ran");
      $('#pswp-pinterest-btn').attr("href", _pinterestHTML);


      // It doesn't really matter what will you do here,
      // as long as item.src, item.w and item.h have valid values.
      //
      // Just avoid http requests in this listener, as it fires quite often

    });

    photoswipeInstance.listen('preventDragEvent', function(e, isDown, preventObj) {
      // e - original event
      // isDown - true = drag start, false = drag release

      // Line below will force e.preventDefault() on:
      // touchstart/mousedown/pointerdown events
      // as well as on:
      // touchend/mouseup/pointerup events
      preventObj.prevent = false;
    });

    // photoswipeInstance.listen('beforeChange', function() {
    //   //  var nextImgWidth = $('.pswp__img').innerWidth();
    //   //console.log( $('.pswp__img').innerWidth());
    //
    // });
    //
    photoswipeInstance.listen('imageLoadComplete', function(index, item) {
      // // index - index of a slide that was loaded
      // // item - slide object
      // // console.log($('.pswp__img').innerWidth());
      // var updateImgWidth = $('.pswp__img').innerWidth();
      // $('.pswp__caption__center').css("max-width", nextImgWidth);
      var shareButton = new ShareButton(shareBtnOptions(item));
    });
    //
    // photoswipeInstance.listen('resize', function() {
    //   //  var nextImgWidth = $('.pswp__img').innerWidth();
    //   //  $('.pswp__caption__center').css("max-width", nextImgWidth);
    // });

    photoswipeInstance.init();
  });
  //}); // imagesloaded





  // change is-checked class on buttons
  $('.filter-btns').each(function(i, buttonGroup) {
    var $buttonGroup = $(buttonGroup);
    $buttonGroup.on('click', 'button', function() {
      $buttonGroup.find('.is-checked').removeClass('is-checked');
      $(this).addClass('is-checked');
    });
  });

}; // runPhotoswipe function



// helper function to check if variable is greater than 8
// -- used in the template so as not to add lazyloading to the first
// -- eight images in the gallery to improve perceived performance
Handlebars.registerHelper('ifGreaterThanEight', function(index, options) {
  // handlebars index is zero based
  if(index > 7){
      return options.fn(this);
   } else {
      return options.inverse(this);
   }
});

Handlebars.registerHelper('getYearFromDate', function(theDate) {
  var year = theDate.slice(0,4);
  return year;
});

var buildGalleryHTML = function(json) {
  var myJson = json,
    _$gallery_container = $("#gallery_container"),
    unCompiledGalleryHtml = _$gallery_container.html(),
    galleryTemplate = Handlebars.compile(unCompiledGalleryHtml),
    result = galleryTemplate(myJson);
    _$gallery_container.html(result);
};


var _portfolio_gallery = $('#gallery_container');
if (_portfolio_gallery.length > 0) {

  ShareButton = require('../vendor/share-button.js');

  gallery_items = require('../json/portfolioImages');
  buildGalleryHTML(gallery_items);

  runPhotoswipe();

}


function getRightEdgeX(elem) {
  return elem.getBoundingClientRect().right;
}

function calcGalleryLeftMargin(imgX, containerX) {
  var result = (containerX - imgX) / 2 ;
  return Math.round(result);
}


function getFurthestRightXCoord(array) {
  // set counter to zero
  // for each item in the array
  // get it's clientBoundRect
  // get the right value
  // if that value is higher or equal to the last, set as new highest number
  var largestValue = 0; // start from zero
  for (var i = 0; i < array.length; i++) {
    var r = getRightEdgeX(array[i]);
    if (r > largestValue) {
      largestValue = r;
    }
  }

  console.log("largest right x val = ", largestValue);
  var galleryContainerRightX = document.getElementById('gallery_container').getBoundingClientRect().right;
  var galleryContainerLeftX = document.getElementById('gallery_container').getBoundingClientRect().left;

  console.log("the gallery container left x pos : ", galleryContainerLeftX);
  console.log("the gallery container right x pos : ", galleryContainerRightX);

console.log("the width should be resized to ", (largestValue - galleryContainerLeftX))
  // console.log('set the left margin to: ', calcGalleryLeftMargin(largestValue, galleryContainerRightX));
  var gallery_wrap = document.querySelector('.gallery-wrap');

  // gallery_wrap.style.marginLeft = calcGalleryLeftMargin(largestValue,galleryContainerRightX) + "px";
  gallery_wrap.style.width = (largestValue - galleryContainerLeftX) + "px";

}


function calcEdges() {
  var galleryItemsInDOM = document.querySelectorAll('figure.item');
  for (var i = 0; i < 10; i++) {
    console.log(galleryItemsInDOM[i].getBoundingClientRect());
  }
}
