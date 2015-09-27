var $ = require('jquery');
var Isotope = require('isotope-layout');
//require('isotope-masonry');
var PhotoSwipe = require('photoswipe');
var Handlebars = require('handlebars');
var PhotoSwipeUI_Default = require('../vendor/photoswipe-ui-default.min');
//var _ = require('underscore');
//var imagesLoaded = require('imagesloaded');
responsivelyLazy = require('../vendor/responsively_lazy.min');




var gallery_items = {
  "images" : [
       {
          "title":"But Youll Cry",
          "year":2015,
          "category": "mixed-media painting",
          "srcImage":"/assets/img/gallery/2015/ButYoullCry-FULL",
          "imageExtension": ".jpg",
          "mobileImage":{
             "src":"/assets/img/gallery/2015/ButYoullCry-FULL_w800.jpg",
             "w":800,
             "h":1097
          },
          "desktopImage":{
             "src":"/assets/img/gallery/2015/ButYoullCry-FULL_w2000.jpg",
             "w":2000,
             "h":2743
          },
          "description":"Mixed Media painting on vinyl record",
          "alt":"An image of artwork by Chantown Creative"
       },
       {
          "title":"Other Peoples Heartache",
          "year":2015,
          "category": "mixed-media painting",
          "srcImage":"/assets/img/gallery/2015/OtherPeoplesHeartache-FULL",
          "imageExtension":".jpg",
          "mobileImage":{
             "src":"/assets/img/gallery/2015/OtherPeoplesHeartache-FULL_w800.jpg",
             "w":800,
             "h":1098
          },
          "desktopImage":{
             "src":"/assets/img/gallery/2015/OtherPeoplesHeartache-FULL_w2000.jpg",
             "w":2000,
             "h":2746
          },
          "description":"Mixed Media painting on vinyl record",
          "alt":"An image of artwork by Chantown Creative"
       },
       {
          "title":"Michaels Bear Trap",
          "year":2015,
          "category": "illustration",
          "srcImage":"/assets/img/gallery/2015/MichaelsBearTrap",
          "imageExtension": ".jpg",
          "mobileImage":{
             "src":"/assets/img/gallery/2015/MichaelsBearTrap_w800.jpg",
             "w":800,
             "h":530
          },
          "desktopImage":{
             "src":"/assets/img/gallery/2015/MichaelsBearTrap_w2000.jpg",
             "w":2000,
             "h":1327
          },
          "description":"Illustration peice, pen and coloured ink",
          "alt":"An image of artwork by Chantown Creative"
       },
       {
          "title":"Leicester Fox",
          "year":2014,
          "category":"illustration",
          "srcImage":"/assets/img/gallery/2014/LeicesterFoxCLEAN",
          "imageExtension": ".jpg",
          "mobileImage":{
             "src":"/assets/img/gallery/2014/LeicesterFoxCLEAN_w800.jpg",
             "w":800,
             "h":556
          },
          "desktopImage":{
             "src":"/assets/img/gallery/2014/LeicesterFoxCLEAN_w2000.jpg",
             "w":2000,
             "h":1391
          },
          "description":"Mixed Media paint on vinyl record",
          "alt":"Image of artwork by Chantown Creative"
       }
     ]
};





// var galleryHtmlTemplate =
//
// "<figure class=\"item {{category}}\" itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\">" +
//
//   "<a href=\"{{desktopImage.src}}\" data-mobile-link=\"{{mobileImage.src}}\" itemprop=\"contentUrl\" data-size=\"{{desktopImage.w}}x{{desktopImage.h}}\" data-size-desktop=\"{{desktopImage.w}}x{{desktopImage.h}}\"
//   data-size-mobile=\"{{mobileImage.w}}x{{mobileImage.h}}\">" +
//
//       "<img class=\"responsively-lazy\" src=\"{{desktopImage.src}}\"
//        srcset=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\"
//       data-srcset=\"
//         {{srcImage}}_w400{{imageExtension}} 400w,
//         {{srcImage}}_w600{{imageExtension}} 600w,
//         {{srcImage}}_w800{{imageExtension}} 800w\"
//       alt=\"An image of a peice of art by Chantown Creative\"
//       title=\"{{title}} | {{year}}\" itemprop=\"thumbnail\"  />" +
//
//  "</a>" +
//  "<figcaption itemprop=\"caption description\">
//     {{title}} | {{year}} </br>
//     {{description}}
//     <span itemprop=\"copyrightHolder\"> &copy; Chantown Creative</span>
//   </figcaption>
// </figure>";










var buildGalleryHTML = function(json) {
  var myJson = json,
      _$gallery_container = $("#gallery_container"),
      unCompiledGalleryHtml = _$gallery_container.html(),
      galleryTemplate = Handlebars.compile(unCompiledGalleryHtml),
      result = galleryTemplate(myJson);

      _$gallery_container.html(result);
}






var runPhotoswipe = function () {
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
        // imagesLoaded('.masonry-grid', function() {
        //  // layout Isotope after each image loads
        //  $image_gallery.layout();
        //  $image_gallery.arrange();
        //  //console.log("images loaded");
        // });
        // $image_gallery.arrange();

        //console.log($image_gallery);

        // console.log(Chantown);
        // update lazy load when isotope has re-arranged the images
        $image_gallery.on('arrangeComplete',function() {

             //console.log("image filtering updated");
            //Chantown.responsiveLazy.run();
        });

        // align the isotope layout every 500ms
        window.setInterval(function(){
          $image_gallery.arrange({
          })
        }, 500);

        // show the images once aligned
        _portfolio_gallery.find("figure").css("visibility","visible");

        // bind isotope filter button click
        $('.filter-btns').on( 'click', 'button', function() {
          var filterValue = $( this ).attr('data-filter');

          //$grid.filter(filter: filterValue,);
          $image_gallery.arrange({
            filter: filterValue,
          })
          //responsivelyLazy.run()
        });

        // PHOTOSWIPE GALLERY
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

}; // runPhotoswipe function



var _portfolio_gallery = $('#gallery_container');
if ( _portfolio_gallery.length > 0 ) {

  Handlebars.registerHelper('escape', function(variable) {
    return variable.replace(/(['"])/g, '\\$1');
  });

  buildGalleryHTML(gallery_items);
  runPhotoswipe();

  }
