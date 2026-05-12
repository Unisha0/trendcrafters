// Animation-specific JavaScript

// Mobile "Services" dropdown toggle with smooth animation
document.addEventListener('DOMContentLoaded', function() {
    const mobileServicesBtn = document.getElementById('mobile-services-btn');
    const mobileServicesMenu = document.getElementById('mobile-services-menu');
    const mobileServicesIcon = document.getElementById('mobile-services-icon');
    
    if (mobileServicesBtn) {
        mobileServicesBtn.addEventListener('click', () => {
            const isOpen = mobileServicesMenu.classList.contains('max-h-0');
            
            if (isOpen) {
                mobileServicesMenu.classList.remove('max-h-0');
                mobileServicesMenu.classList.add('max-h-96'); // smoothly expand
                mobileServicesIcon.classList.add('rotate-180');
            } else {
                mobileServicesMenu.classList.remove('max-h-96');
                mobileServicesMenu.classList.add('max-h-0'); // smoothly collapse
                mobileServicesIcon.classList.remove('rotate-180');
            }
        });
    }
    
    // Video lazy loading
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.setAttribute('loading', 'lazy');
    });
    
    // Image lazy loading — skip images already marked as eager (e.g. the navbar logo)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.getAttribute('loading') !== 'eager') {
            img.setAttribute('loading', 'lazy');
        }
    });
});