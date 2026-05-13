// Lazy Loading Optimization for Images
// Implements Intersection Observer for efficient lazy-loading

document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images with loading="lazy" attribute
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        console.log('Native lazy loading supported');
    } else {
        // Fallback for older browsers using Intersection Observer
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Optimize background images
    const elementsWithBgImages = document.querySelectorAll('[data-bg]');
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const bgUrl = el.dataset.bg;
                    if (bgUrl) {
                        el.style.backgroundImage = `url('${bgUrl}')`;
                        bgObserver.unobserve(el);
                    }
                }
            });
        }, { rootMargin: '50px' });
        
        elementsWithBgImages.forEach(el => bgObserver.observe(el));
    }
});
