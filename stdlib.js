(function($) {

    PB.stdlib = {
        /////////////////////////////////////////////////////////////////////////////////////////
        templates: function() {
            if (!this._templates) {
                var videoTemplate = $.createTemplate(PB.templates.video);
                var pictureTemplate = $.createTemplate(PB.templates.picture);
                var commentTemplate = $.createTemplate(PB.templates.comment);
                var paginatorTemplate = $.createTemplate(PB.templates.paginator);
                var blogpostTemplate = $.createTemplate(PB.templates.blogpost);
                var mediumTemplate = $.createTemplate(PB.templates.medium, {
                    video: videoTemplate, 
                    picture: pictureTemplate
                });
                var activityTemplate = $.createTemplate(PB.templates.activity, {
                    medium: mediumTemplate, 
                    comment: commentTemplate,
                    paginator: paginatorTemplate
                });
                this._templates = {
                    video: videoTemplate,
                    picture: pictureTemplate,
                    comment: commentTemplate,
                    medium: mediumTemplate,
                    paginator: paginatorTemplate,
                    activity: activityTemplate,
                    blogpost: blogpostTemplate
                };
            }
            return this._templates;
        },
        /////////////////////////////////////////////////////////////////////////////////////////
        activateInlineVideos: function(el) {
            var videos = el.find('.video');
            videos.each(function() {
                var container = $(this);
                var button = $('<div style="left: 48px; top: 33px; width:29px; height:29px;" class="playb"></div>').appendTo(container);
                var a = container.children('a');
                a.add(button);
                var movie = a.attr('play');
                var type = a.attr('type');
                a.fancybox({
                    frameWidth: 425, 
                    frameHeight: 350,
                    overlayShow: true,
                    overlayOpacity: 0.1,
                    random: false,
                    content: '<div class="video-player"><object width="425" height="350"><param name="movie" value="'+movie+'&autoplay=1"></param><param name="wmode" value="transparent"></param><embed src="'+movie+'&autoplay=1" type="'+type+'" wmode="transparent" width="425" height="350"></embed></object></div>',
                    closeCallback: function() {
                        $('.video-player').hide().empty();
                        el.find('.playing').removeClass('playing');
                    },
                    startCallback: function() {
                        if (!container.hasClass('playing')) {
                            el.find('.playing').removeClass('playing');
                        }
                        container.toggleClass('playing');
                    }
                });
                button.bind("click", function(e) {
                    a.trigger('click');
                    return false;
                });
            });
        },
        /////////////////////////////////////////////////////////////////////////////////////////
        applyFancyBoxes: function(el) {
            el.find("a.picture-link").fancybox({
                overlayShow: true,
                overlayOpacity: 0.1,
                random: false
            });
        },
        /////////////////////////////////////////////////////////////////////////////////////////
        applyDynamicBehavior: function(el) {
            this.applyFancyBoxes(el);
            this.activateInlineVideos(el);
        }
    };

})(jQuery);