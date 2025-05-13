$(document).ready(function () {
    // COMPLETE OVERRIDE of key heart animation functions

    // 1. Override the original heart animation completion function
    window.startHeartAnimation = function () {
        // Only start heart animation if we're actually in section 8
        var currentSection = $('.section.active').index() + 1;
        if (currentSection !== 8) {
            console.log("Preventing heart animation in section: " + currentSection);
            return; // Exit early if not in section 8
        }

        console.log("OVERRIDE: Starting heart animation");

        // Clear any existing interval
        if (window.heartAnimationInterval) {
            clearInterval(window.heartAnimationInterval);
        }

        // Set global variables for heart position
        window.offsetX = $("#loveHeart").width() / 2;
        window.offsetY = $("#loveHeart").height() / 2 - 55;

        // Reset garden
        if (typeof garden !== 'undefined' && garden !== null) {
            garden.clear();
        }

        // Reset all elements
        $('#words').hide();
        $('.animate-message').removeClass('animate-up');
        $('.heart-initials').removeClass('show');

        // Set birthday date - May 13, 1999
        var together = new Date();
        together.setFullYear(1999, 4, 13); // Month is 0-based, 4 = May
        together.setHours(0);
        together.setMinutes(0);
        together.setSeconds(0);
        together.setMilliseconds(0);

        // Start heart drawing
        var interval = 50;
        var angle = 10;
        var heart = new Array();

        console.log("Starting heart animation loop");
        var animationTimer = setInterval(function () {
            var bloom = getHeartPoint(angle);
            var draw = true;
            for (var i = 0; i < heart.length; i++) {
                var p = heart[i];
                var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
                if (distance < Garden.options.bloomRadius.max * 1.3) {
                    draw = false;
                    break;
                }
            }
            if (draw) {
                heart.push(bloom);
                garden.createRandomBloom(bloom[0], bloom[1]);
            }
            if (angle >= 30) {
                clearInterval(animationTimer);
                console.log("Heart animation complete at angle:", angle);
                ourShowMessages();  // Using our custom function
            } else {
                angle += 0.2;
            }
        }, interval);

        // Update both clock timers
        updateBothClocks(together);

        window.heartAnimationInterval = setInterval(function () {
            updateBothClocks(together);
        }, 500);
    };

    // 2. Custom clock update function
    function updateBothClocks(date) {
        // Birthday clock
        var current = new Date();
        var seconds = (Date.parse(current) - Date.parse(date)) / 1000;
        var days = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        var hours = Math.floor(seconds / 3600);
        if (hours < 10) hours = "0" + hours;
        seconds = seconds % 3600;
        var minutes = Math.floor(seconds / 60);
        if (minutes < 10) minutes = "0" + minutes;
        seconds = seconds % 60;
        if (seconds < 10) seconds = "0" + seconds;

        var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
        $("#elapseClock").html(result);

        // Relationship clock - October 5, 2022
        var relationshipDate = new Date();
        relationshipDate.setFullYear(2022, 10, 5);
        relationshipDate.setHours(0);
        relationshipDate.setMinutes(0);
        relationshipDate.setSeconds(0);
        relationshipDate.setMilliseconds(0);

        seconds = (Date.parse(current) - Date.parse(relationshipDate)) / 1000;
        days = Math.floor(seconds / (3600 * 24));
        seconds = seconds % (3600 * 24);
        hours = Math.floor(seconds / 3600);
        if (hours < 10) hours = "0" + hours;
        seconds = seconds % 3600;
        minutes = Math.floor(seconds / 60);
        if (minutes < 10) minutes = "0" + minutes;
        seconds = seconds % 60;
        if (seconds < 10) seconds = "0" + seconds;

        var relResult = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
        $("#elapseRelationship").html(relResult);
    }

    function ourShowMessages() {
        console.log("OUR CUSTOM showMessages function executing");

        // Position properly first
        positionMessages();

        // Make sure elements are initially hidden
        $('.animate-message').css('opacity', '0');

        // Show the container first with a nicer fade
        $('#words').fadeIn(800, function () {
            // Add animation classes with delay
            setTimeout(function () {
                // Create more dramatic staggered animation effect
                $('.animate-message').each(function (index) {
                    var $this = $(this);
                    setTimeout(function () {
                        $this.addClass('animate-up');
                    }, index * 250); // Increased delay between messages for more dramatic effect
                });

                // Show S&T initials with longer delay
                setTimeout(function () {
                    $('.heart-initials').addClass('show');
                    console.log("Added show class to heart initials");
                }, 2000); // Increased delay for better timed appearance
            }, 300);
        });
    }

    // 4. Positioning functionpositionMessages
    // Additional helper function for positioning messages
    function positionMessages() {
        var windowWidth = window.innerWidth;

        // Reset any previous positioning
        $('#words').css({
            'display': 'none',
            'z-index': '100'
        });

        if (windowWidth <= 768) {
            // Mobile positioning - at the top with better centering
            $('#words').css({
                'position': 'absolute',
                'top': '20px',
                'left': '0',
                'width': '90%',
                'margin': '0 auto',
                'text-align': 'center'
            });

            // Push heart down
            $('#mainDiv').css('margin-top', '160px');

            // Ensure loveu has centered text and proper padding
            $('#messages, #loveu').css({
                'text-align': 'center',
                'padding': '10px',
                'width': '100%',
                'box-sizing': 'border-box',
                'margin-bottom': '15px',
                'display': 'block'
            });
        } else {
            // Desktop/tablet positioning - horizontal layout with wider elements
            $('#words').css({
                'position': 'absolute',
                'top': '120px',
                'left': '0',
                'width': '100%',
                'display': 'flex',
                'flex-direction': 'row',
                'justify-content': 'center',
                'align-items': 'flex-start',
                'gap': '30px'
            });

            // Position elements side by side with increased width
            $('#messages').css({
                'width': '400px', // Increased width from 45%
                'display': 'inline-block',
                'text-align': 'right',
                'margin-right': '15px'
            });

            $('#loveu').css({
                'width': '400px', // Increased width from 45%
                'display': 'inline-block',
                'text-align': 'left',
                'margin-left': '15px',
                'padding': '15px',
                'box-sizing': 'border-box'
            });

            // Reset heart margin
            $('#mainDiv').css('margin-top', '0');
        }
    }

    // 5. Clean implementation of the section change handler
    $(document).on('afterLoad', function (anchorLink, index) {
        console.log("Section changed to:", index);

        if (index === 8) { // Heart animation section (was incorrectly set to 2)
            setTimeout(function () {
                if (typeof window.startHeartAnimation === 'function') {
                    window.startHeartAnimation();
                }
            }, 200);
        }
    });

    setTimeout(function () {
        // If we're on section 8, start the animation
        if ($('.section').eq(7).hasClass('active')) {
            window.startHeartAnimation();
        }
    }, 500);

    // 6. Override other functions to prevent conflicts
    window.showMessages = ourShowMessages;
    window.adjustWordsPosition = positionMessages;
    window.timeElapse = updateBothClocks;

    // 7. Add click handler for manual testing
    $('#loveHeart').on('click', function () {
        console.log("Heart clicked - forcing animation restart");
        window.startHeartAnimation();
    });

    // Initialize on page load to make sure everything is set up
    setTimeout(function () {
        // Change this from section 2 (index 1) to section 8 (index 7)
        if ($('.section').eq(7).hasClass('active')) {  // This should be eq(7)
            window.startHeartAnimation();
        }
    }, 500);
});