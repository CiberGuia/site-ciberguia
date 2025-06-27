document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.download-btn');

    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            anime({
                targets: button,
                scale: 1.1,
                duration: 500,
                easing: 'easeInOutQuad'
            });
        });

        button.addEventListener('mouseout', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 500,
                easing: 'easeInOutQuad'
            });
        });

        button.addEventListener('click', (event) => {
            event.preventDefault();
            anime({
                targets: button,
                scale: [1, 0],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInOutQuad',
                complete: () => {
                    window.location.href = button.href;
                }
            });
        });
    });
});