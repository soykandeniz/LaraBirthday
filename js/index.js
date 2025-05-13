// I am going to continue to improve this...
// Birthday page animations and interactions

// Define these as globals that functions.js can access
var offsetX;
var offsetY;
var heartAnimationInterval;

// Helper functions to handle animations
var pageAnimations = {
	// Initialize browser detection and page setup
	initialize: function () {
		// Edge browser detection 
		var NavigatorName = navigator.userAgent.toLowerCase();
		$('.clue-card').removeClass('show').css({
			'opacity': '0',
			'visibility': 'hidden',
			'transform': 'translateY(20px)'
		});

		if (NavigatorName.indexOf('edge') != -1) {
			$('#firstsection').empty();
			$('#firstsection').append('<h1>I\'m so sorry, but Edge browser doesn\'t support the birthday cake animation. Please view this with Firefox for the best experience!</h1>');
			$('#firstsection').append('<p>Trust me on this</p>');
		}

		// Adjust candle height based on screen size
		var velas_top = window.screen.height * 0.5 - 130;
		$('.velas').css({
			'top': velas_top + 'px'
		});
		if (window.innerWidth <= 767) {
			// Mobile positioning - INCREASE value to move candle LOWER
			velas_top = window.innerHeight * 0.38; // Changed from 0.28 to 0.38
		} else if (window.innerWidth <= 480) {
			// Extra small screens - INCREASE value to move candle LOWER
			velas_top = window.innerHeight * 0.42; // Changed from 0.32 to 0.42
		} else {
			// Desktop positioning
			velas_top = window.screen.height * 0.5 - 100;
		}
		$('.velas').css({
			'top': velas_top + 'px'
		});

		// Add the hide class to all texts initially to enable animations
		$('.text').addClass('hide');

		// Hide SVG elements initially to ensure they're properly reset
		$('#boyfriend, #book, #psp, #tenzile').addClass('hide');

		// Fix for SVG hover issue 
		$("<style>")
			.prop("type", "text/css")
			.html(`
                #boyfriend, #book, #psp, #tenzile {
                    pointer-events: none; /* Prevents hover issues */
                }
                .section svg {
                    pointer-events: none;
                }
                
                /* Added: Better CSS control for flame animations */
                .fuego {
                    animation-play-state: running !important;
                }
                .fuego.paused {
                    animation: none !important;
                    opacity: 0 !important;
                }
            `)
			.appendTo("head");

		// Fix SVG painting function for reliable drawing
		this.setupSvgPainting();

		// Add a marker to track section 1 visits
		$('#firstsection').attr('data-visited', 'first-time');
		// Add a marker for section 2 as well
		$('#secondsection').attr('data-visited', 'first-time');
	},

	// Set up enhanced SVG painting to avoid redraw issues
	setupSvgPainting: function () {
		// Original implementation
		var originalSvgPaint = window.svgpaint || function () { };

		window.svgpaint = function (index) {
			// Update to handle sections 3-8
			if (index < 3 || index > 8) {
				return; // Only process sections 3-8
			}

			var svgIndex = index - 3;
			var currentSection = $('.section').eq(index - 1);

			// For sections 6-8 that don't have SVG animations, display clue card after delay

			if (index >= 6 && index <= 7) {
				console.log("Processing non-SVG section:", index);

				// Ensure text is visible
				currentSection.find('.text').show();
				currentSection.find('.clue-card').removeClass('show').css({
					'opacity': '0',
					'visibility': 'hidden',
					'transform': 'translateY(20px)'
				});

				// After a delay, fade out text and show clue card
				setTimeout(function () {
					currentSection.find('.text').fadeOut(1000, function () {
						currentSection.find('.clue-card').addClass('show');
					});
				}, 5000); // Increased from 2000ms to 5000ms (5 seconds) to give more reading time

				return;
			}

			// For sections 3-5 with SVG animations, continue with existing code
			currentSection.find('.text').show();
			currentSection.find('.clue-card').removeClass('show').css({
				'opacity': '0',
				'visibility': 'hidden',
				'transform': 'translateY(20px)'
			});

			// Clean up existing animations before repainting
			if (svgIndex === 0) {
				try { $('#boyfriend').lazylinepainter('destroy'); } catch (e) { }
			} else if (svgIndex === 1) {
				try { $('#book').lazylinepainter('destroy'); } catch (e) { }
				try { $('#psp').lazylinepainter('destroy'); } catch (e) { }
			} else if (svgIndex === 2) {
				try { $('#tenzile').lazylinepainter('destroy'); } catch (e) { }
			}

			console.log("SVG painting for section:", index, "svgIndex:", svgIndex);

			// Handle special case for compound selector
			if (svgIndex === 1) {
				// Paint book and psp individually
				$('#book').lazylinepainter({
					"svgData": pathObj,
					"strokeWidth": 5,
					"strokeColor": '#916F6F'
				}).lazylinepainter('paint');

				$('#psp').lazylinepainter({
					"svgData": pathObj,
					"strokeWidth": 5,
					"strokeColor": '#916F6F',
					// Add onComplete callback to the LAST element
					"onComplete": function () {
						// Show the clue card after animation completes
						var section = $('#psp').closest('.section');
						setTimeout(function () {
							section.find('.text').fadeOut(500, function () {
								section.find('.clue-card').addClass('show');
							});
						}, 1000); // Wait 1 second after drawing completes
					}
				}).lazylinepainter('paint');
			} else {
				var selector = svgIndex === 0 ? '#boyfriend' :
					(svgIndex === 2 ? '#tenzile' : null);

				if (selector) {
					$(selector).lazylinepainter({
						"svgData": pathObj,
						"strokeWidth": 5,
						"strokeColor": '#916F6F',
						// Add onComplete callback
						"onComplete": function () {
							// Show the clue card after animation completes
							var section = $(selector).closest('.section');
							setTimeout(function () {
								section.find('.text').fadeOut(500, function () {
									section.find('.clue-card').addClass('show');
								});
							}, 1000); // Wait 1 second after drawing completes
						}
					}).lazylinepainter('paint');
				}
			}
		};
	},

	// IMPROVED: Reset flame animations with a more robust method
	resetFlames: function () {
		console.log("Resetting flame animations with enhanced approach");

		// First completely stop all animations to ensure a clean restart
		$(".fuego").addClass('paused');

		// Force a thorough browser reflow to ensure CSS changes take effect
		void document.documentElement.offsetHeight;

		// Stagger the restart of each flame with proper timing
		setTimeout(function () {
			$(".fuego").each(function (i) {
				var fuego = $(this);
				setTimeout(function () {
					// Remove the paused class, which restores the animation
					fuego.removeClass('paused');

					// Explicitly set CSS properties for more reliable animation restart
					fuego.css({
						"animation-name": "",
						"animation-duration": "1.5s",
						"animation-timing-function": "linear",
						"animation-iteration-count": "infinite",
						"animation-play-state": "running",
						"opacity": "1"
					});
				}, i * 150); // Increased delay between flames for better visual effect
			});
		}, 100); // Short delay before starting the sequence
	},

	// Add this function inside the pageAnimations object
	resetCakeSVG: function () {
		console.log("Reloading cake SVG animation");

		// Save the original src
		var originalSrc = $("#cake").attr("src");

		// Create a timestamp parameter to force reload
		var timestamp = new Date().getTime();
		var newSrc = originalSrc.split('?')[0] + "?t=" + timestamp;

		// Method 1: Just change the src with a timestamp to force reload
		$("#cake").attr("src", newSrc);

		// Method 2: Alternative approach - replace the entire embed element
		/* 
		var cakeEmbed = $("#cake");
		var cakeParent = cakeEmbed.parent();
		var cakeClone = cakeEmbed.clone();
	    
		cakeEmbed.remove();
		cakeClone.attr("src", newSrc);
		cakeParent.append(cakeClone);
		*/
	},
	// 1. Update the resetCandle function with longer animation delay
	resetCandle: function () {
		console.log("Resetting candle animation");

		// First remove the candle
		var velas = $('.velas');
		velas.css({
			"transform": "translateY(-300px)",
			"animation": "none"
		});

		// Force reflow
		void document.documentElement.offsetHeight;

		// Re-add the animation with LONGER delay to appear after cake fully loads
		setTimeout(function () {
			velas.css({
				"animation": "in 500ms 3.5s ease-out forwards" // Increased from 3s to 4s
			});
		}, 50);
	},

	initPhotoSlider: function () {
		console.log("Initializing photo slider");

		// Sample photos - replace with your actual photos later
		const photos = [
			{ src: 'img/1.jpeg', caption: 'Every moment with you is a gift' },
			{ src: 'img/3.jpeg', caption: 'My heart belongs to you, always' },
			{ src: 'img/4.jpeg', caption: 'You make every day special' },
			{ src: 'img/5.jpeg', caption: 'Forever isnt long enough with you' },
			{ src: 'img/6.jpeg', caption: 'You are the light of my life' },
			{ src: 'img/7.jpeg', caption: 'Home is wherever I am with you' },
			{ src: 'img/8.jpeg', caption: 'You are all I ever wanted' },
			{ src: 'img/9.jpeg', caption: 'To many more years of us' },
			{ src: 'img/10.jpeg', caption: 'I fall in love with you every day' },
			{ src: 'img/11.jpeg', caption: 'You are my sunshine on rainy days' },
			{ src: 'img/12.jpeg', caption: 'Life is most beautiful melody is you' },
			{ src: 'img/13.jpeg', caption: 'Every love story is beautiful, but ours is my favorite' },
			{ src: 'img/14.jpeg', caption: 'You make my heart smile' },
			{ src: 'img/15.jpeg', caption: 'Loving you is the easiest thing I have ever done' },
			{ src: 'img/16.jpeg', caption: 'You are the reason I believe in love' },
		];

		// Create slider HTML
		const sliderWrapper = $('.slider-wrapper');
		const dotsContainer = $('.slider-dots');

		// Clear existing content
		sliderWrapper.empty();
		dotsContainer.empty();

		// Update this part of your initPhotoSlider function
		photos.forEach((photo, index) => {
			sliderWrapper.append(`
        <div class="slider-item">
            <img src="${photo.src}" alt="${photo.caption}" class="slider-image">
            <div class="slider-caption">${photo.caption}</div>
        </div>
    `);

			dotsContainer.append(`<div class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`);
		});

		// Set initial state
		let currentSlide = 0;
		const totalSlides = photos.length;
		let autoSlideInterval;

		// Function to show a specific slide
		function showSlide(index) {
			// Handle wrapping
			if (index < 0) index = totalSlides - 1;
			if (index >= totalSlides) index = 0;

			currentSlide = index;
			sliderWrapper.css('transform', `translateX(-${currentSlide * 100}%)`);

			// Update dots
			$('.slider-dot').removeClass('active');
			$(`.slider-dot[data-index="${currentSlide}"]`).addClass('active');
		}

		// Navigation event handlers
		$('.slider-next').on('click', function () {
			showSlide(currentSlide + 1);
			resetAutoSlide();
		});

		$('.slider-prev').on('click', function () {
			showSlide(currentSlide - 1);
			resetAutoSlide();
		});

		// Dot navigation
		$('.slider-dot').on('click', function () {
			const index = $(this).data('index');
			showSlide(index);
			resetAutoSlide();
		});

		// Auto-slide functionality
		function startAutoSlide() {
			autoSlideInterval = setInterval(function () {
				showSlide(currentSlide + 1);
			}, 4000); // Change slide every 4 seconds
		}

		function resetAutoSlide() {
			clearInterval(autoSlideInterval);
			startAutoSlide();
		}

		// Start the auto-slide
		startAutoSlide();

		// Show the slider with animation
		setTimeout(function () {
			$('.photo-slider').removeClass('hide').addClass('animated fadeIn');
		}, 1500);
	},

	// Start heart animation
	startHeartAnimation: function () {
		console.log("Starting heart animation");

		// Clear any existing interval
		if (heartAnimationInterval) {
			clearInterval(heartAnimationInterval);
			heartAnimationInterval = null;
		}

		// Set global variables
		offsetX = $("#loveHeart").width() / 2;
		offsetY = $("#loveHeart").height() / 2 - 55;

		var together = new Date();
		together.setFullYear(1992, 9, 18);
		together.setHours(10);
		together.setMinutes(0);
		together.setSeconds(0);
		together.setMilliseconds(0);

		// Reset garden to fresh state
		if (typeof garden !== 'undefined') {
			garden.clear();
		}

		if (typeof garden === 'undefined' || garden === null) {
			garden = new Garden(document.getElementById('garden'), { width: 670, height: 625 });
		}

		$("#garden").css({
			"position": "relative",
			"z-index": "10"
		});

		if (typeof startHeartAnimation === 'function') {
			startHeartAnimation();
			timeElapse(together);
			heartAnimationInterval = setInterval(function () {
				timeElapse(together);
			}, 500);
			return true;
		} else {
			console.error("startHeartAnimation function is missing!");
			return false;
		}
	},

	// Stop heart animation
	stopHeartAnimation: function () {
		if (heartAnimationInterval) {
			clearInterval(heartAnimationInterval);
			heartAnimationInterval = null;
		}
	},

	// Initialize fullPage.js - this is where errors keep occurring
	initFullPage: function () {
		// Check for proper fullpage.js plugin initialization
		if (typeof $.fn.fullpage !== 'function') {
			console.error("fullpage.js plugin not found or not properly loaded!");
			return false;
		}

		// Initialize fullPage with callbacks
		$('#fullpage').fullpage({
			sectionsColor: ['#ee9ca7', '#ffcc66', '#ffcc66', '#00cc99', '#ee9ca7', '#66cccc', '#ffcc66', '#000000'],
			navigation: true,
			scrollingSpeed: 700,
			autoScrolling: true,
			scrollBar: false,
			css3: true,
			// Disable keyboard scrolling to prevent skipping quizzes
			keyboardScrolling: false,
			// Only allow programmatic scrolling (from quiz answers)
			scrollOverflow: false,

			// This runs BEFORE the section change - prepare the next section's animations
			onLeave: function (index, nextIndex, direction) {
				console.log("Leaving section", index, "going to", nextIndex, "direction:", direction);

				if (index === 3 && nextIndex > 3 && direction === 'down') {
					// Only allow if triggered by quiz (not by manual scrolling)
					if (!window.quizTriggeredScroll) {
						return false; // Prevent the scroll
					}
					// Reset the flag after using it
					window.quizTriggeredScroll = false;
				}

				// Skip easter egg section
				if (index === 8 || nextIndex === 8) {
					return true;
				}
				if (index === 2) {
					$('#secondsection').attr('data-visited', 'needs-reset');
					// Hide slider and text to prepare for re-entry
					$('.photo-slider').addClass('hide').removeClass('animated fadeIn');
					$("#secondsection .text").addClass('hide').removeClass('animated fadeInDown');
				}


				// Update timing in afterLoad function
				if (index === 1) {
					if ($('#firstsection').attr('data-visited') === 'needs-reset') {
						// Reset to normal state
						$('#firstsection').attr('data-visited', 'visited');

						// Complete animation resets AFTER scroll completes
						// In the afterLoad function timing
						setTimeout(function () {
							// 1. First reset cake
							pageAnimations.resetCakeSVG();

							// 2. Then candle with slightly shorter delay (0.5s earlier)
							setTimeout(function () {
								pageAnimations.resetCandle();

								// 3. Keep the timing relationship the same for flames
								setTimeout(function () {
									pageAnimations.resetFlames();

									// 4. Keep text timing the same relative to flames
									setTimeout(function () {
										$("#firstsection .text").removeClass('hide').addClass('animated fadeInDown');
									}, 1500);
								}, 800);
							}, 1500); // Reduced from 2000ms to 1500ms (0.5s earlier)
						}, 100);
					}
					else if ($('#firstsection').attr('data-visited') === 'first-time') {
						// First time visiting section 1, just mark as visited
						$('#firstsection').attr('data-visited', 'visited');
					}
				}
				else if (index === 3) {
					$("#boyfriend").removeClass('animated fadeInUp').addClass('hide');
				}
				else if (index === 4) {
					$("#book, #psp").removeClass('animated fadeInUp').addClass('hide');
					$(".section").eq(3).find('img').removeClass('flipInX');
				}
				else if (index === 5) {
					$("#tenzile").removeClass('animated fadeInUp').addClass('hide');
				}
				else if (index === 6) {
					$("#tenzile_archer").addClass('animated fadeInUp');
					// Trigger the same pattern as SVG sections
					if (typeof svgpaint === 'function') {
						svgpaint(index);
					}
				}
				else if (index === 7) {
					$("#song").addClass('animated fadeInUp');
					// Trigger the same pattern as SVG sections
					if (typeof svgpaint === 'function') {
						svgpaint(index);
					}
				}
				else if (index === 8) {
					// Trigger the same pattern as SVG sections
					if (typeof svgpaint === 'function') {
						svgpaint(index);
					}
				}

				// In your onLeave function where you prepare the next section
				if (nextIndex >= 3 && nextIndex <= 7) {
					// First make the SVG elements visible 
					if (nextIndex === 3) {
						$("#boyfriend").removeClass('hide');
					}
					else if (nextIndex === 4) {
						$("#book, #psp").removeClass('hide');
					}
					else if (nextIndex === 5) {
						$("#tenzile").removeClass('hide');
					}

					// Start SVG painting with a short delay
					setTimeout(function () {
						if (typeof svgpaint === 'function') {
							svgpaint(nextIndex);
						}
					}, 50);
				}

				// THIRD: Show text for next section
				$(".section").eq(nextIndex - 1).find(".text").removeClass('hide').addClass('animated fadeInDown');

				// FOURTH: Setup special animations
				// In the onLeave function, update section 1 handling:
				// 3. Fix onLeave when navigating TO section 1 - ensure we set needs-reset flag
				if (nextIndex === 1) {
					// Mark section as needing reset when returning to it
					$('#firstsection').attr('data-visited', 'needs-reset');

					// Reset animations when going to section 1
					// Prepare flames for reset
					$(".fuego").addClass('paused');

					// Prepare candle for reset
					$('.velas').css({
						"transform": "translateY(-300px)",
						"animation": "none"
					});

					// Prepare for cake reset
					pageAnimations.resetCakeSVG();
				}
				else if (nextIndex === 2) {
					// Set up easter egg section when entering
					setTimeout(function () {
						if (typeof svgpaint === 'function') {
							svgpaint(nextIndex);
						}
					}, 50);
				}

				return true; // Allow the scroll
			},

			// This runs AFTER the section has loaded
			afterLoad: function (anchorLink, index) {
				console.log("fullPage afterLoad callback - index:", index);

				if (index === 8) {
					pageAnimations.startHeartAnimation();
					$("#words").removeClass('hide').addClass('animated fadeIn');
					return;
				}

				if (index === 1) {
					if ($('#firstsection').attr('data-visited') === 'needs-reset') {
						// Reset to normal state
						$('#firstsection').attr('data-visited', 'visited');

						// Complete animation resets AFTER scroll completes
						setTimeout(function () {
							// 1. First reset cake
							pageAnimations.resetCakeSVG();

							// 2. Then candle with LONGER delay
							setTimeout(function () {
								pageAnimations.resetCandle();

								// 3. Then flames after candle with same timing relationship
								setTimeout(function () {
									pageAnimations.resetFlames();

									// 4. Finally text after a reasonable delay
									setTimeout(function () {
										$("#firstsection .text").removeClass('hide').addClass('animated fadeInDown');
									}, 1500);
								}, 800); // Keep this timing the same
							}, 2000); // Increased from 1000ms to 2000ms
						}, 100);
					}
					else if ($('#firstsection').attr('data-visited') === 'first-time') {
						// First time visiting section 1, just mark as visited
						$('#firstsection').attr('data-visited', 'visited');
					}
				}

				if (index === 2) {
					var isFirstTime = $('#secondsection').attr('data-visited') === 'first-time';
					var needsReset = $('#secondsection').attr('data-visited') === 'needs-reset';

					// Update the visited state
					if (isFirstTime) {
						$('#secondsection').attr('data-visited', 'visited');
					} else if (needsReset) {
						$('#secondsection').attr('data-visited', 'visited');
					}

					// First show the text
					$("#secondsection .text").removeClass('hide').addClass('animated fadeInDown');

					// Initialize and show the slider with a delay
					setTimeout(function () {
						pageAnimations.initPhotoSlider();
					}, 1000);

					return;
				}

				// Add entrance animations
				if (index === 3) {
					$("#boyfriend").addClass('animated fadeInUp');
				}
				if (index >= 3 && index <= 5) {
					$('.section').eq(index - 1).find('.clue-card').removeClass('show');
				}
				else if (index === 4) {
					$("#book, #psp").addClass('animated fadeInUp');
					$(".section").eq(3).find('img').addClass('flipInX');
				}
				else if (index === 5) {
					$("#tenzile").addClass('animated fadeInUp');
				}
				else if (index === 6) {
					$("#tenzile_archer").removeClass('hide').addClass('animated flipInX');
				}
				else if (index === 7) {
					$("#song").removeClass('hide').addClass('animated fadeInUp');
				}
			}
		});

		return true;
	}
};

function resizeHeartCanvas() {
	if (typeof garden !== 'undefined' && garden !== null) {
		var loveHeart = $('#loveHeart');
		var gardenCanvas = $('#garden');
		var mainDiv = $('#mainDiv');
		var words = $('#words');
		var content = $('#content');

		// Force full viewport height for main container
		mainDiv.css({
			'height': '100vh',
			'overflow': 'hidden',
			'display': 'flex',
			'align-items': 'center',
			'justify-content': 'center',
			'width': '100%'
		});

		// Get device dimensions
		var deviceWidth = window.innerWidth;
		var deviceHeight = window.innerHeight;

		// Calculate scale based on device size
		var scale;
		if (deviceWidth <= 390 || deviceHeight <= 600) {
			scale = 0.4;
		} else if (deviceWidth <= 480 || deviceHeight <= 750) {
			scale = 0.45;
		} else if (deviceWidth <= 767) {
			scale = 0.65;
		} else if (deviceWidth <= 1024) {
			scale = 0.9;
		} else {
			scale = 1.0;
		}

		// Special case for the problematic 412x915 size
		if (deviceWidth <= 412 && deviceHeight <= 915 && deviceHeight > 800) {
			scale = 0.35; // More aggressive scaling for this specific device
		}

		// Set explicit dimensions for the heart container before scaling
		loveHeart.css({
			'width': '670px',
			'height': '625px',
			'transform': 'scale(' + scale + ')',
			'transform-origin': 'center center',
			'margin': '0 auto'
		});

		// Set canvas dimensions to match original heart size
		gardenCanvas.attr('width', 670);
		gardenCanvas.attr('height', 625);

		// Update offsets for heart positioning - IMPORTANT!
		offsetX = 670 / 2;
		offsetY = 625 / 2 - 50; // Adjust vertical position to raise the heart

		// Position text properly
		words.css({
			'position': 'absolute',
			'top': '0',
			'left': '5%',
			'width': '90%',
			'z-index': 20
		});

		// Adjust text size for smaller screens
		if (deviceWidth <= 480 || deviceHeight <= 750) {
			$('#messages').css({
				'font-size': '0.75em',
				'margin-bottom': '0.1em'
			});

			$('#loveu').css({
				'font-size': '0.6em',
				'padding': '0.2em',
				'line-height': '1.2'
			});
		}

		// Restart heart animation
		if (typeof startHeartAnimation === 'function') {
			startHeartAnimation();
		}
	}
}
// Make sure to call this on load and resize
$(window).on('load resize orientationchange', function () {
	resizeHeartCanvas();
});

// Use jQuery's document ready for initialization
jQuery(document).ready(function ($) {
	// Initialize the page first
	pageAnimations.initialize();
	setTimeout(resizeHeartCanvas, 500);

	// Then initialize fullPage.js
	if (pageAnimations.initFullPage()) {
		console.log("fullPage.js successfully initialized");
	} else {
		console.error("Failed to initialize fullPage.js");
	}

	// Initialize animations on page load
	$(window).on('load', function () {
		setTimeout(function () {
			var currentSection = $('.section.active').index() + 1;

			if (currentSection >= 3 && currentSection <= 5) {
				// Make sure SVG elements are visible
				if (currentSection === 3) {
					$("#boyfriend").removeClass('hide');
				}
				else if (currentSection === 4) {
					$("#book, #psp").removeClass('hide');
				}
				else if (currentSection === 5) {
					$("#tenzile").removeClass('hide');
				}

				if (typeof svgpaint === 'function') {
					svgpaint(currentSection);
				}
			}

			// Initialize heart animation if on section 8
			if (currentSection === 8) {
				pageAnimations.startHeartAnimation();
				$("#words").removeClass('hide').addClass('animated fadeIn');
			}

			// Update the timing sequence in the window.load handler
			if (currentSection === 1) {
				// First load the cake - needs to appear first
				pageAnimations.resetCakeSVG();

				// Sequence of animations with improved timing:
				setTimeout(function () {
					// Start candle animation EARLIER (0.5s earlier)
					pageAnimations.resetCandle();

					// Keep the same timing relationship between candle and flames
					setTimeout(function () {
						pageAnimations.resetFlames();
					}, 800);

					// Adjust text timing to maintain proper sequence
					$("#firstsection .text").addClass('hide');
					setTimeout(function () {
						$("#firstsection .text").removeClass('hide').addClass('animated fadeInDown');
					}, 3500); // Reduced from 4000ms to 3500ms
				}, 1500); // Reduced from 2000ms to 1500ms (0.5s earlier)
			}
		}, 200);
	});
});

// Quiz functionality
$(document).ready(function () {
	const musicBtn = $('#music-toggle');
	const musicIcon = $('.music-icon');
	const musicText = $('.music-text');
	const audio = $('#background-music')[0];

	musicBtn.on('click', function () {
		if (audio.paused) {
			audio.play();
			musicBtn.addClass('playing');
			musicText.text('Pause Music');
		} else {
			audio.pause();
			musicBtn.removeClass('playing');
			musicText.text('Play Music');
		}
	});

	// Stop music when navigating away from page
	$(window).on('beforeunload', function () {
		audio.pause();
	});
	// Initialize quiz functionality
	initQuiz();

	// Function to handle quizzes
	function initQuiz() {
		$('.quiz-submit').on('click', function () {
			const quizContainer = $(this).closest('.quiz-container');
			const input = quizContainer.find('.quiz-input');
			const feedback = quizContainer.find('.quiz-feedback');
			const userAnswer = input.val().trim().toLowerCase();
			const correctAnswer = input.data('answer').toLowerCase();
			const altAnswers = input.data('alt-answers') ?
				input.data('alt-answers').toLowerCase().split(',') : [];

			// Check if answer is correct (including alternate answers)
			const isCorrect = userAnswer === correctAnswer ||
				altAnswers.some(alt => userAnswer === alt.trim());

			if (isCorrect) {
				feedback.text('Correct! Moving to next section...').removeClass('incorrect').addClass('correct');

				// Disable input and button after correct answer
				input.prop('disabled', true);
				$(this).prop('disabled', true);

				// Move to next section after a short delay
				setTimeout(function () {
					$.fn.fullpage.moveSectionDown();
				}, 1500);
			} else {
				feedback.text('Try again!').removeClass('correct').addClass('incorrect');

				// Shake effect on incorrect answer
				quizContainer.css('transform', 'translateX(10px)');
				setTimeout(function () {
					quizContainer.css('transform', 'translateX(-10px)');
					setTimeout(function () {
						quizContainer.css('transform', 'translateX(0)');
					}, 100);
				}, 100);
			}
		});

		// Allow Enter key to submit
		$('.quiz-input').on('keypress', function (e) {
			if (e.which === 13) { // Enter key
				$(this).closest('.quiz-container').find('.quiz-submit').click();
			}
		});

		// Initially hide quiz containers and show them with animation
		$('.quiz-container').addClass('hide');

		// Show quiz container when section becomes active
		// $(document).on('afterLoad', function(anchorLink, index) {
		//     $('.section').eq(index-1).find('.quiz-container')
		//                .removeClass('hide')
		//                .addClass('animated fadeInUp');
		// });

	}
});
