/* ==========================================================================
   Aurelia Academy & International School - Main JavaScript
   Author: Senior Frontend Developer & UI/UX Designer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Page Loading Screen
     ------------------------------------------------------------------------ */
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 400);
    });
    // Fallback if load already fired
    setTimeout(() => {
      if (!loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
      }
    }, 1500);
  }

  /* ------------------------------------------------------------------------
     2. Dark / Light Mode Theme Switcher
     ------------------------------------------------------------------------ */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('aurelia-theme') || 'light';

  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcons('light');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('aurelia-theme', 'light');
        updateThemeIcons('light');
        showToast('Switched to Light Theme ☀️');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('aurelia-theme', 'dark');
        updateThemeIcons('dark');
        showToast('Switched to Dark Theme 🌙');
      }
    });
  });

  function updateThemeIcons(theme) {
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Sticky Navigation Header
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Mobile Drawer Navigation
     ------------------------------------------------------------------------ */
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.mobile-drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      if (drawerBackdrop) drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeMobileMenu = () => {
      mobileDrawer.classList.remove('open');
      if (drawerBackdrop) drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
  }

  /* ------------------------------------------------------------------------
     5. Active Page Link Highlighting
     ------------------------------------------------------------------------ */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------------
     6. Scroll Reveal Animations (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ------------------------------------------------------------------------
     7. Animated Stat Counters
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target') || '100', 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = prefix + target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }
    }, stepTime);
  }

  /* ------------------------------------------------------------------------
     8. FAQ Accordion Logic
     ------------------------------------------------------------------------ */
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      const isActive = faqItem.classList.contains('active');

      // Close all other items in the same wrapper
      const allItems = faqItem.parentElement.querySelectorAll('.faq-item');
      allItems.forEach(item => {
        item.classList.remove('active');
        const body = item.querySelector('.faq-body');
        if (body) body.style.maxHeight = null;
      });

      if (!isActive) {
        faqItem.classList.add('active');
        if (faqBody) {
          faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     9. Interactive Program / Gallery Filters
     ------------------------------------------------------------------------ */
  const tabButtons = document.querySelectorAll('.tab-btn[data-filter]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      const filterGroup = btn.getAttribute('data-group') || 'default';
      
      // Active state for siblings
      const siblingBtns = btn.parentElement.querySelectorAll('.tab-btn');
      siblingBtns.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');

      // Target items filtering
      const items = document.querySelectorAll(`[data-category-item="${filterGroup}"]`);
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     10. Gallery Lightbox Modal
     ------------------------------------------------------------------------ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  let currentImageIndex = 0;
  const imageList = [];

  if (galleryItems.length > 0 && lightboxModal) {
    const lightboxImg = lightboxModal.querySelector('.lightbox-img');
    const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
    const closeBtn = lightboxModal.querySelector('.lightbox-close');
    const prevBtn = lightboxModal.querySelector('.lightbox-prev');
    const nextBtn = lightboxModal.querySelector('.lightbox-next');

    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const cat = item.querySelector('.gallery-cat')?.textContent || '';

      if (img) {
        imageList.push({ src: img.src, caption: `${title} - ${cat}` });
      }

      item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
      });
    });

    function openLightbox() {
      if (imageList[currentImageIndex]) {
        lightboxImg.src = imageList[currentImageIndex].src;
        lightboxCaption.textContent = imageList[currentImageIndex].caption;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % imageList.length;
      openLightbox();
    }

    function showPrevImage() {
      currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
      openLightbox();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }

  /* ------------------------------------------------------------------------
     11. Generic Modal Trigger (Admission Form, Enquire Now)
     ------------------------------------------------------------------------ */
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close-btn')) {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     12. Form Validation & Toast Feedback
     ------------------------------------------------------------------------ */
  const forms = document.querySelectorAll('.validate-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const value = input.value.trim();

        if (!value) {
          setError(formGroup, 'This field is required.');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(value)) {
          setError(formGroup, 'Please enter a valid email address.');
          isValid = false;
        } else if (input.type === 'tel' && !validatePhone(value)) {
          setError(formGroup, 'Please enter a valid 10-digit phone number.');
          isValid = false;
        } else {
          clearError(formGroup);
        }
      });

      if (isValid) {
        showToast('Thank you! Your submission has been received. Our team will contact you shortly. ✨');
        form.reset();
        const activeModal = form.closest('.modal-overlay');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  function setError(formGroup, msg) {
    if (!formGroup) return;
    formGroup.classList.add('error');
    const errorEl = formGroup.querySelector('.error-message');
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(formGroup) {
    if (!formGroup) return;
    formGroup.classList.remove('error');
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[0-9+\s-]{7,15}$/.test(phone);
  }

  /* ------------------------------------------------------------------------
     13. Back to Top Button
     ------------------------------------------------------------------------ */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     14. Global Toast Notification System
     ------------------------------------------------------------------------ */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-gold); font-size: 1.2rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }
});
