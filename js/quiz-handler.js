// Quiz functionality handler
$(document).ready(function () {
    console.log("Quiz handler loading");

    // Remove any existing handlers to avoid duplication
    $('.reveal-question-btn').off('click');

    // Clean and direct approach to showing quizzes
    $('.reveal-question-btn').on('click', function () {
        console.log("Question button clicked");

        // Direct DOM references
        var button = $(this);
        var section = button.closest('.section');
        var quizContainer = section.find('.quiz-container');

        // Hide button immediately
        button.hide();

        // Use direct jQuery method to absolutely ensure visibility
        quizContainer.css({
            'display': 'block !important',
            'opacity': '1 !important',
            'visibility': 'visible !important'
        });

        // Force display through class and direct style
        quizContainer.addClass('show-quiz');
        quizContainer.attr('style', 'display: block !important');

        console.log("Quiz now visible");
    });

    // Answer validation with fixed handling
    $('.quiz-submit').off('click').on('click', function () {
        var submit = $(this);
        var quizContainer = submit.closest('.quiz-container');
        var input = quizContainer.find('.quiz-input');
        var feedback = quizContainer.find('.quiz-feedback');

        var userAnswer = input.val().trim().toLowerCase();
        var correctAnswer = input.data('answer').toLowerCase();
        var altAnswers = input.data('alt-answers') ?
            input.data('alt-answers').toLowerCase().split(',') : [];

        // Check for correct answer
        var isCorrect = userAnswer === correctAnswer ||
            altAnswers.some(function (alt) { return userAnswer === alt.trim(); });

        if (isCorrect) {
            feedback.text('Correct! Moving to next section...').removeClass('incorrect').addClass('correct');

            // Disable input and button
            input.prop('disabled', true);
            submit.prop('disabled', true);

            // Move to next section after delay
            setTimeout(function () {
                $.fn.fullpage.moveSectionDown();
            }, 1500);
        } else {
            feedback.text('Try again!').removeClass('correct').addClass('incorrect');

            // Shake effect
            quizContainer.css('transform', 'translateX(10px)');
            setTimeout(function () {
                quizContainer.css('transform', 'translateX(-10px)');
                setTimeout(function () {
                    quizContainer.css('transform', 'translateX(0)');
                }, 100);
            }, 100);
        }
    });

    // Enable Enter key for answer submission
    $('.quiz-input').off('keypress').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(this).closest('.quiz-container').find('.quiz-submit').click();
        }
    });

    // Make sure clue cards are visible with proper desktop sizing
    $('.clue-card').css({
        'visibility': 'visible',
        'opacity': '1'
    });
});