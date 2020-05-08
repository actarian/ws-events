// import Swiper from "swiper";

const element = document.querySelector('[swiper-slides]');
if (element) {
	const options = {
		slidesPerView: 3,
		spaceBetween: 0,
		centeredSlides: true,
		loop: true,
		loopAdditionalSlides: 100,
		speed: 600,
		/*
		autoplay: {
			delay: 5000,
		},
		*/
		keyboardControl: true,
		mousewheelControl: false,
		pagination: {
			el: '[swiper-slides] .swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '[swiper-slides] .swiper-button-next',
			prevEl: '[swiper-slides] .swiper-button-prev',
		},
		keyboard: {
			enabled: true,
			onlyInViewport: true,
		},
	};
	const swiper = new Swiper(element, options);
}

const elements = Array.prototype.slice.call(document.querySelectorAll('[swiper-events]'));
elements.forEach(element => {
	const options = {
		slidesPerView: 2,
		spaceBetween: 25,
		centeredSlides: false,
		// loop: true,
		loopAdditionalSlides: 100,
		speed: 600,
		/*
		autoplay: {
			delay: 5000,
		},
		*/
		keyboardControl: true,
		mousewheelControl: false,
		pagination: {
			el: '[swiper-events] .swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '[swiper-events] .swiper-button-next',
			prevEl: '[swiper-events] .swiper-button-prev',
		},
		keyboard: {
			enabled: true,
			onlyInViewport: true,
		},
	};
	const swiper = new Swiper(element, options);
	console.log(swiper);
});
