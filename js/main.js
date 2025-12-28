/* =====================================================
   ARCH STUDIO - Three.js 3D Scene
   Main JavaScript File
   
   This file contains:
   1. Galaxy/Stars Background Animation
   2. 3D Building Models for Projects
   3. Language Switcher
   4. Navigation & UI Interactions
   5. Form Handling
   6. Chat Widget
===================================================== */

// =====================================================
// GLOBAL VARIABLES
// =====================================================
let galaxyScene, galaxyCamera, galaxyRenderer;
let stars = [];
let mouseX = 0, mouseY = 0;
let currentLanguage = 'en';

// Mobile detection for performance optimization
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// =====================================================
// 1. GALAXY BACKGROUND ANIMATION
// Uses Three.js to create an animated starfield
// =====================================================

function initGalaxy() {
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas) return;

    // Create Scene
    galaxyScene = new THREE.Scene();

    // Create Camera
    galaxyCamera = new THREE.PerspectiveCamera(
        75,                                    // Field of View
        window.innerWidth / window.innerHeight, // Aspect Ratio
        0.1,                                   // Near clipping plane
        1000                                   // Far clipping plane
    );
    galaxyCamera.position.z = 5;

    // Create Renderer
    galaxyRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    galaxyRenderer.setSize(window.innerWidth, window.innerHeight);
    galaxyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Stars
    createStars();

    // Create Nebula/Galaxy Effect
    createNebula();

    // Start Animation Loop
    animateGalaxy();

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize);

    // Track Mouse Movement for Parallax Effect
    document.addEventListener('mousemove', onMouseMove);
}

function createStars() {
    // Reduce star count on mobile for better performance
    const starCount = isMobile ? 500 : 3000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    // Gold color for accent stars
    const goldColor = new THREE.Color(0xd4af37);
    const whiteColor = new THREE.Color(0xffffff);
    const blueColor = new THREE.Color(0x667eea);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;

        // Random position in 3D space
        positions[i3] = (Math.random() - 0.5) * 50;
        positions[i3 + 1] = (Math.random() - 0.5) * 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;

        // Random color (mostly white, some gold, some blue)
        const colorChoice = Math.random();
        let color;
        if (colorChoice > 0.95) {
            color = goldColor;
        } else if (colorChoice > 0.85) {
            color = blueColor;
        } else {
            color = whiteColor;
        }

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Random size
        sizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for twinkling effect
    const starMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    starField.name = 'starField';
    galaxyScene.add(starField);
    stars.push(starField);
}

function createNebula() {
    // Create subtle nebula clouds using particle system
    const nebulaCount = 500;
    const nebulaGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 20 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0x667eea,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    nebula.name = 'nebula';
    galaxyScene.add(nebula);
}

function animateGalaxy() {
    requestAnimationFrame(animateGalaxy);

    // Rotate star field slowly
    const starField = galaxyScene.getObjectByName('starField');
    if (starField) {
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.0001;
    }

    // Rotate nebula
    const nebula = galaxyScene.getObjectByName('nebula');
    if (nebula) {
        nebula.rotation.y += 0.0003;
        nebula.rotation.z += 0.0001;
    }

    // Parallax effect based on mouse position (disabled on mobile for performance)
    if (!isMobile) {
        galaxyCamera.position.x += (mouseX * 0.5 - galaxyCamera.position.x) * 0.02;
        galaxyCamera.position.y += (-mouseY * 0.5 - galaxyCamera.position.y) * 0.02;
        galaxyCamera.lookAt(galaxyScene.position);
    }

    galaxyRenderer.render(galaxyScene, galaxyCamera);
}

function onWindowResize() {
    galaxyCamera.aspect = window.innerWidth / window.innerHeight;
    galaxyCamera.updateProjectionMatrix();
    galaxyRenderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
}

// =====================================================
// 2. PROJECT 3D BUILDINGS
// Creates animated 3D building models for project cards
// =====================================================

class BuildingModel {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.type = type;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.building = null;
        this.isHovered = false;

        this.init();
    }

    init() {
        // Create Scene
        this.scene = new THREE.Scene();

        // Create Camera
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);
        this.camera.position.set(3, 2, 3);
        this.camera.lookAt(0, 0.5, 0);

        // Create Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.updateRendererSize();

        // Add Lights
        this.addLights();

        // Create Building based on type
        this.createBuilding();

        // Start Animation
        this.animate();

        // Add event listeners
        this.canvas.addEventListener('mouseenter', () => this.isHovered = true);
        this.canvas.addEventListener('mouseleave', () => this.isHovered = false);
    }

    addLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional Light (main)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);

        // Accent Light (gold)
        const accentLight = new THREE.PointLight(0xd4af37, 0.5, 10);
        accentLight.position.set(-2, 3, 2);
        this.scene.add(accentLight);
    }

    createBuilding() {
        const buildingGroup = new THREE.Group();

        // Building materials
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.7,
            envMapIntensity: 1
        });

        const concreteMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            metalness: 0.1,
            roughness: 0.8
        });

        const goldMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2
        });

        // CHANGE: Different building types for different projects
        switch (this.type) {
            case 'tower':
                // Modern skyscraper
                const towerBase = new THREE.Mesh(
                    new THREE.BoxGeometry(1, 0.3, 1),
                    concreteMaterial
                );
                towerBase.position.y = 0.15;
                buildingGroup.add(towerBase);

                const tower = new THREE.Mesh(
                    new THREE.BoxGeometry(0.7, 3, 0.7),
                    glassMaterial
                );
                tower.position.y = 1.8;
                buildingGroup.add(tower);

                // Gold accent on top
                const towerTop = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.2, 0.5),
                    goldMaterial
                );
                towerTop.position.y = 3.4;
                buildingGroup.add(towerTop);
                break;

            case 'office':
                // Office building with stepped design
                for (let i = 0; i < 3; i++) {
                    const size = 1 - i * 0.2;
                    const floor = new THREE.Mesh(
                        new THREE.BoxGeometry(size, 0.8, size),
                        i % 2 === 0 ? glassMaterial : concreteMaterial
                    );
                    floor.position.y = 0.4 + i * 0.8;
                    buildingGroup.add(floor);
                }
                break;

            case 'museum':
                // Modern museum with curved roof
                const museumBase = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 0.6, 1),
                    concreteMaterial
                );
                museumBase.position.y = 0.3;
                buildingGroup.add(museumBase);

                const museumRoof = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32, 1, false, 0, Math.PI),
                    goldMaterial
                );
                museumRoof.rotation.z = Math.PI / 2;
                museumRoof.rotation.y = Math.PI / 2;
                museumRoof.position.y = 0.7;
                buildingGroup.add(museumRoof);
                break;

            case 'villa':
                // Luxury villa
                const villaMain = new THREE.Mesh(
                    new THREE.BoxGeometry(1.2, 0.8, 0.8),
                    concreteMaterial
                );
                villaMain.position.y = 0.4;
                buildingGroup.add(villaMain);

                const villaRoof = new THREE.Mesh(
                    new THREE.ConeGeometry(0.9, 0.4, 4),
                    goldMaterial
                );
                villaRoof.rotation.y = Math.PI / 4;
                villaRoof.position.y = 1;
                buildingGroup.add(villaRoof);

                // Pool
                const pool = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 0.05, 0.4),
                    new THREE.MeshStandardMaterial({ color: 0x4fc3f7 })
                );
                pool.position.set(0.3, 0.03, 0.8);
                buildingGroup.add(pool);
                break;

            case 'mall':
                // Shopping mall
                const mallBase = new THREE.Mesh(
                    new THREE.BoxGeometry(2, 0.8, 1.2),
                    glassMaterial
                );
                mallBase.position.y = 0.4;
                buildingGroup.add(mallBase);

                // Entrance
                const entrance = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 1, 0.3),
                    goldMaterial
                );
                entrance.position.set(0, 0.5, 0.75);
                buildingGroup.add(entrance);
                break;

            case 'library':
                // Modern library with geometric design
                const libMain = new THREE.Mesh(
                    new THREE.BoxGeometry(1.4, 1.2, 1),
                    concreteMaterial
                );
                libMain.position.y = 0.6;
                buildingGroup.add(libMain);

                // Glass facade
                const libGlass = new THREE.Mesh(
                    new THREE.BoxGeometry(1.3, 1, 0.1),
                    glassMaterial
                );
                libGlass.position.set(0, 0.5, 0.55);
                buildingGroup.add(libGlass);

                // Decorative element
                const libAccent = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 1.4, 0.2),
                    goldMaterial
                );
                libAccent.position.set(-0.6, 0.7, 0.5);
                buildingGroup.add(libAccent);
                break;

            default:
                // Generic building
                const generic = new THREE.Mesh(
                    new THREE.BoxGeometry(1, 1.5, 1),
                    glassMaterial
                );
                generic.position.y = 0.75;
                buildingGroup.add(generic);
        }

        // Add ground plane
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 4),
            new THREE.MeshStandardMaterial({
                color: 0x1a1a2e,
                roughness: 0.9
            })
        );
        ground.rotation.x = -Math.PI / 2;
        buildingGroup.add(ground);

        this.building = buildingGroup;
        this.scene.add(buildingGroup);
    }

    updateRendererSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.renderer.setSize(rect.width, rect.height);
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.building) {
            // Slow rotation
            const rotationSpeed = this.isHovered ? 0.02 : 0.005;
            this.building.rotation.y += rotationSpeed;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize all project building models
function initProjectBuildings() {
    // Skip 3D buildings on mobile for performance - CSS fallback handles it
    if (isMobile) {
        console.log('📱 Mobile detected: Using CSS fallback for project cards');
        return;
    }

    const projectCanvases = document.querySelectorAll('.project-canvas');

    projectCanvases.forEach(canvas => {
        const modelType = canvas.dataset.model || 'tower';
        new BuildingModel(canvas, modelType);
    });
}

// =====================================================
// 3. LANGUAGE SWITCHER
// Handles bilingual content (English/Arabic)
// =====================================================

function switchLanguage(lang) {
    currentLanguage = lang;

    // Update HTML direction and font
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) {
            element.placeholder = placeholder;
        }
    });

    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', lang);
}

function initLanguage() {
    // Check for saved preference or browser language
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    const initialLang = savedLang || browserLang;

    switchLanguage(initialLang);
}

// =====================================================
// 4. NAVIGATION & UI INTERACTIONS
// =====================================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll Effect - Add background to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// =====================================================
// 5. PROJECT FILTERS
// =====================================================

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// =====================================================
// 6. FORM HANDLING
// =====================================================

function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // CHANGE: Replace with your form submission logic
            // For now, just show a success message
            const formData = new FormData(contactForm);
            console.log('Contact Form Data:', Object.fromEntries(formData));

            // Show success message
            showNotification(
                currentLanguage === 'ar'
                    ? 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.'
                    : 'Your request has been sent successfully! We will contact you soon.',
                'success'
            );

            contactForm.reset();
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = newsletterForm.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);

            showNotification(
                currentLanguage === 'ar'
                    ? 'شكراً لاشتراكك في نشرتنا البريدية!'
                    : 'Thank you for subscribing to our newsletter!',
                'success'
            );

            newsletterForm.reset();
        });
    }

    // Booking Form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            console.log('Booking Data:', Object.fromEntries(formData));

            showNotification(
                currentLanguage === 'ar'
                    ? 'تم حجز موعدك بنجاح!'
                    : 'Your appointment has been booked successfully!',
                'success'
            );

            closeBookingModal();
            bookingForm.reset();
        });
    }
}

// =====================================================
// 7. CHAT WIDGET
// =====================================================

function initChatWidget() {
    const chatToggle = document.getElementById('chatToggle');
    const chatBox = document.getElementById('chatBox');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    // Toggle chat box
    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatBox.classList.toggle('active');
        });
    }

    // Close chat box
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });
    }

    // Send message
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            addChatMessage(message, 'user');
            chatInput.value = '';

            // Simulate bot response
            setTimeout(() => {
                const botResponses = currentLanguage === 'ar'
                    ? [
                        'شكراً لتواصلك معنا! سيقوم أحد ممثلينا بالرد عليك قريباً.',
                        'نحن سعداء بمساعدتك! هل يمكنك إخبارنا المزيد عن مشروعك؟',
                        'شكراً على رسالتك. فريقنا متاح للإجابة على استفساراتك.'
                    ]
                    : [
                        'Thank you for reaching out! One of our representatives will get back to you shortly.',
                        'We\'re happy to help! Can you tell us more about your project?',
                        'Thanks for your message. Our team is available to answer your questions.'
                    ];

                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addChatMessage(randomResponse, 'bot');
            }, 1000);
        });
    }

    function addChatMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// =====================================================
// 8. BOOKING MODAL
// =====================================================

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBookingModal();
    }
});

// =====================================================
// 9. NOTIFICATION SYSTEM
// =====================================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    // Add RTL support
    if (document.documentElement.dir === 'rtl') {
        notification.style.right = 'auto';
        notification.style.left = '20px';
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to page
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    html[dir="rtl"] .notification {
        animation-name: slideInRTL !important;
    }
    @keyframes slideInRTL {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .notification button {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1rem;
    }
`;
document.head.appendChild(notificationStyles);

// =====================================================
// 10. COUNTER ANIMATION
// Animates the statistics numbers
// =====================================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const options = {
        root: null,
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// =====================================================
// 11. SMOOTH SCROLL
// =====================================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initGalaxy();
    initProjectBuildings();
    initLanguage();
    initNavigation();
    initProjectFilters();
    initForms();
    initChatWidget();
    initCounters();
    initSmoothScroll();

    console.log('🏛️ Arch Studio website initialized successfully!');
});

// Make functions available globally
window.switchLanguage = switchLanguage;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
