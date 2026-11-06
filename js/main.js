/**
 * SCENE - Main Shared Script
 * Handles navigation toggling, active page state, and image fallback management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initImageFallbacks();
});

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
