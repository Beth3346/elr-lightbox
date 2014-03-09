###############################################################################
# Displays a lightbox with an image slideshow built with images from a 
# thumbnail set
###############################################################################

( ($) ->

	drmLightbox = {
		images: $ '.drm-lightbox-thumbnails'
		body: $ 'body'

		config: {
			speed: 300
		}

		init: (config) ->
			$.extend @.config, config

			@.body.on 'click', '.drm-blackout .img-visible', (e) ->
			    e.stopPropagation()

			@.images.on 'click', 'a', @.addLightbox	

			@.body.on 'click', '.drm-blackout .close', @.removeLightbox

			@.body.on 'click', '.drm-blackout .thumbnail-list a', @.changeImage			

			@.body.on 'click', '.drm-blackout', @.removeLightbox

		createThumbnails: ->
			links = @.images.find 'a'
			thumbnailList = []			
			thumbnails = ''

			# populate imgList array
			links.each ->
				thumbnailList.push $(@).attr 'href'

			# create html for thumbnail-list
			$.each thumbnailList, (index, value) ->
				thumbnails += "<li><a href='#{value}'><img src='#{value}' /></a><li>"

			return thumbnails

		createLightbox: ->
			img = $(@).attr 'href'
			thumbnails = drmLightbox.createThumbnails()

			# html for the actual lightbox
			lightboxHtml = "<div class='drm-blackout'><button class='close'>x</button><img src='#{img}' alt='thumbnail' class='img-visible'><ul class='thumbnail-list'>#{thumbnails}</div>"

			return lightboxHtml

		addLightbox: (e) ->
			lightbox = $ '.drm-blackout'
			lightboxHtml = drmLightbox.createLightbox.call $ @

			# if the lightbox isn't already showing, append it to body and fade it into view
			if lightbox.length == 0
				$(lightboxHtml).hide().appendTo(drmLightbox.body).fadeIn drmLightbox.config.speed

			e.preventDefault()

		changeImage: (e) ->
			img = $(@).attr 'href'
			oldImg = $ '.drm-blackout .img-visible'
			oldImgSrc = oldImg.attr 'src'
			speed = drmLightbox.config.speed

			e.preventDefault()

			if oldImgSrc != img				
				oldImg.fadeOut speed, ->
					$(@).attr('src', img).fadeIn speed

			e.stopPropagation()	

		removeLightbox: ->
			$('.drm-blackout').fadeOut drmLightbox.config.speed, ->
				$(@).remove()
	}

	drmLightbox.init()

) jQuery