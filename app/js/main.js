$(document).ready(function () {
	var $main = $(main),
		$header = $('#header'),
		headerHeight = $header.outerHeight(),
		upOffset = $('#up').offset().top,
		$upBtn = $('#up-btn'),
		fromBottom = false;

	var HEADER_FIX_OFFSET = 250,
		UP_FIX_OFFSET = 2000,
		FIXED_UP_BTN_BOTTOM_OFFSET = 32,
		PRODUCT_TEASER_ANIMATION_OFFSET = 150;

	if ($('#product-teasers').length) hideProductTeasers();

	if ($('#map').length) initMap('map');

	if ($('.profit__text').length) hideProfitText();

	$(window).scroll(function () {
		var scrolled = $(this).scrollTop();

		//animate product-teasers
		if ($('.product-teaser--hidden').length) {
			$('.product-teaser--hidden').each(function () {
				var productTeaserOffset = $(this).offset().top + PRODUCT_TEASER_ANIMATION_OFFSET;

				if (scrolled + $(window).height() > productTeaserOffset) {
					showProductTeaser($(this));
				}
			});
		}

		//fixed nav
		if (scrolled > (headerHeight + HEADER_FIX_OFFSET)) {
			if (!$header.hasClass('l_header--fixed')) {
				$main.css('padding-top', headerHeight + 'px');
				$header.addClass('l_header--fixed');
				$header.animate({ opacity: 1 }, 350);
			}
		} else {
			if ($header.hasClass('l_header--fixed')) {
				$main.css('padding-top', 0);
				$header.removeClass('l_header--fixed');
				$header.stop();
				$header.attr('style', '');
			}
		}

		//fixed up
		var isAbobeUpContainer = (scrolled - FIXED_UP_BTN_BOTTOM_OFFSET - $upBtn.outerHeight() + $(window).height()) < upOffset ? true : false;

		if (!isAbobeUpContainer && !$upBtn.hasClass('up__btn--fixed')) {
			fromBottom = true;
		} else if (scrolled < UP_FIX_OFFSET && !$upBtn.hasClass('up__btn--fixed')) {
			fromBottom = false;
		}

		if (scrolled > UP_FIX_OFFSET && isAbobeUpContainer) {
			if (!$upBtn.hasClass('up__btn--fixed')) {
				$upBtn.addClass('up__btn--fixed');
			}


			if (!fromBottom) {
				$upBtn.stop().animate({ opacity: 1 }, 350);
			} else {
				$upBtn.stop();
				$upBtn.css('opacity', 1);
			}
		} else {
			if ($upBtn.hasClass('up__btn--fixed')) {
				if (isAbobeUpContainer) {
					$upBtn.stop().animate({ opacity: 0 }, 150, function () {
						$upBtn.removeClass('up__btn--fixed');
						$upBtn.attr('style', '');
					})
				} else {
					$upBtn.removeClass('up__btn--fixed');
					$upBtn.attr('style', '');
				}
			}
		}
	});

	$(window).trigger('scroll');

	$(window).resize(function () {
		$(window).trigger('scroll');
	});

	$upBtn.click(function (e) {
		e.preventDefault();

		$('html, body').animate({
			scrollTop: $('body').offset().top
		}, 1000);

		$(this).blur();
	});

	$('.profit__more').click(function () {
		$(this).closest('.profit__content').find('.profit__text').readmore('toggle');
	});

	$('.popup__close, .popup__button--close').click(function (e) {
		e.preventDefault();
		closePopup($(this).closest('.popup'));
	});

	$('.popup-overlay').click(function () {
		if ($(this).hasClass('popup-overlay--active')) closePopup($('.popup--active'));
	})

	$('#get-price').click(function (e) {
		e.preventDefault();
		openPopup($('#get-price-popup'));
	});

	$('.brands__title').click(function () {
		if (!$(this).hasClass('brands__title--active')) {
			var id = '#' + $(this).attr('rel');

			$('.brands__title--active').removeClass('brands__title--active');
			$('.brands-info__item--active').removeClass('brands-info__item--active');
			$(this).addClass('brands__title--active');
			$(id).addClass('brands-info__item--active');
		}
	});

	if ($('.gallery-item').length) initGallery();
});

function initGallery() {
	$('.gallery-item').colorbox({
		maxWidth: '75%'
	});
}

function hideProfitText() {
	$('.profit__text').readmore({
		speed: 200,
		moreLink: '',
		lessLink: '',
		afterToggle: function (trigger, element, expanded) {
			if (expanded) {
				$(element).closest('.profit__content').find('.profit__more').addClass('profit__more--expanded');
			} else {
				$(element).closest('.profit__content').find('.profit__more').removeClass('profit__more--expanded');
			}
		}
	});
}

function hideProductTeasers() {
	var scrolled = $(window).scrollTop() + $(window).height(),
		productTeasersOffset = $('#product-teasers').offset().top;

	if (scrolled < productTeasersOffset) {
		$('.product-teaser--vertical').each(function () {
			$(this).addClass('product-teaser--hidden');
			$(this).find('.product-teaser__cover--vertical').addClass('product-teaser__cover--hidden');
			$(this).find('.product-teaser__content--vertical').addClass('product-teaser__content--hidden');
		});
	}
}

function showProductTeaser($elem) {
	$elem.removeClass('product-teaser--hidden');
	$elem.find('.product-teaser__cover--vertical').removeClass('product-teaser__cover--hidden');
	$elem.find('.product-teaser__content--vertical').removeClass('product-teaser__content--hidden');
}

function initMap(elemId) {
	var map;

	DG.then(function () {
		map = DG.map(elemId, {
			center: [52.28012807189601, 104.25546249999994],
			zoom: 13,
			scrollWheelZoom: false
		});

		var myIcon = DG.icon({
			iconUrl: 'assets/resources/images/map-target.png',
			iconSize: [39, 51],
			iconAnchor: [18.5, 51]
		});

		var places = {
			storage1: DG.marker([52.28012807189601, 104.25546249999994], { icon: myIcon }).addTo(map).bindPopup('<div class="map-popup"><p class="map-popup__text">ул. Терешковой, 22</p></div>'),
			storage2: DG.marker([52.28177607190024, 104.30062999999993], { icon: myIcon }).addTo(map).bindPopup('<div class="map-popup"><p class="map-popup__text">ул. Софьи Перовской, 29а</p></div>'),
		}

		places['storage1'].openPopup();

		$('.contacts__show-on-the-map').click(function () {
			if (!$(this).hasClass('button--disabled')) {
				var place = $(this).attr('id');
				map.setView(places[place]._latlng);
				places[place].openPopup();

				$('.contacts__show-on-the-map.button--disabled').removeClass('button--disabled');
				$(this).addClass('button--disabled');
				$(this).blur();
			}
		});

		return map;
	});
}

function openPopup($elem) {
	$elem.addClass('popup--active');
	$('.popup-overlay').addClass('popup-overlay--active');
	$($elem.find('.input')[0]).focus();
}

function closePopup($elem) {
	$elem.removeClass('popup--active');
	$('.popup-overlay').removeClass('popup-overlay--active');
}