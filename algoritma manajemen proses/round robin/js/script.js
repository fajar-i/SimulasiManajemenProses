var direction = 10;
let isScrolling = true;

const scrollSection = document.querySelector('.scroll');
scrollSection.addEventListener('click', () => {
    isScrolling = !isScrolling;
});

function autoScroll() {
    const scrollSection = document.querySelector('.scroll');
    // Scroll the section to the left
    if (isScrolling) {
        scrollSection.scrollBy({
            left: direction,
            behavior: 'smooth'
        });
        // Check if we have reached the start of the scrollable area
        if (scrollSection.scrollLeft <= 0) {
            // Reset scroll direction to the end
            direction = 10;
        }
        // Check if we have reached the end of the scrollable area
        if (scrollSection.scrollLeft + scrollSection.clientWidth == scrollSection.scrollWidth) {
            // Reset scroll direction to the beginning
            direction = -10;
        }
    }
    // Continuously call this function to achieve automatic scrolling
    requestAnimationFrame(autoScroll);
}

window.onload = () => {
    autoScroll();
};
