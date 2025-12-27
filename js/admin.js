/* =====================================================
   ARCH STUDIO - Admin Panel JavaScript
   
   This file handles:
   1. Authentication & Session Management
   2. Navigation & UI
   3. CRUD Operations for Content
   4. Settings Management
   5. Data Persistence (localStorage)
===================================================== */

// =====================================================
// 1. DATA STORAGE KEYS
// =====================================================
const STORAGE_KEYS = {
    SESSION: 'adminSession',
    PROJECTS: 'archstudio_projects',
    ARTICLES: 'archstudio_articles',
    SERVICES: 'archstudio_services',
    TESTIMONIALS: 'archstudio_testimonials',
    SETTINGS: 'archstudio_settings',
    SEO: 'archstudio_seo'
};

// =====================================================
// 2. INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();

    // Initialize UI
    initSidebar();
    initNavigation();
    initForms();
    initLanguage();

    // Load data
    loadAllData();
    updateDashboardStats();

    // Initialize rich text editor if available
    initRichEditor();
});

// =====================================================
// 3. AUTHENTICATION
// =====================================================

function checkAuth() {
    const session = localStorage.getItem(STORAGE_KEYS.SESSION) ||
        sessionStorage.getItem(STORAGE_KEYS.SESSION);

    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }

    try {
        const sessionData = JSON.parse(session);
        if (!sessionData.isLoggedIn) {
            window.location.href = 'admin-login.html';
            return;
        }

        // Update user name display
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = sessionData.username || 'Admin';
        }
    } catch (e) {
        window.location.href = 'admin-login.html';
    }
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.href = 'admin-login.html';
}

// =====================================================
// 4. SIDEBAR & NAVIGATION
// =====================================================

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileToggle = document.getElementById('mobileMenuToggle');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
}

function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);

            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Close mobile menu
            document.getElementById('sidebar').classList.remove('mobile-open');
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
            projects: { en: 'Manage Projects', ar: 'إدارة المشاريع' },
            articles: { en: 'Manage Articles', ar: 'إدارة المقالات' },
            services: { en: 'Manage Services', ar: 'إدارة الخدمات' },
            testimonials: { en: 'Manage Testimonials', ar: 'إدارة آراء العملاء' },
            settings: { en: 'Site Settings', ar: 'إعدادات الموقع' },
            seo: { en: 'SEO Settings', ar: 'إعدادات SEO' }
        };

        const lang = document.documentElement.lang || 'en';
        const title = titles[sectionName] || titles.dashboard;
        pageTitle.textContent = title[lang] || title.en;
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
        link.classList.toggle('active', link.dataset.section === sectionName);
    });
}

// =====================================================
// 5. LANGUAGE SWITCHER
// =====================================================

function switchLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) element.textContent = text;
    });

    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(element => {
        const placeholder = element.getAttribute(`data-${lang}-placeholder`);
        if (placeholder) element.placeholder = placeholder;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    localStorage.setItem('preferredLanguage', lang);
}

function initLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    switchLanguage(savedLang);
}

// =====================================================
// 6. MODAL MANAGEMENT
// =====================================================

function openModal(type, itemId = null) {
    const modal = document.getElementById(`${type}Modal`);
    if (!modal) return;

    // Reset form
    const form = modal.querySelector('form');
    if (form) form.reset();

    // If editing, populate form
    if (itemId) {
        populateForm(type, itemId);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function populateForm(type, itemId) {
    const storageKey = STORAGE_KEYS[type.toUpperCase() + 'S'];
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const item = items.find(i => i.id === itemId);

    if (!item) return;

    // Populate form fields based on type
    switch (type) {
        case 'project':
            document.getElementById('projectId').value = item.id;
            document.getElementById('projectTitleEn').value = item.titleEn || '';
            document.getElementById('projectTitleAr').value = item.titleAr || '';
            document.getElementById('projectCategory').value = item.category || 'residential';
            document.getElementById('projectLocation').value = item.location || '';
            document.getElementById('projectDescEn').value = item.descEn || '';
            document.getElementById('projectDescAr').value = item.descAr || '';
            document.getElementById('projectImage').value = item.image || '';
            document.getElementById('projectStatus').value = item.status || 'published';
            break;

        case 'article':
            document.getElementById('articleId').value = item.id;
            document.getElementById('articleTitleEn').value = item.titleEn || '';
            document.getElementById('articleTitleAr').value = item.titleAr || '';
            document.getElementById('articleCategory').value = item.category || 'news';
            document.getElementById('articleDate').value = item.date || '';
            document.getElementById('articleExcerptEn').value = item.excerptEn || '';
            document.getElementById('articleExcerptAr').value = item.excerptAr || '';
            document.getElementById('articleImage').value = item.image || '';
            document.getElementById('articleStatus').value = item.status || 'published';
            if (window.quillEditor) {
                window.quillEditor.root.innerHTML = item.contentEn || '';
            }
            break;

        case 'service':
            document.getElementById('serviceId').value = item.id;
            document.getElementById('serviceIcon').value = item.icon || '';
            document.getElementById('serviceTitleEn').value = item.titleEn || '';
            document.getElementById('serviceTitleAr').value = item.titleAr || '';
            document.getElementById('serviceDescEn').value = item.descEn || '';
            document.getElementById('serviceDescAr').value = item.descAr || '';
            break;

        case 'testimonial':
            document.getElementById('testimonialId').value = item.id;
            document.getElementById('testimonialNameEn').value = item.nameEn || '';
            document.getElementById('testimonialNameAr').value = item.nameAr || '';
            document.getElementById('testimonialPositionEn').value = item.positionEn || '';
            document.getElementById('testimonialPositionAr').value = item.positionAr || '';
            document.getElementById('testimonialQuoteEn').value = item.quoteEn || '';
            document.getElementById('testimonialQuoteAr').value = item.quoteAr || '';
            document.getElementById('testimonialRating').value = item.rating || '5';
            break;
    }
}

// =====================================================
// 7. FORM HANDLING
// =====================================================

function initForms() {
    // Project Form
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProject();
        });
    }

    // Article Form
    const articleForm = document.getElementById('articleForm');
    if (articleForm) {
        articleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveArticle();
        });
    }

    // Service Form
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveService();
        });
    }

    // Testimonial Form
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveTestimonial();
        });
    }
}

// =====================================================
// 8. CRUD OPERATIONS - PROJECTS
// =====================================================

function saveProject() {
    const id = document.getElementById('projectId').value || generateId();
    const project = {
        id: id,
        titleEn: document.getElementById('projectTitleEn').value,
        titleAr: document.getElementById('projectTitleAr').value,
        category: document.getElementById('projectCategory').value,
        location: document.getElementById('projectLocation').value,
        descEn: document.getElementById('projectDescEn').value,
        descAr: document.getElementById('projectDescAr').value,
        image: document.getElementById('projectImage').value,
        status: document.getElementById('projectStatus').value,
        createdAt: new Date().toISOString()
    };

    let projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');

    const existingIndex = projects.findIndex(p => p.id === id);
    if (existingIndex >= 0) {
        projects[existingIndex] = project;
    } else {
        projects.push(project);
    }

    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    closeModal('project');
    loadProjects();
    updateDashboardStats();
    showToast('Project saved successfully!');
}

function loadProjects() {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const tbody = document.getElementById('projectsTableBody');
    const emptyState = document.getElementById('projectsEmpty');

    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const lang = document.documentElement.lang || 'en';

    tbody.innerHTML = projects.map(project => `
        <tr>
            <td>
                ${project.image
            ? `<img src="${project.image}" class="table-image" alt="${project.titleEn}">`
            : '<div class="table-image" style="background: linear-gradient(45deg, #667eea, #764ba2);"></div>'
        }
            </td>
            <td>${lang === 'ar' ? project.titleAr : project.titleEn}</td>
            <td>${project.category}</td>
            <td>${project.location}</td>
            <td><span class="status-badge ${project.status}">${project.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="openModal('project', '${project.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('project', '${project.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// =====================================================
// 9. CRUD OPERATIONS - ARTICLES
// =====================================================

function saveArticle() {
    const id = document.getElementById('articleId').value || generateId();
    const article = {
        id: id,
        titleEn: document.getElementById('articleTitleEn').value,
        titleAr: document.getElementById('articleTitleAr').value,
        category: document.getElementById('articleCategory').value,
        date: document.getElementById('articleDate').value || new Date().toISOString().split('T')[0],
        excerptEn: document.getElementById('articleExcerptEn').value,
        excerptAr: document.getElementById('articleExcerptAr').value,
        contentEn: window.quillEditor ? window.quillEditor.root.innerHTML : '',
        image: document.getElementById('articleImage').value,
        status: document.getElementById('articleStatus').value,
        createdAt: new Date().toISOString()
    };

    let articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');

    const existingIndex = articles.findIndex(a => a.id === id);
    if (existingIndex >= 0) {
        articles[existingIndex] = article;
    } else {
        articles.push(article);
    }

    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));

    closeModal('article');
    loadArticles();
    updateDashboardStats();
    showToast('Article saved successfully!');
}

function loadArticles() {
    const articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
    const tbody = document.getElementById('articlesTableBody');
    const emptyState = document.getElementById('articlesEmpty');

    if (!tbody) return;

    if (articles.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const lang = document.documentElement.lang || 'en';

    tbody.innerHTML = articles.map(article => `
        <tr>
            <td>
                ${article.image
            ? `<img src="${article.image}" class="table-image" alt="${article.titleEn}">`
            : '<div class="table-image" style="background: linear-gradient(45deg, #f093fb, #f5576c);"></div>'
        }
            </td>
            <td>${lang === 'ar' ? article.titleAr : article.titleEn}</td>
            <td>${article.category}</td>
            <td>${article.date}</td>
            <td><span class="status-badge ${article.status}">${article.status}</span></td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="openModal('article', '${article.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteItem('article', '${article.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// =====================================================
// 10. CRUD OPERATIONS - SERVICES
// =====================================================

function saveService() {
    const id = document.getElementById('serviceId').value || generateId();
    const service = {
        id: id,
        icon: document.getElementById('serviceIcon').value,
        titleEn: document.getElementById('serviceTitleEn').value,
        titleAr: document.getElementById('serviceTitleAr').value,
        descEn: document.getElementById('serviceDescEn').value,
        descAr: document.getElementById('serviceDescAr').value
    };

    let services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');

    const existingIndex = services.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
        services[existingIndex] = service;
    } else {
        services.push(service);
    }

    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));

    closeModal('service');
    loadServices();
    updateDashboardStats();
    showToast('Service saved successfully!');
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
    const grid = document.getElementById('servicesGrid');
    const emptyState = document.getElementById('servicesEmpty');

    if (!grid) return;

    if (services.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const lang = document.documentElement.lang || 'en';

    grid.innerHTML = services.map(service => `
        <div class="admin-service-card">
            <div class="admin-card-actions">
                <button class="edit-btn" onclick="openModal('service', '${service.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem('service', '${service.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="service-icon" style="margin-bottom: 1rem;">
                <i class="${service.icon || 'fas fa-cog'}"></i>
            </div>
            <h4>${lang === 'ar' ? service.titleAr : service.titleEn}</h4>
            <p style="font-size: 0.875rem; color: var(--gray-400);">
                ${lang === 'ar' ? service.descAr : service.descEn}
            </p>
        </div>
    `).join('');
}

// =====================================================
// 11. CRUD OPERATIONS - TESTIMONIALS
// =====================================================

function saveTestimonial() {
    const id = document.getElementById('testimonialId').value || generateId();
    const testimonial = {
        id: id,
        nameEn: document.getElementById('testimonialNameEn').value,
        nameAr: document.getElementById('testimonialNameAr').value,
        positionEn: document.getElementById('testimonialPositionEn').value,
        positionAr: document.getElementById('testimonialPositionAr').value,
        quoteEn: document.getElementById('testimonialQuoteEn').value,
        quoteAr: document.getElementById('testimonialQuoteAr').value,
        rating: document.getElementById('testimonialRating').value
    };

    let testimonials = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');

    const existingIndex = testimonials.findIndex(t => t.id === id);
    if (existingIndex >= 0) {
        testimonials[existingIndex] = testimonial;
    } else {
        testimonials.push(testimonial);
    }

    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));

    closeModal('testimonial');
    loadTestimonials();
    updateDashboardStats();
    showToast('Testimonial saved successfully!');
}

function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');
    const grid = document.getElementById('testimonialsGrid');
    const emptyState = document.getElementById('testimonialsEmpty');

    if (!grid) return;

    if (testimonials.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const lang = document.documentElement.lang || 'en';

    grid.innerHTML = testimonials.map(t => `
        <div class="admin-testimonial-card">
            <div class="admin-card-actions">
                <button class="edit-btn" onclick="openModal('testimonial', '${t.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem('testimonial', '${t.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="stars" style="color: var(--accent); margin-bottom: 0.5rem;">
                ${'<i class="fas fa-star"></i>'.repeat(parseInt(t.rating))}
            </div>
            <p style="font-style: italic; margin-bottom: 1rem;">
                "${lang === 'ar' ? t.quoteAr : t.quoteEn}"
            </p>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="author-avatar" style="width: 40px; height: 40px; font-size: 0.875rem;">
                    ${(lang === 'ar' ? t.nameAr : t.nameEn).split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                    <strong>${lang === 'ar' ? t.nameAr : t.nameEn}</strong>
                    <p style="font-size: 0.75rem; color: var(--gray-400); margin: 0;">
                        ${lang === 'ar' ? t.positionAr : t.positionEn}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

// =====================================================
// 12. DELETE ITEM
// =====================================================

function deleteItem(type, id) {
    const lang = document.documentElement.lang || 'en';
    const confirmMsg = lang === 'ar'
        ? 'هل أنت متأكد من حذف هذا العنصر؟'
        : 'Are you sure you want to delete this item?';

    if (!confirm(confirmMsg)) return;

    const storageKey = STORAGE_KEYS[type.toUpperCase() + 'S'];
    let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    items = items.filter(item => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(items));

    // Reload the appropriate section
    switch (type) {
        case 'project': loadProjects(); break;
        case 'article': loadArticles(); break;
        case 'service': loadServices(); break;
        case 'testimonial': loadTestimonials(); break;
    }

    updateDashboardStats();
    showToast(lang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully');
}

// =====================================================
// 13. SETTINGS MANAGEMENT
// =====================================================

function saveSettings() {
    const settings = {
        hero: {
            subtitleEn: document.getElementById('heroSubtitleEn')?.value,
            subtitleAr: document.getElementById('heroSubtitleAr')?.value,
            titleEn: document.getElementById('heroTitleEn')?.value,
            titleAr: document.getElementById('heroTitleAr')?.value,
            descEn: document.getElementById('heroDescEn')?.value,
            descAr: document.getElementById('heroDescAr')?.value
        },
        stats: {
            projects: document.getElementById('statProjects')?.value,
            years: document.getElementById('statYears')?.value,
            awards: document.getElementById('statAwards')?.value
        },
        contact: {
            addressEn: document.getElementById('contactAddressEn')?.value,
            addressAr: document.getElementById('contactAddressAr')?.value,
            phone: document.getElementById('contactPhone')?.value,
            email: document.getElementById('contactEmail')?.value,
            hoursEn: document.getElementById('contactHoursEn')?.value,
            hoursAr: document.getElementById('contactHoursAr')?.value
        },
        social: {
            facebook: document.getElementById('socialFacebook')?.value,
            instagram: document.getElementById('socialInstagram')?.value,
            linkedin: document.getElementById('socialLinkedin')?.value,
            twitter: document.getElementById('socialTwitter')?.value
        }
    };

    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    showToast('Settings saved successfully!');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');

    // Populate form fields if settings exist
    if (settings.hero) {
        if (document.getElementById('heroSubtitleEn'))
            document.getElementById('heroSubtitleEn').value = settings.hero.subtitleEn || '';
        if (document.getElementById('heroSubtitleAr'))
            document.getElementById('heroSubtitleAr').value = settings.hero.subtitleAr || '';
        // ... continue for other fields
    }
}

// =====================================================
// 14. SEO SETTINGS
// =====================================================

function saveSEOSettings() {
    const seo = {
        title: document.getElementById('seoTitle')?.value,
        description: document.getElementById('seoDescription')?.value,
        keywords: document.getElementById('seoKeywords')?.value,
        ogTitle: document.getElementById('ogTitle')?.value,
        ogDescription: document.getElementById('ogDescription')?.value,
        ogImage: document.getElementById('ogImage')?.value,
        schemaType: document.getElementById('schemaType')?.value,
        serviceArea: document.getElementById('serviceArea')?.value
    };

    localStorage.setItem(STORAGE_KEYS.SEO, JSON.stringify(seo));
    showToast('SEO settings saved successfully!');
}

// =====================================================
// 15. DASHBOARD STATS
// =====================================================

function updateDashboardStats() {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const articles = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTICLES) || '[]');
    const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
    const testimonials = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');

    const projectsCount = document.getElementById('projectsCount');
    const articlesCount = document.getElementById('articlesCount');
    const servicesCount = document.getElementById('servicesCount');
    const testimonialsCount = document.getElementById('testimonialsCount');

    if (projectsCount) projectsCount.textContent = projects.length;
    if (articlesCount) articlesCount.textContent = articles.length;
    if (servicesCount) servicesCount.textContent = services.length;
    if (testimonialsCount) testimonialsCount.textContent = testimonials.length;
}

// =====================================================
// 16. LOAD ALL DATA
// =====================================================

function loadAllData() {
    loadProjects();
    loadArticles();
    loadServices();
    loadTestimonials();
    loadSettings();
}

// =====================================================
// 17. RICH TEXT EDITOR
// =====================================================

function initRichEditor() {
    const editorElement = document.getElementById('articleContentEn');
    if (editorElement && typeof Quill !== 'undefined') {
        window.quillEditor = new Quill('#articleContentEn', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });
    }
}

// =====================================================
// 18. UTILITY FUNCTIONS
// =====================================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.admin-modal.active').forEach(modal => {
            const type = modal.id.replace('Modal', '');
            closeModal(type);
        });
    }
});

// Make functions available globally
window.switchLanguage = switchLanguage;
window.showSection = showSection;
window.openModal = openModal;
window.closeModal = closeModal;
window.deleteItem = deleteItem;
window.saveSettings = saveSettings;
window.saveSEOSettings = saveSEOSettings;
window.logout = logout;
