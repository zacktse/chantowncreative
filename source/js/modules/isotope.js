var $ = require('jquery');
var Isotope = require('isotope-layout');
require('isotope-packery');
var _ = require('underscore');
var imagesLoaded = require('imagesloaded');


// isotope / masonry-grid

var $grid = new Isotope ('.masonry-grid', {
  layoutMode: 'packery',
  packery: {
    columnWidth: '.grid-sizer',
    gutter: 20
  },
  itemSelector: '.grid-item',
   percentPosition: true,
  sortBy: 'random'
  });

// bind isotope filter button click
$('.filter-btns').on( 'click', 'button', function() {
  var filterValue = $( this ).attr('data-filter');

  //$grid.filter(filter: filterValue,);
  $grid.arrange({
    filter: filterValue,
  })
  // re-apply filtering, sorting, and layout
  $grid.arrange();


});


// change is-checked class on buttons
$('.filter-btns').each( function( i, buttonGroup ) {
  var $buttonGroup = $( buttonGroup );
  $buttonGroup.on( 'click', 'button', function() {
    $buttonGroup.find('.is-checked').removeClass('is-checked');
    $( this ).addClass('is-checked');
  });
});
