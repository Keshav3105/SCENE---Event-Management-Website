/**
 * SCENE - Main Shared Script
 * Handles navigation toggling, active page state, image fallback management, theme toggling, and scroll reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initImageFallbacks();
  initThemeToggle();
  initScrollReveal();
  initScrollProgress();
  initBackToTop();
});

/**
 * Observes elements with .reveal-on-scroll and triggers reveal animation on viewport entry.
 * Respects prefers-reduced-motion and gracefully falls back on older browsers.
 *
 * @param {HTMLElement|Document} [scope=document] - Container to search for reveal elements.
 */
function initScrollReveal(scope = document) {
  if (typeof window === 'undefined') return;

  // If user prefers reduced motion, reveal immediately without animation
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scope.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const targets = scope.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -30px 0px',
    threshold: 0.05
  });

  targets.forEach(el => observer.observe(el));
}

/**
 * Initializes Dark / Light theme toggle with LocalStorage persistence and accessibility.
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  function updateButtonState(theme) {
    const isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Sync initial state from current document theme
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  updateButtonState(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';

    if (nextTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem('scene_theme', nextTheme);
    } catch (e) {
      // Gracefully handle restricted storage environments
    }

    updateButtonState(nextTheme);
  });
}

/**
 * Initializes mobile hamburger menu toggle with keyboard/accessible attributes.
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('is-open');
  });

  // Close nav on click outside
  document.addEventListener('click', (event) => {
    if (navLinks.classList.contains('is-open') &&
        !navLinks.contains(event.target) &&
        !toggleBtn.contains(event.target)) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    }
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
      toggleBtn.focus();
    }
  });
}

/**
 * Attaches a generic error fallback handler to all event images.
 */
function initImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', function handleImgError() {
      const fallbackSrc = this.getAttribute('data-fallback') || 'assets/images/placeholder.svg';
      if (this.src !== fallbackSrc) {
        this.src = fallbackSrc;
      }
    });
  });
}

/**
 * Initializes the fixed scroll-progress indicator bar.
 */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100).toFixed(2) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/**
 * Initializes the floating back-to-top button.
 * Shows after user scrolls 300px; smooth-scrolls to top on click.
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const THRESHOLD = 300;

  function onScroll() {
    if ((window.scrollY || document.documentElement.scrollTop) > THRESHOLD) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    const prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}

