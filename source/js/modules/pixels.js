'use strict'
var _ = require('underscore');
var $ = require('jquery');

exports.DeadPixels = function (){

};

_.extend(exports.DeadPixels.prototype, {
   count:30,
  //  sat:83,
  //  value:75,
   colors: ['#FF5000', '#0078AE', '#F65097'],
   delay:5000,
   initialize:function (){
       _.bindAll(this,'random_color','reposition');

       this.$el = $('body');
       this.pixels = [];

       for(var i=0; i < this.count; i++){
           var pixel = $("<div class='pixel'>");
           this.pixels.push(pixel);
           this.$el.prepend(pixel);

           var dim = _.random(1,3);
           pixel.css({
               'left':_.random(100)+'%',
               'top':_.random(100)+'%',
               'width':dim,
               'height':dim,
               'background-color': this.random_color(),
               'z-index': 0,
               'opacity': .9
           });
           pixel.css('transform','rotate('+_.random(360)+'deg)');
           pixel.addClass('on');
           //_.delay(this.reposition,_.random(this.delay*0.25,this.delay*1.25),i);
       }

       // extend array class to allow calls to randomElement on any array
       //http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
      //  Array.prototype.randomElement = function () {
      //    return this[Math.floor(Math.random() * this.length)]
      //  }
   },
   // returns a random color from an array of possible colour values
   random_color: function (){
       return this.colors[Math.floor(Math.random() * this.colors.length)]
      //  return 'hsl('+_.random(360)+','+this.sat+'%,'+this.value+'%)';
   },

  // creates a random colour based on saturation and value settings
  //  random_color: function (){
  //      return 'hsl('+_.random(360)+','+this.sat+'%,'+this.value+'%)';
  //  },

   reposition:function (i){
       this.pixels[i].removeClass('on');
       _.delay(_.bind(function (){
           this.pixels[i].css({
               left:_.random(100)+'%',
               top:_.random(100)+'%',
               'background-color': this.random_color()
           });

           this.pixels[i].addClass('on');
           _.delay(this.reposition,_.random(this.delay*0.25,this.delay*1.25),i);
       },this),3500)
   }


});
