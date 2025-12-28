/* =====================================================
   ARCH STUDIO - GSAP Animations
   Scroll-based animations and micro-interactions
   
   This file uses GSAP (GreenSock Animation Platform) and
   ScrollTrigger for smooth scroll-based animations.
   
   CONTENTS:
   1. ScrollTrigger Setup
   2. Hero Section Animations
   3. Section Reveal Animations
   4. Card Hover Animations
   5. Text Reveal Animations
   6. Parallax Effects
===================================================== */

// Wait for DOM and GSAP to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Skipping animations.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // =====================================================
    // 1. SCROLLTRIGGER SETUP
    // =====================================================

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    // Default animation settings
    const defaultEase = 'power3.out';
    const defaultDuration = 1;

    // =====================================================
    // 2. HERO SECTION ANIMATIONS
    // Initial load animations for the hero section
    // =====================================================

    function initHeroAnimations() {
        // Create timeline for hero animations
        const heroTl = gsap.timeline({
            defaults: { ease: defaultEase, duration: defaultDuration }
        });

        // Animate hero elements on page load
        heroTl
            .from('.hero-subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.8
            })
            .from('.hero-title', {
                y: 50,
                opacity: 0,
                duration: 1
            }, '-=0.5')
            .from('.hero-description', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.6')
            .from('.hero-buttons .btn', {
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 0.6
            }, '-=0.4')
            .from('.hero-stats .stat-item', {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6
            }, '-=0.3')
            .from('.scroll-indicator', {
                y: 20,
                opacity: 0,
                duration: 0.6
            }, '-=0.2');
    }

    // =====================================================
    // 3. SECTION REVEAL ANIMATIONS
    // Animations triggered when sections come into view
    // =====================================================

    function initSectionAnimations() {
        // Animate section tags
        gsap.utils.toArray('.section-tag').forEach(tag => {
            gsap.from(tag, {
                scrollTrigger: {
                    trigger: tag,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: defaultEase
            });
        });

        // Animate section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: defaultEase
            });
        });

        // Animate section subtitles
        gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
            gsap.from(subtitle, {
                scrollTrigger: {
                    trigger: subtitle,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: defaultEase
            });
        });
    }

    // =====================================================
    // 4. ABOUT SECTION ANIMATIONS
    // =====================================================

    function initAboutAnimations() {
        // About image reveal
        gsap.from('.about-image-wrapper', {
            scrollTrigger: {
                trigger: '.about-visual',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            x: -100,
            opacity: 0,
            duration: 1,
            ease: defaultEase
        });

        // Experience badge pop-in
        gsap.from('.about-image-overlay', {
            scrollTrigger: {
                trigger: '.about-image-overlay',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.5
        });

        // About content fade in
        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: defaultEase
        });

        // Feature items stagger
        gsap.from('.feature-item', {
            scrollTrigger: {
                trigger: '.about-features',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: defaultEase
        });
    }

    // =====================================================
    // 5. SERVICES CARDS ANIMATIONS
    // =====================================================

    function initServicesAnimations() {
        gsap.from('.service-card', {
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            stagger: {
                amount: 0.6,
                from: 'start'
            },
            duration: 0.8,
            ease: defaultEase
        });
    }

    // =====================================================
    // 6. PROJECTS ANIMATIONS
    // =====================================================

    function initProjectsAnimations() {
        // Filter buttons
        gsap.from('.filter-btn', {
            scrollTrigger: {
                trigger: '.project-filters',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: defaultEase
        });

        // Project cards
        gsap.from('.project-card', {
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            stagger: {
                amount: 0.8,
                from: 'start'
            },
            duration: 0.8,
            ease: defaultEase
        });
    }

    // =====================================================
    // 7. TESTIMONIALS ANIMATIONS
    // =====================================================

    function initTestimonialsAnimations() {
        gsap.from('.testimonial-card', {
            scrollTrigger: {
                trigger: '.testimonials-slider',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: defaultEase
        });
    }

    // =====================================================
    // 8. BLOG ANIMATIONS
    // =====================================================

    function initBlogAnimations() {
        gsap.from('.blog-card', {
            scrollTrigger: {
                trigger: '.blog-grid',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: defaultEase
        });
    }

    // =====================================================
    // 9. CONTACT SECTION ANIMATIONS
    // =====================================================

    function initContactAnimations() {
        // Contact info items
        gsap.from('.contact-item', {
            scrollTrigger: {
                trigger: '.contact-details',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: defaultEase
        });

        // Social links
        gsap.from('.social-link', {
            scrollTrigger: {
                trigger: '.social-links',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });

        // Contact form
        gsap.from('.contact-form-wrapper', {
            scrollTrigger: {
                trigger: '.contact-form-wrapper',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            x: 60,
            opacity: 0,
            duration: 1,
            ease: defaultEase
        });
    }

    // =====================================================
    // 10. NEWSLETTER ANIMATIONS
    // =====================================================

    function initNewsletterAnimations() {
        gsap.from('.newsletter-content', {
            scrollTrigger: {
                trigger: '.newsletter',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: defaultEase
        });
    }

    // =====================================================
    // 11. FOOTER ANIMATIONS
    // =====================================================

    function initFooterAnimations() {
        gsap.from('.footer-col', {
            scrollTrigger: {
                trigger: '.footer-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: defaultEase
        });
    }

    // =====================================================
    // 12. HOVER ANIMATIONS (CSS-enhanced with GSAP)
    // =====================================================

    function initHoverAnimations() {
        // Skip magnetic effects on touch devices
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Service cards hover effect
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card.querySelector('.service-icon'), {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card.querySelector('.service-icon'), {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Button hover magnetic effect (disabled on touch devices)
        if (!isTouchDevice) {
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    gsap.to(btn, {
                        x: x * 0.2,
                        y: y * 0.2,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.3,
                        ease: 'elastic.out(1, 0.5)'
                    });
                });
            });
        }
    }

    // =====================================================
    // 13. PARALLAX EFFECTS
    // Subtle parallax on scroll
    // =====================================================

    function initParallaxEffects() {
        // Parallax for about image
        gsap.to('.about-image-wrapper', {
            scrollTrigger: {
                trigger: '.about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -50
        });

        // Parallax for section backgrounds
        gsap.utils.toArray('.section').forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                backgroundPosition: '50% 100%'
            });
        });
    }

    // =====================================================
    // 14. NAVBAR ANIMATIONS
    // =====================================================

    function initNavbarAnimations() {
        const navbar = document.getElementById('navbar');

        // Initial navbar fade in (no Y movement)
        gsap.from('.navbar', {
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
        });

        // Navbar scroll animation with glassmorphism effect
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Add/remove scrolled class for glassmorphism
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Adjust opacity based on scroll direction
            if (currentScroll > lastScroll && currentScroll > 300) {
                // Scrolling down - slightly reduce opacity
                gsap.to(navbar, {
                    opacity: 0.85,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                // Scrolling up or near top - full opacity
                gsap.to(navbar, {
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }

            lastScroll = currentScroll;
        });
    }

    // =====================================================
    // 15. TEXT SPLIT ANIMATION (optional enhancement)
    // Creates letter-by-letter reveal for headings
    // =====================================================

    function initTextSplitAnimation() {
        // Only apply to hero title for performance
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        // Store original text
        const originalText = heroTitle.innerHTML;

        // We'll keep the span elements for animation but the actual
        // splitting would require additional setup
        // This is a placeholder for more advanced text animations
    }

    // =====================================================
    // 16. LOADING ANIMATION
    // Page load transition
    // =====================================================

    function initLoadingAnimation() {
        // Create loading overlay
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">◢</div>
                <div class="loader-bar">
                    <div class="loader-progress"></div>
                </div>
            </div>
        `;

        // Add loader styles
        const loaderStyles = document.createElement('style');
        loaderStyles.textContent = `
            #page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0a0f;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
            }
            .loader-content {
                text-align: center;
            }
            .loader-logo {
                font-size: 4rem;
                color: #d4af37;
                margin-bottom: 2rem;
                animation: pulse 1s ease-in-out infinite;
            }
            .loader-bar {
                width: 200px;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
            }
            .loader-progress {
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #d4af37, #e8c547);
                border-radius: 2px;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;

        document.head.appendChild(loaderStyles);
        document.body.appendChild(loader);

        // Animate loader
        gsap.to('.loader-progress', {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                gsap.to('#page-loader', {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loader.remove();
                        loaderStyles.remove();
                    }
                });
            }
        });
    }

    // =====================================================
    // INITIALIZE ALL ANIMATIONS
    // =====================================================

    // Run loading animation first
    initLoadingAnimation();

    // Initialize all animation functions after a slight delay
    setTimeout(() => {
        initHeroAnimations();
        initSectionAnimations();
        initAboutAnimations();
        initServicesAnimations();
        initProjectsAnimations();
        initTestimonialsAnimations();
        initBlogAnimations();
        initContactAnimations();
        initNewsletterAnimations();
        initFooterAnimations();
        initHoverAnimations();
        initParallaxEffects();
        initNavbarAnimations();

        console.log('✨ GSAP animations initialized successfully!');
    }, 100);
});
