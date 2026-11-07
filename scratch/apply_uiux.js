const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// ----------------------------------------------------------------
// 1. Append UI/UX CSS additions to css/style.css
// ----------------------------------------------------------------
const cssAdditions = `
/* ==========================================================================
   Scroll Progress Indicator
   ========================================================================== */
#scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background-color: var(--primary);
  z-index: 200;
  transition: width 80ms linear;
  pointer-events: none;
}

/* ==========================================================================
   Back-to-Top Button
   ========================================================================== */
#back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 150;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background-color: var(--bg-dark);
  color: var(--text-inverse);
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity var(--transition-normal),
              visibility var(--transition-normal),
              transform var(--transition-normal),
              background-color var(--transition-fast),
              border-color var(--transition-fast);
  box-shadow: var(--shadow-card);
}

#back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

#back-to-top:hover {
  background-color: var(--primary);
  border-color: var(--primary);
}

#back-to-top:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

[data-theme="dark"] #back-to-top {
  background-color: var(--bg-surface);
  color: var(--text-main);
  border-color: var(--border-subtle);
}

[data-theme="dark"] #back-to-top:hover {
  background-color: var(--primary);
  color: #FFFFFF;
  border-color: var(--primary);
}

/* ==========================================================================
   Nav Link Focus Polish
   ========================================================================== */
.nav-link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
  border-radius: 2px;
}

/* Card-level keyboard focus ring for tab navigation */
.event-card:focus-within,
.flagship-event-card:focus-within,
.supporting-event-card:focus-within {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* ==========================================================================
   Mobile: back-to-top clear of content
   ========================================================================== */
@media (max-width: 640px) {
  #back-to-top {
    bottom: 1.25rem;
    right: 1.25rem;
  }
}

/* Reduced motion overrides */
@media (prefers-reduced-motion: reduce) {
  #back-to-top {
    transition: opacity var(--transition-fast), visibility var(--transition-fast);
    transform: none !important;
  }

  #scroll-progress {
    transition: none;
  }
}
`;

let css = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');
// Avoid duplicate injection
if (!css.includes('scroll-progress')) {
  css = css.trimEnd() + '\n' + cssAdditions + '\n';
  fs.writeFileSync(path.join(rootDir, 'css/style.css'), css, 'utf8');
  console.log('✓ CSS additions appended to css/style.css');
} else {
  console.log('⚠ CSS already contains scroll-progress — skipping CSS append.');
}

// ----------------------------------------------------------------
// 2. Append JS additions to js/main.js
// ----------------------------------------------------------------
const jsAdditions = `
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
`;

const jsInit = `  initScrollProgress();\n  initBackToTop();`;

let mainJs = fs.readFileSync(path.join(rootDir, 'js/main.js'), 'utf8');
if (!mainJs.includes('initScrollProgress')) {
  // Append the functions
  mainJs = mainJs.trimEnd() + '\n' + jsAdditions + '\n';
  // Wire them into the DOMContentLoaded block
  mainJs = mainJs.replace(
    '  initScrollReveal();\n});',
    '  initScrollReveal();\n' + jsInit + '\n});'
  );
  fs.writeFileSync(path.join(rootDir, 'js/main.js'), mainJs, 'utf8');
  console.log('✓ JS additions appended to js/main.js');
} else {
  console.log('⚠ main.js already contains initScrollProgress — skipping JS append.');
}

// ----------------------------------------------------------------
// 3. Add back-to-top button HTML + scroll-progress bar to all 4 pages
// ----------------------------------------------------------------
const scrollProgressHtml = '  <!-- Scroll Progress Indicator -->\n  <div id="scroll-progress" aria-hidden="true"></div>\n';
const backToTopHtml = `
  <!-- Back-to-Top Button -->
  <button id="back-to-top" aria-label="Back to top" title="Back to top">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  </button>
`;

const htmlFiles = ['index.html', 'events.html', 'event-details.html', 'registrations.html'];
htmlFiles.forEach(file => {
  let html = fs.readFileSync(path.join(rootDir, file), 'utf8');

  if (!html.includes('id="scroll-progress"')) {
    html = html.replace('<body>\n', '<body>\n' + scrollProgressHtml);
    console.log(`✓ scroll-progress added to ${file}`);
  } else {
    console.log(`⚠ scroll-progress already in ${file}`);
  }

  if (!html.includes('id="back-to-top"')) {
    // Insert before </body>
    html = html.replace('</body>', backToTopHtml + '</body>');
    console.log(`✓ back-to-top button added to ${file}`);
  } else {
    console.log(`⚠ back-to-top already in ${file}`);
  }

  fs.writeFileSync(path.join(rootDir, file), html, 'utf8');
});

console.log('\nAll UI/UX additions applied successfully.');
