var pmf = window.pmf = {};

window.requestAnimFrame = function(){
    return (
        window.webkitRequestAnimationFrame ||
        window.requestAnimationFrame       ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback){
            return window.setTimeout(callback, 1000 / 60);
        }
    );
}();

window.closeAnimFrame = function (){
    return   (
        window.webkitCancelAnimationFrame||
        window.cancelAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        /* <= ie9 no-op */
        function( callback ){ clearTimeout(callback); }
    );
}();

pmf.Menu = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'toggle');

        var self = this;
        var _body = $('body');

        $('.menu-open').click(function() {
            self.toggle();
        });

        $(window).on('scroll', function(e) {
            if(_body.hasClass('menu')) {
                _body.removeClass('menu');
            }
        });
    },

    toggle: function() {
        $('body').toggleClass('menu');
    }
});

pmf.Bios = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'open_bio', 'remove_bio', 'prep_bio',
                  'collect_data', 'animate_ellipsis',
                  'one_moment_please');
        var self = this;
        this.$el.find('.artist').on('click', function() {
            self.prep_bio($(this).attr('data-pk'));
        });
    },

    animate_ellipsis: function() {
        $('#one-moment-please').find('span:nth-child('+this.counter+')').addClass('show');
        this.counter++;
        if(this.counter > 4) {
            $('#one-moment-please span').removeClass('show');
            this.counter = 0;
        }

    },

    one_moment_please: function() {
        $('#shadowbox').addClass('wait');
        var self = this;
        this.counter = 0;
        this.ellipsis = window.setInterval(self.animate_ellipsis, 500);
    },

    prep_bio: function(pk) {
        var shadowbox = _.template($('#shadowbox-template').html());
        $('body').append(shadowbox);
        var self = this;
        window.setTimeout(self.one_moment_please, 1000);


        this.data = $('#artist-'+pk).data();
        var variables = this.collect_data();

        var self = this;
        var img = new Image();
        img.onload = function() {
            self.open_bio(variables);};
        img.src = self.data.img;
    },

    collect_data: function() {
        var width = $(window).width();
        var height = Math.round($(window).height());
        var pic_h = Math.min(Math.round(height * .37), 320);
        var pic_w = pic_h * 1.5;

        var img = this.data.img;
        if(pmf.mobile)
            img = this.data.lineup_img;

        return {name: this.data.name,
                day: this.data.day,
                bio: this.data.bio,
                img: img,
                website: this.data.website,
                twitter: this.data.tw,
                p4k: this.data.p4k,
                start: this.data.start,
                stage: this.data.stage,
                photo_credit: this.data.credit,
                marg_left: pic_w * -.5,
                pic_w: pic_w};
    },

    open_bio: function(variables) {
        var template_id = '#'+this.data.template;
        if(pmf.mobile)
            template_id = '#lineup-mobile-template';
        var template = _.template($(template_id).html(), variables);
        $('body').append(template);

        var adj = $('#artist-titlecard').outerHeight();
        $('#bio-container').css('height', $('.biobox').height()-adj);

        /* fancy geometry to correctly position the
           diamond (rotated square) along the edge of the
           artist titlecard. edge moves the diamond down to
           the titlecard, offset accounts for the sliver of
           extra height the element acquires on rotation that
           css doesn't recognize, and radius is merely half
           the height of the diamond
        */
        /*
        var edge = $('#artist-titlecard').offset().top;
        var diamond_h = $('#biobox .diamond').height();
        var radius = Math.sqrt(2 * Math.pow(diamond_h,2))/2;
        var offset = radius - diamond_h/2;
        var total_offset = edge + offset - radius;
        total_offset = edge - $('#artist-titlecard').outerHeight();
        */

        $('#shadowbox').addClass('reveal');
        $('.biobox').addClass('reveal');
        window.clearInterval(this.ellipsis);

        var self = this;
        $('.bio-close').on('click', self.remove_bio);

        var url = document.URL.indexOf('lineup');
        var loc = (url > 0) ? 'lineup click' : 'homepage click';

        pmf.tracker.track_event('lineup', loc,
                                self.data.name,
                                Number(self.data.tier));
    },

    remove_bio: function() {
        $('.bio-remove').remove();
    }
});

pmf.Tracker = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this, 'track_event');

        var self = this;
        $('.tracker').click(function() {
            var label = $(this).attr('data-label');
            var cat = $(this).attr('data-cat');
            self.track_event(cat, 'click', label);
        });
    },

    track_event: function(cat, event, label, value) {
        _gaq.push(['_trackEvent', cat, event, label, value]);
    }
});

pmf.Router = Backbone.Router.extend({
    routes: {
        ':section': 'find_section'
    },

    find_section: function(section) {
        var off = $('#menu').height();
        $('body, html').stop().animate({
            scrollTop: $('#'+section+'-router').offset().top - off
        }, 1000);
    }
});

pmf.DeadPixels = Backbone.View.extend({
    count:30,
    sat:83,
    value:75,
    delay:6000,
    initialize:function (){
        _.bindAll(this,'new_color','reposition');

        this.$el = $('#content');
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
        },this),1500)
    }
})

_.extend(pmf, {
    init: function() {
        this.tracker();
        this.footer();
        this.menu();
        this.router();
        this.bios();
        this.check_mobile();

        var window_resize = false;
        $(window).on('resize', function() {
            if(!window_resize) {
                window_resize = true;
                pmf.tracker.track_event('global', 'resize',
                                        'window resized');
            }
        });

        var window_width = $(window).width();
        pmf.tracker.track_event('global', 'load',
                                'window load size: '+window_width,
                                Number(window_width));
    },

    footer: function() {
        $('.footer-button').on('click', function() {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
        });
    },

    tracker: function() {
        pmf.tracker = new pmf.Tracker();
    },

    menu: function() {
        pmf.menu = new pmf.Menu({el: $('#nav')});
    },

    router: function() {
        pmf.router = new pmf.Router();
        Backbone.history.start();
    },

    bios: function() {
        pmf.lineup = new pmf.Bios({el: '#lineup'});
    },

    check_mobile: function() {
        pmf.mobile = ($('#mobile-test').css('display')=='none') ? true : false;
    }
});

$(function() {
    pmf.init();

    if($('#animate-bg').length > 0) {
        if(!pmf.mobile)
            pmf.background();

        new pmf.DeadPixels();
    }
});
