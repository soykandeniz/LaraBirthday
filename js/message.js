// Message display and animation functionality
$(document).ready(function() {
    // Store original functions to call later if needed
    var originalShowMessages = window.showMessages;
    
    // Override the showMessages function
    window.showMessages = function() {
        console.log("Showing animated messages after heart completion");
        
        // Position words first
        adjustWordsPosition();
        
        // Set initial state for animations
        $('.animate-message').css({
            'opacity': '0',
            'transform': 'translateY(100px)'
        });
        
        // Show the container
        $('#words').fadeIn(500, function() {
            // Then add animation classes with a slight delay
            setTimeout(function() {
                $('.animate-message').addClass('animate-up');
                
                // Show the initials in the heart
                setTimeout(function() {
                    $('.heart-initials').addClass('show');
                }, 800);
            }, 200);
        });
    };
    
    // Additional helper function for positioning messages
    function positionMessages() {
        var windowWidth = window.innerWidth;
        
        // Reset any previous positioning
        $('#words').css({
            'display': 'none', // Start hidden
            'z-index': '100'
        });
        
        if (windowWidth <= 768) {
            // Mobile positioning - at the top
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
        } else {
            // Desktop positioning - on the left
            $('#words').css({
                'position': 'absolute',
                'top': '150px',
                'left': '50px',
                'width': '300px',
                'text-align': 'left'
            });
            
            // Reset heart margin
            $('#mainDiv').css('margin-top', '0');
        }
    }
    
    // Override the adjustWordsPosition function
    window.adjustWordsPosition = positionMessages;
    
    // Make sure we update the positioning when screen resizes
    $(window).on('resize', function() {
        if ($('.section').eq(1).hasClass('active') && $('#words').is(':visible')) {
            positionMessages();
        }
    });
});