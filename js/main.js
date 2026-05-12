// ===================================
// TRENDCRAFTERS MAIN JAVASCRIPT
// E-Commerce & Interactive Features
// ===================================

class TrendCraftersApp {
    constructor() {
        this.cart = [];
        this.products = [
            { id: 1, name: 'Starter Package', price: 9999, category: 'basic' },
            { id: 2, name: 'Professional Package', price: 24999, category: 'professional' },
            { id: 3, name: 'Enterprise Package', price: 49999, category: 'enterprise' }
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCart();
        this.setupMobileMenu();
        this.setupScrollAnimations();
    }

    setupEventListeners() {
        // Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach((btn, idx) => {
            btn.addEventListener('click', () => this.addToCart(this.products[idx]));
        });

        // Cart modal
        const cartIcon = document.querySelector('.cart-icon');
        const cartModal = document.getElementById('cartModal');
        const closeBtn = document.querySelector('.close');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.openCart());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCart());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // CTA button
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when link is clicked
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .product-card, .testimonial-card').forEach(card => {
            observer.observe(card);
        });
    }

    addToCart(product) {
        const existingProduct = this.cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification('Added to cart!', 'success');
        this.updateCartCount();
    }

    openCart() {
        const modal = document.getElementById('cartModal');
        const cartItems = document.getElementById('cartItems');
        const totalPrice = document.getElementById('totalPrice');

        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
            totalPrice.textContent = '0';
            modal.style.display = 'block';
            return;
        }

        let total = 0;
        this.cart.forEach((item, idx) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.style.cssText = 'padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;';
            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <p style="color: #999; font-size: 0.9rem;">₹${item.price.toLocaleString('en-IN')} × ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                    <p style="font-weight: bold; color: #FF6B35;">₹${itemTotal.toLocaleString('en-IN')}</p>
                    <button style="background: #E74C3C; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 3px; cursor: pointer; font-size: 0.85rem;" onclick="app.removeFromCart(${idx})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        totalPrice.textContent = total.toLocaleString('en-IN');
        modal.style.display = 'block';
    }

    closeCart() {
        document.getElementById('cartModal').style.display = 'none';
    }

    removeFromCart(idx) {
        this.cart.splice(idx, 1);
        this.saveCart();
        this.openCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('trendcrafters_cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('trendcrafters_cart');
        if (saved) {
            this.cart = JSON.parse(saved);
        }
        this.updateCartCount();
    }

    updateCartCount() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            let badge = cartIcon.querySelector('.cart-badge');
            if (!badge && count > 0) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = 'background: #FF5722; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; margin-left: -10px;';
                cartIcon.appendChild(badge);
            }
            if (badge) {
                badge.textContent = count > 0 ? count : '';
            }
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty!', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const message = `I want to purchase: ${this.cart.map(item => `${item.name} (×${item.quantity})`).join(', ')}. Total: ₹${total.toLocaleString('en-IN')}`;

        // WhatsApp integration
        const phoneNumber = '977-1-XXXX-XXXX'; // Replace with actual number
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappURL, '_blank');
    }

    handleContactForm(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Collect form data
        const data = {
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            phone: form.querySelector('input[type="tel"]').value,
            message: form.querySelector('textarea').value
        };

        // Send to WhatsApp (alternative: integrate with backend service)
        const whatsappMessage = `New Contact: Name: ${data.name}, Email: ${data.email}, Phone: ${data.phone}, Message: ${data.message}`;
        
        // For now, show success message
        this.showNotification('Message sent! We will contact you soon.', 'success');
        form.reset();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#27AE60' : type === 'warning' ? '#E74C3C' : '#3498DB'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== UTILITY FUNCTIONS =====

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
}

// Lazy loading images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TrendCraftersApp();
    setupLazyLoading();
    
    // Add keyframes animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(30px);
            }
        }
    `;
    document.head.appendChild(style);
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});