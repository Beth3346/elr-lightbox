###############################################################################
# Displays a lightbox with an image slideshow built with images from a 
# thumbnail set
###############################################################################
"use strict"

( ($) ->
    class window.DrmLightbox
        constructor: (@images = $('ul.drm-lightbox-thumbnails'), @speed = 300) ->
            self = @
            self.body = $ 'body'
            thumbnails = self.createThumbnails()

            self.body.on 'click', 'div.drm-blackout img.img-visible', (e) ->
                e.stopPropagation()
            self.images.on 'click', 'a', -> self.createLightbox.call @, thumbnails
            self.body.on 'click', 'div.drm-blackout button.close', self.removeLightbox
            self.body.on 'click', 'div.drm-blackout ul.thumbnail-list a', self.changeImage
            self.body.on 'click', 'div.drm-blackout', self.removeLightbox

        createThumbnails: ->
            links = @images.find 'a'
            thumbnailList = []          
            thumbnails = ''

            # populate imgList array
            links.each ->
                thumbnailList.push $(@).attr 'href'

            # create html for thumbnail-list
            $.each thumbnailList, (index, value) ->
                thumbnails += "<li><a href='#{value}'><img src='#{value}' /></a></li>"

            thumbnails

        createLightbox: (thumbnails) ->
            img = $(@).attr 'href'
            # html for the actual lightbox
            
            imgVisible = $ '<img></img>',
                class: 'img-visible'
                src: img
                alt: 'thumbnail'

            close = $ '<button></button>',
                class: 'close'
                text: 'x'

            thumbnailHtml = $ '<ul></ul>',
                class: 'thumbnail-list'
                html: thumbnails

            lightboxHtml = $ '<div></div>',
                class: 'drm-blackout'

            lightboxHtml.hide().appendTo('body').fadeIn 300, ->
                close.appendTo lightboxHtml
                imgVisible.appendTo lightboxHtml
                thumbnailHtml.appendTo lightboxHtml

            return false

        changeImage: (e) ->
            img = $(@).attr 'href'
            oldImg = $ 'div.drm-blackout img.img-visible'
            oldImgSrc = oldImg.attr 'src'
            speed = @speed

            e.preventDefault()

            if oldImgSrc isnt img             
                oldImg.fadeOut speed, ->
                    $(@).attr('src', img).fadeIn speed

            e.stopPropagation() 

        removeLightbox: (e) ->
            $('div.drm-blackout').fadeOut @speed, ->
                $(@).remove()

            e.preventDefault()

    new DrmLightbox()

) jQuery