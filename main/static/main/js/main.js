// Main JavaScript - Common functionality for all pages

// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
    }
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;
    
    if (navbar) {
        navbar.classList.add('transition-transform', 'transition-opacity', 'duration-500', 'ease-in-out', 'opacity-100');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScroll - lastScroll > scrollThreshold && currentScroll > 100) {
                // scrolling down
                navbar.classList.add('-translate-y-full', 'opacity-0');
            } else if (lastScroll - currentScroll > scrollThreshold || currentScroll <= 100) {
                // scrolling up
                navbar.classList.remove('-translate-y-full', 'opacity-0');
                navbar.classList.add('opacity-100');
            }
            
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        });
    }
    
    // Prevent horizontal overflow
    document.body.style.overflowX = 'hidden';
    
    // Check for any elements causing horizontal overflow
    function checkOverflow() {
        const bodyWidth = document.body.offsetWidth;
        const windowWidth = window.innerWidth;
        
        if (bodyWidth > windowWidth) {
            console.log('Horizontal overflow detected');
            // Force body to window width
            document.body.style.width = '100vw';
            document.body.style.overflowX = 'hidden';
        }
    }
    
    // Check on load and resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
});