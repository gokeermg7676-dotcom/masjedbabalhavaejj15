// ═══════════════════════════════════════════════════════════
// اسکریپت اصلی مسجد باب‌الحوائج (ع) - Main JavaScript
// ═══════════════════════════════════════════════════════════

// ─── Global Variables ───
let currentSlide = 0;
let slideInterval;
let currentPage = 'home';
let activeCategory = 'همه';

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initTicker();
    initSlider();
    renderFeaturedNews();
    renderLatestNews();
    renderEvents();
    renderGalleryPreview();
    renderAllNews();
    renderAllGallery();
    renderCategoryFilters();
    initScrollEffects();
    initMobileTouch();
});

// ═══════════════════════════════════════════════════════════
// Theme Toggle (Dark/Light Mode)
// ═══════════════════════════════════════════════════════════

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// ═══════════════════════════════════════════════════════════
// Navigation
// ═══════════════════════════════════════════════════════════

function navigateTo(page) {
    currentPage = page;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById('page-' + page);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-links a, .mobile-menu nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate matching links
    document.querySelectorAll('.nav-links a, .mobile-menu nav a').forEach(link => {
        if (link.textContent.includes(getPageLabel(page))) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getPageLabel(page) {
    const labels = {
        'home': 'صفحه اصلی',
        'about': 'دباره مسجد',
        'news': 'اخبار',
        'gallery': 'گالری',
        'contact': 'تماس با ما'
    };
    return labels[page] || '';
}

// ═══════════════════════════════════════════════════════════
// Mobile Menu
// ═══════════════════════════════════════════════════════════

let savedOverflow = '';

function openMobileMenu() {
    savedOverflow = document.body.style.overflow || '';
    document.getElementById('mobileMenu').classList.add('open');
    document.getElementById('mobileOverlay').classList.add('open');
    document.body.classList.add('modal-open');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileOverlay').classList.remove('open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = savedOverflow;
    if (!savedOverflow) {
        document.body.style.removeProperty('overflow');
    }
}

// ═══════════════════════════════════════════════════════════
// Breaking News Ticker
// ═══════════════════════════════════════════════════════════

function initTicker() {
    const ticker = document.getElementById('tickerContent');
    if (!ticker || typeof breakingNews === 'undefined') return;
    
    ticker.innerHTML = breakingNews.map(item => 
        `<span><i class="fa-solid fa-circle" style="font-size:6px;vertical-align:middle;margin:0 8px;color:#fbbf24;"></i>${item}</span>`
    ).join('');
}

// ═══════════════════════════════════════════════════════════
// Hero Slider
// ═══════════════════════════════════════════════════════════

function initSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider || typeof slides === 'undefined') return;
    
    // Render slides
    slider.innerHTML = slides.map((slide, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <img src="${slide.image}" alt="${slide.title}">
            <div class="overlay">
                <h2>${slide.title}</h2>
                <p>${slide.subtitle}</p>
            </div>
        </div>
    `).join('') + `
        <button class="slider-arrow prev" onclick="prevSlide()"><i class="fa-solid fa-chevron-right"></i></button>
        <button class="slider-arrow next" onclick="nextSlide()"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="slider-dots" id="sliderDots">
            ${slides.map((_, i) => `<div class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>`).join('')}
        </div>
    `;
    
    // Start auto slide
    startSlideInterval();
}

function startSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
    const total = slides.length;
    currentSlide = (currentSlide + 1) % total;
    updateSlider();
}

function prevSlide() {
    const total = slides.length;
    currentSlide = (currentSlide - 1 + total) % total;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    startSlideInterval();
}

function updateSlider() {
    document.querySelectorAll('.hero-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    document.querySelectorAll('.slider-dots .dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// ═══════════════════════════════════════════════════════════
// Render Functions
// ═══════════════════════════════════════════════════════════

function renderFeaturedNews() {
    const container = document.getElementById('featuredNews');
    if (!container || typeof newsData === 'undefined') return;
    
    const featured = newsData.filter(n => n.featured).slice(0, 3);
    container.innerHTML = featured.map(news => `
        <div class="featured-card" onclick="openNewsModal(${news.id})">
            <img src="${news.image}" alt="${news.title}">
            <div class="featured-overlay">
                <span class="cat-badge">${news.category}</span>
                <h3>${news.title}</h3>
                <p>${news.date}</p>
            </div>
        </div>
    `).join('');
}

function renderLatestNews() {
    const container = document.getElementById('latestNews');
    if (!container || typeof newsData === 'undefined') return;
    
    const latest = newsData.slice(0, 6);
    container.innerHTML = latest.map(news => createNewsCard(news)).join('');
}

function renderEvents() {
    const container = document.getElementById('upcomingEvents');
    if (!container || typeof eventsData === 'undefined') return;
    
    container.innerHTML = eventsData.map(event => `
        <div class="event-card">
            <div class="event-icon"><i class="fa-solid ${event.icon}"></i></div>
            <div class="event-info">
                <h4>${event.title}</h4>
                <div class="event-date"><i class="fa-solid fa-calendar"></i> ${event.date} | ${event.time}</div>
                <p>${event.description}</p>
            </div>
        </div>
    `).join('');
}

function renderGalleryPreview() {
    const container = document.getElementById('galleryPreview');
    if (!container || typeof galleryData === 'undefined') return;
    
    const preview = galleryData.slice(0, 6);
    container.innerHTML = preview.map(item => createGalleryItem(item)).join('');
}

function renderAllNews() {
    const container = document.getElementById('allNews');
    if (!container || typeof newsData === 'undefined') return;
    
    container.innerHTML = newsData.map(news => createNewsCard(news)).join('');
}

function renderAllGallery() {
    const container = document.getElementById('allGallery');
    if (!container || typeof galleryData === 'undefined') return;
    
    container.innerHTML = galleryData.map(item => createGalleryItem(item)).join('');
}

function renderCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    if (!container || typeof categories === 'undefined') return;
    
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === activeCategory ? 'active' : ''}" 
                onclick="filterByCategory('${cat}')">
            ${cat}
        </button>
    `).join('');
}

// ═══════════════════════════════════════════════════════════
// Card Creators
// ═══════════════════════════════════════════════════════════

function createNewsCard(news) {
    return `
        <div class="news-card" onclick="openNewsModal(${news.id})">
            <div class="card-image">
                <img src="${news.image}" alt="${news.title}" loading="lazy">
                <span class="card-badge">${news.category}</span>
            </div>
            <div class="card-body">
                <div class="card-meta">
                    <span><i class="fa-solid fa-calendar"></i> ${news.date}</span>
                    <span><i class="fa-solid fa-user"></i> ${news.author}</span>
                </div>
                <h3>${news.title}</h3>
                <p>${news.summary}</p>
                <div class="card-footer">
                    <button class="read-more-btn">
                        مشاهده خبر <i class="fa-solid fa-arrow-left"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createGalleryItem(item) {
    return `
        <div class="gallery-item" onclick="openLightbox('${item.image}', '${item.title}')">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
                <span>${item.category}</span>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════
// News Modal
// ═══════════════════════════════════════════════════════════

function openNewsModal(id) {
    const news = newsData.find(n => n.id === id);
    if (!news) return;
    
    savedOverflow = document.body.style.overflow || '';
    document.getElementById('modalImage').src = news.image;
    document.getElementById('modalTitle').textContent = news.title;
    document.getElementById('modalContent').textContent = news.content;
    document.getElementById('modalMeta').innerHTML = `
        <span><i class="fa-solid fa-calendar"></i> ${news.date}</span>
        <span><i class="fa-solid fa-user"></i> ${news.author}</span>
        <span><i class="fa-solid fa-tag"></i> ${news.category}</span>
    `;
    
    document.getElementById('newsModal').classList.add('open');
    document.body.classList.add('modal-open');
}

function closeNewsModal() {
    document.getElementById('newsModal').classList.remove('open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = savedOverflow;
    if (!savedOverflow) {
        document.body.style.removeProperty('overflow');
    }
}

// ═══════════════════════════════════════════════════════════
// Lightbox
// ═══════════════════════════════════════════════════════════

function openLightbox(imageSrc, caption) {
    savedOverflow = document.body.style.overflow || '';
    document.getElementById('lightboxImage').src = imageSrc;
    document.getElementById('lightboxCaption').textContent = caption;
    document.getElementById('lightbox').classList.add('open');
    document.body.classList.add('modal-open');
}

function closeLightbox(event) {
    if (event.target === document.getElementById('lightbox') || 
        event.target.closest('.close-lightbox')) {
        document.getElementById('lightbox').classList.remove('open');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = savedOverflow;
        if (!savedOverflow) {
            document.body.style.removeProperty('overflow');
        }
    }
}

// ═══════════════════════════════════════════════════════════
// News Search & Filter
// ═══════════════════════════════════════════════════════════

function filterNews() {
    const searchTerm = document.getElementById('newsSearch').value.toLowerCase();
    const container = document.getElementById('allNews');
    
    let filtered = newsData;
    
    // Filter by category
    if (activeCategory !== 'همه') {
        filtered = filtered.filter(n => n.category === activeCategory);
    }
    
    // Filter by search
    if (searchTerm) {
        filtered = filtered.filter(n => 
            n.title.toLowerCase().includes(searchTerm) ||
            n.summary.toLowerCase().includes(searchTerm) ||
            n.category.toLowerCase().includes(searchTerm)
        );
    }
    
    container.innerHTML = filtered.length > 0 
        ? filtered.map(news => createNewsCard(news)).join('')
        : '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);"><i class="fa-solid fa-search" style="font-size:3rem;margin-bottom:16px;display:block;opacity:0.3;"></i><p style="font-size:1.1rem;">خبری با این عنوان یافت نشد</p></div>';
}

function filterByCategory(category) {
    activeCategory = category;
    renderCategoryFilters();
    filterNews();
}

// ═══════════════════════════════════════════════════════════
// Scroll Effects
// ═══════════════════════════════════════════════════════════

function initScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        // Back to top visibility
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Navbar shadow
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════
// Keyboard Navigation
// ═══════════════════════════════════════════════════════════

document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeNewsModal();
        closeLightbox(e);
        closeMobileMenu();
    }
    
    // Arrow keys for slider
    if (currentPage === 'home') {
        if (e.key === 'ArrowRight') prevSlide();
        if (e.key === 'ArrowLeft') nextSlide();
    }
});

// ═══════════════════════════════════════════════════════════
// Mobile Touch: Ensure click events fire on Android
// ═══════════════════════════════════════════════════════════

function initMobileTouch() {
    // Empty - onclick attributes work correctly on Android now
    // that the overlay and mobile-menu use display:none instead of pointer-events:none
}

// ═══════════════════════════════════════════════════════════
// Touch Swipe for Slider (SLIDER ONLY - not global)
// ═══════════════════════════════════════════════════════════

let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isSwiping = false;
    }, { passive: true });
    
    slider.addEventListener('touchmove', function(e) {
        if (!touchStartX) return;
        const diffX = Math.abs(e.changedTouches[0].screenX - touchStartX);
        const diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);
        if (diffX > diffY && diffX > 10) {
            isSwiping = true;
        }
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        const diffX = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
        touchStartX = 0;
        isSwiping = false;
    }, { passive: true });
});

// ═══════════════════════════════════════════════════════════
// Ensure dynamically created buttons work on mobile
// ═══════════════════════════════════════════════════════════

function setupMobileTouch(selector) {
    document.querySelectorAll(selector).forEach(function(el) {
        el.addEventListener('touchend', function(e) {
            e.preventDefault();
            el.click();
        }, { passive: false });
    });
}
