var $ = require('jquery');
var Isotope = require('isotope-layout');
//require('isotope-masonry');
var PhotoSwipe = require('photoswipe');
var PhotoSwipeUI_Default = require('../vendor/photoswipe-ui-default.min');
//var _ = require('underscore');
var imagesLoaded = require('imagesloaded');

var _portfolio_gallery = $('#gallery_container');
if ( _portfolio_gallery.length > 0 ) {

        var $window = $(window);
        var $images = $('#gallery_container figure img');

        var itemReveal = Isotope.Item.prototype.reveal;
        Isotope.Item.prototype.reveal = function() {
          itemReveal.apply( this, arguments );
          $( this.element ).removeClass('isotope-hidden');
        };

        var itemHide = Isotope.Item.prototype.hide;
        Isotope.Item.prototype.hide = function() {
          itemHide.apply( this, arguments );
          $( this.element ).addClass('isotope-hidden');
        };


        //imagesLoaded( _portfolio_gallery, function() {

          var $image_gallery = new Isotope ('.masonry-grid', {
            masonry: {
              columnWidth: '.grid-sizer',
              //isFitWidth: true,
              gutter: 10
            }, /* masonry */
            hiddenStyle: {
              opacity: 0
            },
            visibleStyle: {
              opacity: 1
            },
            transitionDuration: '.3s',
            sortBy: 'random'
            });
          // once images have loaded - run the layout script to put all images in masonry layout
          imagesLoaded('.masonry-grid', function() {
           // layout Isotope after each image loads
           $image_gallery.layout();
           $image_gallery.arrange();
           //console.log("images loaded");
          });
          $image_gallery.arrange();

          //console.log($image_gallery);


          // update lazy load when isotope has re-arranged the images
          $image_gallery.on('arrangeComplete',function() {
               // Trigger Unveil lazy load on items after filtering
               //$('.element img').trigger('unveil');
               //console.log("image filtering updated");
          });


          // show the images once aligned
          _portfolio_gallery.find("figure").css("visibility","visible");

          // bind isotope filter button click
          $('.filter-btns').on( 'click', 'button', function() {
            var filterValue = $( this ).attr('data-filter');

            //$grid.filter(filter: filterValue,);
            $image_gallery.arrange({
              filter: filterValue,
            })
          });


          // $('.isotope').isotope({
          //   itemSelector: '.item',
          //   masonry: {
          //     columnWidth: '.grid-sizer',
          //   	isFitWidth: true,
          //     gutter: 10
          //   }, /* masonry */
          //   hiddenStyle: {
          //     opacity: 0
          //   },
          //   visibleStyle: {
          //     opacity: 1
          //   },
          //   transitionDuration: '.3s'
          // });
          //
          //
          //
          // // filter functions
          // $('.filter-btns').find("button.filter").click(function(){
          //   console.log("filter clicked");
          //  var selector = $(this).attr('data-filter');
          //  $('.isotope').isotope({ filter: selector });
          //  return false;
          // });


           var pswpElement = $('.pswp')[0];
           var isotopeContainer = $('.masonry-grid');

           isotopeContainer.on('click', 'a', function(e){
             e.preventDefault();
             var $items = isotopeContainer.find('figure:not(.isotope-hidden)'),
                 self = $(this),
                 parent = self.closest('figure'),
                 index = $items.index(parent);

             var items = isotopeContainer.find('figure:not(.isotope-hidden)').get().map(function(item){
               var figure = $(item),
                   link = figure.children('a'),
                   caption = figure.find('figcaption'),
                   size = link.data('size').split('x'),
                   data = {
                     src: link.attr('href'),
                     w: +size[0],
                     h: +size[1]
                   };

               if (caption.length){
                 data.title = caption.html();
               }
               return data;
             });

             var options = {
               index: index,
               getThumbBoundsFn: function(index) {
                         // See Options -> getThumbBoundsFn section of documentation for more info
                         var thumbnail = self.find('img')[0], // find thumbnail
                             pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                             rect = thumbnail.getBoundingClientRect();

                         return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                     }
             };

             var photoswipeInstance = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
             photoswipeInstance.listen('destroy', function() {
               // trigger resize on isotope
             });


             // hide sticky header navigation when photoswipe opens
             photoswipeInstance.listen('initialZoomIn', function() {
               //console.log("opening photoSwipe... fading out the nav");
               $("header").find(".scrollmagic-pin-spacer").fadeOut(250);
               $(".back-to-top").addClass("behind-lightbox");
             });

             // show sticky nav again once closing photoswipe
             photoswipeInstance.listen('close', function() {
               //console.log("closing photoSwipe");
               $("header").find(".scrollmagic-pin-spacer").fadeIn(250);
               $(".back-to-top").removeClass("behind-lightbox");
             });
            photoswipeInstance.init();
           });
         //}); // imagesloaded





        // change is-checked class on buttons
        $('.filter-btns').each( function( i, buttonGroup ) {
          var $buttonGroup = $( buttonGroup );
          $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });
  }
