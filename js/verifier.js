$(document).ready(function () {
    console.log("Location verifier loading");

    // Define clue locations with their coordinates
    const clueLocations = {
        'Home': { lat: 37.6658678571724, lng: -122.06756530278956 },
        'Walnut Creek': { lat: 37.89491039452726, lng: -122.06030480026239 },
        'Tiburon': { lat: 37.87315591270606, lng: -122.45700992864545 },
        'Muir Woods': { lat: 37.89716372655689, lng: -122.58036669974331 },
        'San Francisco': { lat: 37.78572650040276, lng: -122.41089463068961 }
    };

    // Disable all buttons initially
    $('.reveal-question-btn').prop('disabled', true);

    // Add status messages below each button
    $('.reveal-question-btn').after('<div class="location-status">Checking your location...</div>');

    // Show initial instructions to user
    $('.location-status').after('<div class="location-instructions" style="font-size: 0.8em; margin-top: 5px; color: #666;">Please allow location access when prompted to verify you\'re at this location.</div>');

    // Function to calculate distance between two points using Haversine formula (in miles)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3958.8; // Earth's radius in miles
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function toRad(degrees) {
        return degrees * Math.PI / 180;
    }

    // Get user's location and verify proximity
    function checkUserLocation() {
        if (navigator.geolocation) {
            // Show a better message while waiting for permission
            $('.location-status').text('Waiting for location permission...');

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // We got the user's position
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    console.log("User location:", userLat, userLng);
                    $('.location-instructions').hide(); // Hide instructions once we have location

                    // Check each clue card 
                    $('.clue-card').each(function () {
                        const $card = $(this);
                        const $btn = $card.find('.reveal-question-btn');
                        const $status = $card.find('.location-status');

                        // Determine which clue this is based on title
                        const clueTitle = $card.find('.clue-title').text();
                        let closestLocation = null;
                        let shortestDistance = Infinity;

                        // Find the closest matching location
                        for (const [name, coords] of Object.entries(clueLocations)) {
                            if (clueTitle.includes(name) || name.includes(clueTitle)) {
                                const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
                                if (distance < shortestDistance) {
                                    shortestDistance = distance;
                                    closestLocation = name;
                                }
                            }
                        }

                        // If we found a matching location
                        if (closestLocation) {
                            if (shortestDistance <= 10) {
                                // User is within range!
                                $btn.prop('disabled', false);
                                $status.text(`You're at ${closestLocation}! (${shortestDistance.toFixed(1)} miles away)`).css('color', '#00cc99');
                            } else {
                                // User is too far
                                $status.text(`You're ${shortestDistance.toFixed(1)} miles from ${closestLocation}`);
                            }
                        } else {
                            // For debugging - enable all buttons in development
                            $btn.prop('disabled', false);
                            $status.text('Location verification bypassed for testing');
                        }
                    });
                },
                function (error) {
                    // Error getting location - provide specific feedback based on error type
                    console.error("Error getting location:", error);

                    let errorMessage = 'Error getting your location. ';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Please allow location access to verify your presence.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage += 'An unknown error occurred.';
                            break;
                    }

                    // For usability, enable buttons anyway with warning
                    $('.reveal-question-btn').prop('disabled', false);
                    $('.location-status').text(errorMessage).css('color', '#ff6666');

                    // Add a message explaining we're enabling the button anyway
                    $('.location-instructions').text('Buttons have been enabled, but the experience is better when at the actual locations!').css('color', '#666');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            // Browser doesn't support geolocation
            console.error("Geolocation not supported");
            // Enable buttons anyway
            $('.reveal-question-btn').prop('disabled', false);
            $('.location-status').text('Your browser does not support location verification').css('color', '#ff6666');
            $('.location-instructions').text('Buttons have been enabled, but the experience is better when at the actual locations!').css('color', '#666');
        }
    }

    // Add a more attractive check button for users to refresh their location
    $('.clue-card').append(`
        <button class="check-location-btn" style="
            font-size: 0.8em; 
            margin-top: 10px; 
            padding: 5px 15px;
            border-radius: 20px;
            background: linear-gradient(to right, #66cccc, #8cd9d9);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        ">Update My Location</button>
    `);

    $('.check-location-btn').on('click', function () {
        $(this).siblings('.location-status').text('Checking your location...');
        $(this).siblings('.location-instructions').show().text('Please allow location access when prompted.');
        checkUserLocation();
    });

    // Initial location check
    setTimeout(checkUserLocation, 1000); // Slight delay for better UX
});