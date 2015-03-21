(function($) {
    window.drmLightbox = function(spec) {
        var self = {};

        self.images = spec.images || $('ul.drm-lightbox-thumbnails');
        self.speed = spec.speed || 300;

        self.createThumbnails = function(list) {
            var links = list.find('a'),
                thumbnailList = [],
                thumbnails = '';

            links.each(function() {
                thumbnailList.push($(this).attr('href'));
            });

            $.each(thumbnailList, function(k, v) {
                thumbnails += '<li><a href=' + v + '><img src=' + v + ' /></a></li>';
            });

            return thumbnails;
        };

        self.createLightbox = function(thumbnails) {
            var img = $(this).attr('href'),
                imgVisible = $('<img></img>', {
                    'class': 'img-visible',
                    src: img,
                    alt: 'thumbnail'
                }),
                close = $('<button></button>', {
                    'class': 'close',
                    text: 'x'
                }),
                thumbnailHtml = $('<ul></ul>', {
                    'class': 'thumbnail-list',
                    html: thumbnails
                }),
                nav = $('<div></div>', {
                    'class': 'lightbox-nav',
                    html: '<button class="prev" data-dir="prev"><i class="fa fa-caret-left"></i></button><button class="next" data-dir="next"><i class="fa fa-caret-right"></i></button>'
                }),
                lightboxHtml = $('<div></div>', {
                    'class': 'drm-blackout'
                });

            lightboxHtml.hide().appendTo('body').fadeIn(300, function() {
                close.appendTo(lightboxHtml);
                imgVisible.appendTo(lightboxHtml);
                nav.appendTo(lightboxHtml);
                thumbnailHtml.appendTo(lightboxHtml);
            });
        };

        self.advanceImage = function(direction) {
            var list = $('.thumbnail-list'),
                currentImg = $('div.drm-blackout img.img-visible'),
                currentImgSrc = currentImg.attr('src'),
                currentThumb = list.find('img[src$="' + currentImgSrc + '"]').closest('li').index(),
                len = list.find('li').length - 1,
                nextImg,
                nextImgIndex;

            if ( direction === 'prev' ) {
                nextImgIndex = (currentThumb === 0) ? len : currentThumb - 1;
            } else {
                nextImgIndex = (currentThumb === len) ? 0 : currentThumb + 1;
            }

            nextImg = list.find('li').eq(nextImgIndex).find('img').attr('src');
            currentImg.fadeOut(self.speed, function() {
                $(this).attr('src', nextImg).fadeIn(self.speed);
            });
        };

        self.changeImage = function() {
            var img = $(this).attr('href'),
                oldImg = $('div.drm-blackout img.img-visible'),
                oldImgSrc = oldImg.attr('src');

            if (oldImgSrc !== img) {
                oldImg.fadeOut(self.speed, function() {
                    $(this).attr('src', img).fadeIn(self.speed);
                });
            }
        };

        self.removeLightbox = function() {
            $('div.drm-blackout').fadeOut(self.speed, function() {
                $(this).remove();
            });
        };

        if ( self.images.length > 0 ) {
            var thumbnails = self.createThumbnails(self.images);
                body = $('body');

            body.on('click', 'div.drm-backout img.img-visible', function(e) {
                e.stopPropagation();
            });

            self.images.on('click', 'a', function(e) {
                e.preventDefault();
                self.createLightbox.call(this, thumbnails);
            });

            body.on('click', 'div.drm-blackout button.close', self.removeLightbox);
            body.on('click', 'div.drm-blackout', self.removeLightbox);
            body.on('click', 'div.drm-blackout ul.thumbnail-list a', function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.changeImage.call(this);
            });

            body.on('click', 'div.drm-blackout .lightbox-nav button', function(e) {
                var direction = $(this).data('dir');

                e.preventDefault();
                e.stopPropagation();
                self.advanceImage(direction);
            });

            body.on('keydown', function(e) {
                if (e.which === 37) {   
                    self.advanceImage('prev');
                } else if (e.which === 39) {
                    self.advanceImage('next');
                } 
            });
        }

        return self;
    };
})(jQuery);