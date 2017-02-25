import elrUI from 'elr-ui'
import $ from 'jquery'

let ui = elrUI()

const elrLightbox = function({
    $images = $('ul.elr-lightbox-thumbnails'),
    speed = 300
} = {}) {
    const self = {
        getThumbnailSrc($list) {
            return $.map($list.find('a'), (item) => $(item).attr('href'))
        },
        createThumbnails(thumbnailList) {
            return thumbnailList.map((src) => `<li><a href=${src}><img src=${src}></a></li>`)
        },
        createVisibleImg(img) {
            return ui.createElement('img', {
                class: 'img-visible',
                src: img,
                alt: 'thumbnail'
            })
        },
        createCloseButton() {
            return ui.createElement('button', {
                class: 'close',
                text: 'x'
            })
        },
        createThumbnailList(thumbnails) {
            return ui.createElement('ul', {
                class: 'thumbnail-list',
                html: thumbnails
            })
        },
        createNav() {
            return ui.createElement('div', {
                class: 'lightbox-nav',
                html: `<button class="prev" data-dir="prev"><i class="fa fa-caret-left"></i></button><button class="next" data-dir="next"><i class="fa fa-caret-right"></i></button>`
            })
        },
        createLightbox() {
            return ui.createElement('div', {
                class: 'elr-blackout'
            })
        },
        addLightbox(thumbnails, speed) {
            const $lightbox = self.createLightbox()
            const img = $(this).attr('href')

            $lightbox.hide().appendTo('body').fadeIn(speed, function() {
                self.createCloseButton().appendTo($lightbox)
                self.createVisibleImg(img).appendTo($lightbox)
                self.createNav().appendTo($lightbox)
                self.createThumbnailList(thumbnails).appendTo($lightbox)
            })
        },
        getNextImageIndex(direction, $list, $currentImg) {
            const currentImgSrc = $currentImg.attr('src')
            const $currentThumb = $list.find(`img[src$="${currentImgSrc}"]`).closest('li').index()
            const len = $list.find('li').length - 1

            if (direction === 'prev') {
                return ($currentThumb === 0) ? len : $currentThumb - 1
            }

            return ($currentThumb === len) ? 0 : $currentThumb + 1
        },
        getNextImage(direction) {
            const $list = $('.thumbnail-list')
            const $currentImg = $('div.elr-blackout img.img-visible')

            return $list.find('li').eq(this.getNextImageIndex(direction, $list, $currentImg)).find('img').attr('src')
        },
        advanceImage(direction, speed) {
            const $nextImg = this.getNextImage(direction)
            const $currentImg = $('div.elr-blackout img.img-visible')

            $currentImg.fadeOut(speed, function() {
                $(this).attr('src', $nextImg).fadeIn(speed)
            })
        },
        swapImage(speed) {
            const img = $(this).attr('href')
            const $oldImg = $('div.elr-blackout img.img-visible')
            const oldImgSrc = $oldImg.attr('src')

            if (oldImgSrc !== img) {
                $oldImg.fadeOut(speed, function() {
                    $(this).attr('src', img).fadeIn(speed)
                })
            }
        },
        removeLightbox(speed) {
            $('div.elr-blackout').fadeOut(speed, function() {
                $(this).remove()
            })
        }
    }

    if ($images.length) {
        const $body = $('body')

        $images.on('click', 'a', function(e) {
            e.preventDefault()
            const thumbnailList = self.getThumbnailSrc($images)
            self.addLightbox.call(this, self.createThumbnails(thumbnailList), speed)
        })

        $body.on('click', 'div.elr-blackout button.close', self.removeLightbox)
        $body.on('click', 'div.elr-blackout', function(e) {
            e.stopPropagation()
            self.removeLightbox(speed)
        })

        $body.on('click', 'div.elr-blackout ul.thumbnail-list a', function(e) {
            e.preventDefault()
            e.stopPropagation()
            self.swapImage.call(this, speed)
        })

        ui.killEvent($body, 'click', 'div.elr-blackout .img-visible')
        ui.killEvent($body, 'click', 'div.elr-blackout .lightbox-nav button')

        $body.on('click', 'div.elr-blackout .lightbox-nav button', function(e) {
            e.preventDefault()
            e.stopPropagation()

            self.advanceImage($(this).data('dir'), speed)
        })

        // page image slideshow when user hits left/right arrow keys
        $body.on('keydown', function(e) {
            if (e.which === 37) {
                self.advanceImage('prev', speed)
            } else if (e.which === 39) {
                self.advanceImage('next', speed)
            }
        })

        // close lightbox when user hits the escape key
        $body.on('keydown', function(e) {
            if (e.which === 27) {
                self.removeLightbox()
            }
        })
    }

    return self
}

export default elrLightbox