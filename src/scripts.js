console.log("Script file loaded");

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navbar links
    document.querySelector('.navbar').addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    });
});

