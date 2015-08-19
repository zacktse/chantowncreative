var _ = require('underscore');
var $ = require('jquery');

// exports.deadPixels = function(){
//     var config = {
//       count:50,
//       sat:83,
//       value:75,
//       delay:6000
//     },
//     $el = $('#js-content'),
//     pixels = [],
//
//     new_color = function (){
//         return 'hsl('+_.random(360)+','+config.sat+'%,'+config.value+'%)';
//     },
//     reposition = function (i) {
//         pixels[i].removeClass('on');
//         _.delay(function (){
//               pixels[i].css({
//                 left:_.random(100)+'%',
//                 top:_.random(100)+'%',
//                 'background-color': new_color()
//             });
//             pixels[i].addClass('on');
//             _.delay(reposition(),_.random(config.delay*0.25,config.delay*1.25),i);
//         },1500);
//     };
//     initialize = function (){
//         _.bindAll(this,'new_color','reposition');
//
//
//
//         for(i=0; i < config.count; i++){
//             var pixel = $("<div class='pixel'>");
//             pixels.push(pixel);
//             $el.append(pixel);
//
//             var dim = _.random(1,3);
//             pixel.css({
//                 left:_.random(100)+'%',
//                 top:_.random(100)+'%',
//                 width:dim,
//                 height:dim,
//                 'background-color': new_color()
//                 //'background-color': 'black'
//             });
//             pixel.css('transform','rotate('+_.random(360)+'deg)');
//             pixel.addClass('on');
//              _.delay(reposition(i),_.random(config.delay*0.25,config.delay*1.25),i);
//         }
//
//
//
//
//     };
//
//
//     initialize();
// };
//



exports.DeadPixels = function (){}

_.extend(exports.DeadPixels.prototype, {
   count:30,
   sat:83,
   value:75,
   delay:5000,
   initialize:function (){
       _.bindAll(this,'new_color','reposition');

       this.$el = $('#js-content');
       this.pixels = [];

       for(i=0; i < this.count; i++){
           var pixel = $("<div class='pixel'>");
           this.pixels.push(pixel);
           this.$el.append(pixel);

           var dim = _.random(1,3);
           pixel.css({
               left:_.random(100)+'%',
               top:_.random(100)+'%',
               width:dim,
               height:dim,
               'background-color': this.new_color()
           });
           pixel.css('transform','rotate('+_.random(360)+'deg)');
           pixel.addClass('on');
           _.delay(this.reposition,_.random(this.delay*0.25,this.delay*1.25),i);
       }
   },
   new_color: function (){
       return 'hsl('+_.random(360)+','+this.sat+'%,'+this.value+'%)';
   },

   reposition:function (i){
       this.pixels[i].removeClass('on');
       _.delay(_.bind(function (){
           this.pixels[i].css({
               left:_.random(100)+'%',
               top:_.random(100)+'%',
               'background-color': this.new_color()
           });

           this.pixels[i].addClass('on');
           _.delay(this.reposition,_.random(this.delay*0.25,this.delay*1.25),i);
       },this),2500)
   }
});
