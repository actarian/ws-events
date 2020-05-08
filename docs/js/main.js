/**
 * @license ws-events v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function () {
	'use strict';

	var element = document.querySelector('[swiper-slides]');

	if (element) {
	  var options = {
	    slidesPerView: 3,
	    spaceBetween: 0,
	    centeredSlides: true,
	    loop: true,
	    loopAdditionalSlides: 100,
	    speed: 600,
	    keyboardControl: true,
	    mousewheelControl: false,
	    pagination: {
	      el: '[swiper-slides] .swiper-pagination',
	      clickable: true
	    },
	    navigation: {
	      nextEl: '[swiper-slides] .swiper-button-next',
	      prevEl: '[swiper-slides] .swiper-button-prev'
	    },
	    keyboard: {
	      enabled: true,
	      onlyInViewport: true
	    }
	  };
	  var swiper = new Swiper(element, options);
	}

	var elements = Array.prototype.slice.call(document.querySelectorAll('[swiper-events]'));
	elements.forEach(function (element) {
	  var options = {
	    slidesPerView: 2,
	    spaceBetween: 25,
	    centeredSlides: false,
	    loopAdditionalSlides: 100,
	    speed: 600,
	    keyboardControl: true,
	    mousewheelControl: false,
	    pagination: {
	      el: '[swiper-events] .swiper-pagination',
	      clickable: true
	    },
	    navigation: {
	      nextEl: '[swiper-events] .swiper-button-next',
	      prevEl: '[swiper-events] .swiper-button-prev'
	    },
	    keyboard: {
	      enabled: true,
	      onlyInViewport: true
	    }
	  };
	  var swiper = new Swiper(element, options);
	  console.log(swiper);
	});

}());
