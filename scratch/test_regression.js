/**
 * SCENE — Full Regression Test Suite
 * Tests all implemented features across all 10 project domains.
 */
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');

let passed = 0, failed = 0;
function check(label, fn) {
  try { fn(); console.log('  PASS  ' + label); passed++; }
  catch (e) { console.error('  FAIL  ' + label + '\n         ' + e.message); failed++; }
}

// ── helpers ──────────────────────────────────────────────────────────────────
const readHtml  = f => fs.readFileSync(path.join(root, f), 'utf8');
const readJs    = f => fs.readFileSync(path.join(root, 'js', f), 'utf8');
const readCss   = ()  => fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8').replace(/\r\n/g, '\n');
const pages     = ['index.html','events.html','event-details.html','registrations.html'];

// Build a lightweight browser-like sandbox for running JS files
function buildSandbox(extraGlobals = {}) {
  const localStorage = (() => {
    const store = {};
    return {
      getItem: k => store[k] ?? null,
      setItem: (k,v) => { store[k] = String(v); },
      removeItem: k => { delete store[k]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    };
  })();

  return vm.createContext({
    window: { location: { search: '' }, matchMedia: () => ({ matches: false }), scrollY: 0, innerHeight: 800, scrollTo: () => {} },
    document: {
      getElementById: () => null,
      querySelectorAll: () => [],
      querySelector: () => null,
      addEventListener: () => {},
      documentElement: { getAttribute: () => null, setAttribute: () => {}, removeAttribute: () => {} }
    },
    URLSearchParams: class {
      constructor() {}
      get() { return null; }
    },
    localStorage, Date, Math, String, Number, Boolean, Array, Object, JSON,
    isNaN, parseInt, parseFloat, setTimeout: () => {}, setInterval: () => 0,
    clearInterval: () => {}, clearTimeout: () => {},
    console: { log: () => {}, error: () => {}, warn: () => {} },
    ...extraGlobals
  });
}

function runInSandbox(code, ctx) {
  vm.runInContext(code, ctx, { timeout: 2000 });
  return ctx;
}

// =============================================================================
console.log('\n━━━ Suite 1 · HTML Structure & Head Consistency ━━━');
// =============================================================================
pages.forEach(p => {
  const h = readHtml(p);
  check(`${p}: has DOCTYPE`, () => assert(h.startsWith('<!DOCTYPE html>') || h.startsWith('<!DOCTYPE HTML>')));
  check(`${p}: font preconnect to googleapis`, () => assert(h.includes('fonts.googleapis.com')));
  check(`${p}: font preconnect to gstatic`, () => assert(h.includes('fonts.gstatic.com')));
  check(`${p}: display=block font link`, () => assert(h.includes('display=block')));
  check(`${p}: theme pre-check script`, () => assert(h.includes("localStorage.getItem('scene_theme')")));
  check(`${p}: theme toggle button`, () => assert(h.includes('id="theme-toggle-btn"')));
  check(`${p}: skip link`, () => assert(h.includes('skip-link')));
  check(`${p}: scroll-progress div`, () => assert(h.includes('id="scroll-progress"')));
  check(`${p}: back-to-top button`, () => assert(h.includes('id="back-to-top"')));
});

// =============================================================================
console.log('\n━━━ Suite 2 · CSS Design System & Theme Tokens ━━━');
// =============================================================================
const css = readCss();
check('No @import url() in stylesheet (avoids font-swap waterfall)', () => assert(!css.includes('@import url(')));
check('--primary variable defined (#C6532D)', () => assert(css.includes('--primary: #C6532D')));
check('--font-serif defined', () => assert(css.includes("'Playfair Display'")));
check('--font-sans defined', () => assert(css.includes("'Plus Jakarta Sans'")));
check('.section-subtitle max-width ≥ 640px (line-wrap shift fix)', () => {
  const m = css.match(/\.section-subtitle\s*\{[^}]+max-width:\s*(\d+)px/);
  assert(m && parseInt(m[1]) >= 640, 'max-width is ' + (m ? m[1] : 'not found'));
});
check('.modal-dialog uses var(--bg-card) not #FFFFFF', () => {
  const idx = css.indexOf('.modal-dialog {');
  const block = css.substring(idx, idx + 300);
  assert(block.includes('var(--bg-card)'));
  assert(!block.includes('#FFFFFF'));
});
check('[data-theme="dark"] block present', () => assert(css.includes('[data-theme="dark"] {')));
check('--text-inverse in dark is warm ivory (#F3ECE1)', () => {
  const dark = css.substring(css.indexOf('[data-theme="dark"] {'));
  assert(dark.includes('--text-inverse: #F3ECE1'));
});
check('[data-theme="dark"] .modal-dialog styled for dark mode', () => assert(css.includes('[data-theme="dark"] .modal-dialog')));
check('.reveal-on-scroll defined', () => assert(css.includes('.reveal-on-scroll')));
check('.is-revealed defined', () => assert(css.includes('.is-revealed')));
check('@media prefers-reduced-motion handled', () => assert(css.includes('prefers-reduced-motion')));
check('#scroll-progress CSS defined', () => assert(css.includes('#scroll-progress')));
check('#back-to-top CSS defined', () => assert(css.includes('#back-to-top')));
check('#back-to-top.is-visible defined', () => assert(css.includes('#back-to-top.is-visible')));
check('.nav-link:focus-visible defined', () => assert(css.includes('.nav-link:focus-visible')));

// =============================================================================
console.log('\n━━━ Suite 3 · Event Data & Discovery (events.js) ━━━');
// =============================================================================
const eventsCode = readJs('events.js');
const evCtx = buildSandbox();
runInSandbox(eventsCode, evCtx);

const allEvents = evCtx.getAllEvents();
check('getAllEvents() returns an array', () => assert(Array.isArray(allEvents)));
check('Has exactly 8 events in dataset', () => assert.strictEqual(allEvents.length, 8));

const requiredIds = ['tech-01','cult-01','sport-01','work-01','tech-02','cult-02','sport-02','work-02'];
requiredIds.forEach(id => {
  check(`Event ID ${id} exists in dataset`, () => assert(allEvents.some(e => e.id === id)));
});

const requiredFields = ['id','title','category','date','time','venue','image','price','capacity','featured','flagship','shortDescription','fullDescription','highlights','eligibility'];
allEvents.forEach(ev => {
  requiredFields.forEach(f => {
    check(`Event ${ev.id} has field: ${f}`, () => assert(ev.hasOwnProperty(f) && ev[f] !== undefined && ev[f] !== ''));
  });
});

check('getEventById returns correct event for tech-01', () => {
  const ev = evCtx.getEventById('tech-01');
  assert(ev && ev.id === 'tech-01');
});
check('getEventById returns null/undefined for unknown ID', () => {
  const result = evCtx.getEventById('invalid-999');
  assert(result === null || result === undefined);
});
check('filterEvents with empty query returns all 8 events', () => {
  const all = evCtx.filterEvents('', 'All');
  assert(all.length === 8);
});
check('filterEvents by Technical category returns valid subset', () => {
  const tech = evCtx.filterEvents('', 'Technical');
  assert(tech.length >= 1 && tech.every(e => e.category === 'Technical'));
});
check('filterEvents by Cultural category returns valid subset', () => {
  const cult = evCtx.filterEvents('', 'Cultural');
  assert(cult.length >= 1 && cult.every(e => e.category === 'Cultural'));
});
check('filterEvents by search term finds hackathon', () => {
  const result = evCtx.filterEvents('hackathon', 'All');
  assert(result.length >= 1);
});
check('filterEvents with no matches returns empty array', () => {
  const result = evCtx.filterEvents('zzznomatch999', 'All');
  assert(Array.isArray(result) && result.length === 0);
});
check('Combined search + category filter works correctly', () => {
  const result = evCtx.filterEvents('hackathon', 'Technical');
  assert(Array.isArray(result) && result.length >= 1);
});
check('getFeaturedEvents returns featured events', () => {
  const featured = evCtx.getFeaturedEvents();
  assert(Array.isArray(featured) && featured.length >= 1 && featured.every(e => e.featured === true));
});
check('renderEventCardHTML returns valid event-card HTML', () => {
  const html = evCtx.renderEventCardHTML(allEvents[0]);
  assert(typeof html === 'string' && html.length > 50 && html.includes('event-card'));
});
check('renderEventCardHTML includes loading="lazy"', () => {
  const html = evCtx.renderEventCardHTML(allEvents[0]);
  assert(html.includes('loading="lazy"'));
});
check('renderEventCardHTML adds reveal-on-scroll class', () => {
  const html = evCtx.renderEventCardHTML(allEvents[0]);
  assert(html.includes('reveal-on-scroll'));
});
check('Flagship/featured event exists in dataset', () => {
  assert(allEvents.some(e => e.featured === true));
});
check('detail-price-badge binding exists in initEventDetailsPage', () => {
  assert(eventsCode.includes("getElementById('detail-price-badge')"));
});
check('escapeHTML function defined', () => assert(typeof evCtx.escapeHTML === 'function'));
check('escapeHTML escapes script tags', () => {
  const safe = evCtx.escapeHTML('<script>alert(1)</script>');
  assert(!safe.includes('<script>'));
  assert(safe.includes('&lt;'));
});

// =============================================================================
console.log('\n━━━ Suite 4 · Registration & Storage (registration.js + storage.js) ━━━');
// =============================================================================
const storageCode = readJs('storage.js');
const regCode     = readJs('registration.js');

const regCtx = buildSandbox();
runInSandbox(storageCode, regCtx);
runInSandbox(eventsCode,  regCtx);
runInSandbox(regCode,     regCtx);

check('generateUniqueRegistrationId function exists', () => assert(typeof regCtx.generateUniqueRegistrationId === 'function'));
check('generateUniqueRegistrationId returns SCENE-prefixed string', () => {
  const id = regCtx.generateUniqueRegistrationId([]);
  assert(typeof id === 'string' && id.startsWith('SCENE-'));
});
check('Two consecutive IDs are distinct', () => {
  assert(regCtx.generateUniqueRegistrationId([]) !== regCtx.generateUniqueRegistrationId([]));
});

check('isValidFullName function validates name inputs', () => {
  assert(typeof regCtx.isValidFullName === 'function');
  assert(regCtx.isValidFullName('Rahul Sharma') === true);
  assert(regCtx.isValidFullName('A') === false);
  assert(regCtx.isValidFullName('') === false);
});

check('isValidEmail function validates RFC-compliant email inputs', () => {
  assert(typeof regCtx.isValidEmail === 'function');
  assert(regCtx.isValidEmail('rahul.sharma@kiit.ac.in') === true);
  assert(regCtx.isValidEmail('invalid-email') === false);
  assert(regCtx.isValidEmail('') === false);
});

check('isValidIndianPhone function validates 10-digit Indian numbers', () => {
  assert(typeof regCtx.isValidIndianPhone === 'function');
  assert(regCtx.isValidIndianPhone('9876543210') === true);
  assert(regCtx.isValidIndianPhone('+919876543210') === true);
  assert(regCtx.isValidIndianPhone('1234567890') === false); // invalid starting digit
  assert(regCtx.isValidIndianPhone('98765') === false); // too short
});

check('hasDuplicateRegistration function exists in storage engine', () => assert(typeof regCtx.hasDuplicateRegistration === 'function'));
check('hasDuplicateRegistration detects existing pass', () => {
  regCtx.localStorage.clear();
  regCtx.saveRegistration({
    eventId: 'tech-01',
    attendeeEmail: 'test@kiit.ac.in',
    attendeeName: 'Rahul Sharma',
    attendeePhone: '9876543210',
    eventTitle: 'Hackathon',
    category: 'Technical',
    eventDate: 'Nov 15',
    eventVenue: 'Tech Hall'
  });
  assert(regCtx.hasDuplicateRegistration('tech-01', 'test@kiit.ac.in') === true);
});
check('hasDuplicateRegistration returns false for different email', () => {
  assert(regCtx.hasDuplicateRegistration('tech-01', 'different@kiit.ac.in') === false);
});
check('hasDuplicateRegistration returns false for different eventId', () => {
  assert(regCtx.hasDuplicateRegistration('cult-01', 'test@kiit.ac.in') === false);
});

check('saveRegistration stores record into localStorage', () => {
  regCtx.localStorage.clear();
  regCtx.saveRegistration({
    eventId: 'cult-01',
    attendeeEmail: 'student@kiit.ac.in',
    attendeeName: 'Sneha Patel',
    attendeePhone: '9876543210',
    category: 'Cultural',
    eventTitle: 'Gala',
    eventDate: 'Nov 22',
    eventVenue: 'Amphi'
  });
  const all = regCtx.getStoredRegistrations();
  assert(Array.isArray(all) && all.some(r => r.attendeeEmail === 'student@kiit.ac.in'));
});
check('getStoredRegistrations returns array of passes', () => {
  assert(Array.isArray(regCtx.getStoredRegistrations()));
});
check('deleteRegistration removes only the targeted record', () => {
  regCtx.localStorage.clear();
  const r1 = regCtx.saveRegistration({
    eventId: 'sport-01',
    attendeeEmail: 'del@kiit.ac.in',
    attendeeName: 'Aman',
    attendeePhone: '9876543210',
    category: 'Sports',
    eventTitle: 'Derby'
  });
  const r2 = regCtx.saveRegistration({
    eventId: 'cult-01',
    attendeeEmail: 'keep@kiit.ac.in',
    attendeeName: 'Kavya',
    attendeePhone: '9876543210',
    category: 'Cultural',
    eventTitle: 'Gala'
  });
  regCtx.deleteRegistration(r1.id);
  const all = regCtx.getStoredRegistrations();
  assert(!all.some(r => r.id === r1.id));
  assert(all.some(r => r.id === r2.id));
});
check('getStoredRegistrations handles corrupt localStorage safely', () => {
  regCtx.localStorage.setItem('scene_registrations', 'NOT_VALID_JSON{[');
  const result = regCtx.getStoredRegistrations();
  assert(Array.isArray(result) && result.length === 0);
});

check('10-digit Indian mobile regex present in registration validation', () => {
  assert(regCode.includes('^[6-9]\\d{9}$') || regCode.includes('[6-9][0-9]{9}'));
});

// =============================================================================
console.log('\n━━━ Suite 5 · Countdown Timer (countdown.js) ━━━');
// =============================================================================
const countdownCode = readJs('countdown.js');
const cdCtx = buildSandbox({ setInterval: (fn) => { fn(); return 1; } });
runInSandbox(countdownCode, cdCtx);

check('parseEventDateTime function defined', () => assert(typeof cdCtx.parseEventDateTime === 'function'));
check('clearCountdown function defined', () => assert(typeof cdCtx.clearCountdown === 'function'));
check('startCountdown function defined', () => assert(typeof cdCtx.startCountdown === 'function'));

check('parseEventDateTime parses valid future date', () => {
  const d = cdCtx.parseEventDateTime('November 15, 2026', '09:00 AM');
  assert(d instanceof Date && !isNaN(d.getTime()));
});
check('parseEventDateTime returns null for invalid date', () => {
  assert(cdCtx.parseEventDateTime('Invalid Date Str', '09:00 AM') === null);
});
check('parseEventDateTime returns null for null input', () => {
  assert(cdCtx.parseEventDateTime(null) === null);
});
check('startCountdown renders Days, Hours, Minutes, Seconds', () => {
  const c = { innerHTML: '', _countdownInterval: null };
  cdCtx.startCountdown('November 15, 2026', '09:00 AM', c);
  assert(c.innerHTML.includes('count-unit'));
  assert(c.innerHTML.includes('Days'));
  assert(c.innerHTML.includes('Hours'));
  assert(c.innerHTML.includes('Minutes'));
  assert(c.innerHTML.includes('Seconds'));
});
check('startCountdown displays past event message without negative numbers', () => {
  const c = { innerHTML: '', _countdownInterval: null };
  cdCtx.startCountdown('January 1, 2020', '09:00 AM', c);
  assert(c.innerHTML.includes('started') || c.innerHTML.includes('ended') || c.innerHTML.includes('Event'));
});
check('startCountdown gracefully handles null container', () => {
  cdCtx.startCountdown('November 15, 2026', '09:00 AM', null);
  assert(true);
});

check('index.html contains #featured-countdown', () => assert(readHtml('index.html').includes('id="featured-countdown"')));
check('event-details.html contains #detail-countdown', () => assert(readHtml('event-details.html').includes('id="detail-countdown"')));
check('index.html loads js/countdown.js', () => assert(readHtml('index.html').includes('countdown.js')));
check('event-details.html loads js/countdown.js', () => assert(readHtml('event-details.html').includes('countdown.js')));

// =============================================================================
console.log('\n━━━ Suite 6 · Dark / Light Mode ━━━');
// =============================================================================
const mainCode = readJs('main.js');
const mainCtx  = buildSandbox();
runInSandbox(mainCode, mainCtx);

check('initThemeToggle function defined', () => assert(typeof mainCtx.initThemeToggle === 'function'));
check('Theme stored under "scene_theme" key', () => assert(mainCode.includes("'scene_theme'")));
check('Dark attribute applied to documentElement', () => assert(mainCode.includes("setAttribute('data-theme', 'dark')")));
check('Light mode removes data-theme attribute', () => assert(mainCode.includes("removeAttribute('data-theme')")));
pages.forEach(p => {
  check(`${p}: inline head theme script`, () => assert(readHtml(p).includes("localStorage.getItem('scene_theme')")));
  check(`${p}: theme-toggle-btn present`, () => assert(readHtml(p).includes('id="theme-toggle-btn"')));
  check(`${p}: moon icon present`, () => assert(readHtml(p).includes('theme-icon-moon')));
  check(`${p}: sun icon present`, () => assert(readHtml(p).includes('theme-icon-sun')));
});
check('Dark mode CSS icon toggling', () => {
  assert(css.includes('[data-theme="dark"] .theme-icon-sun'));
  assert(css.includes('[data-theme="dark"] .theme-icon-moon'));
});

// =============================================================================
console.log('\n━━━ Suite 7 · Animations & Motion ━━━');
// =============================================================================
check('initScrollReveal defined in main.js', () => assert(mainCode.includes('function initScrollReveal')));
check('IntersectionObserver used for reveals', () => assert(mainCode.includes('IntersectionObserver')));
check('.reveal-on-scroll initially opacity: 0', () => {
  const idx = css.indexOf('.reveal-on-scroll {');
  const block = css.substring(idx, idx + 150);
  assert(block.includes('opacity: 0'));
});
check('.is-revealed has opacity: 1', () => {
  const idx = css.indexOf('.is-revealed {');
  const block = css.substring(idx, idx + 150);
  assert(block.includes('opacity: 1'));
});
check('Flagship card has hover transform', () => assert(css.includes('.flagship-event-card:hover')));
check('Event card image has hover scale', () => assert(css.includes('.event-card:hover .event-card-img')));
check('renderEventCardHTML attaches reveal-on-scroll', () => {
  const html = evCtx.renderEventCardHTML(allEvents[0]);
  assert(html.includes('reveal-on-scroll'));
});

// =============================================================================
console.log('\n━━━ Suite 8 · UI/UX Enhancements ━━━');
// =============================================================================
check('initScrollProgress defined in main.js', () => assert(mainCode.includes('function initScrollProgress')));
check('initBackToTop defined in main.js', () => assert(mainCode.includes('function initBackToTop')));
check('Passive scroll listeners used for performance', () => assert(mainCode.includes('passive: true')));
check('Back-to-top respects prefers-reduced-motion', () => assert(mainCode.includes('prefers-reduced-motion')));
check('Back-to-top uses smooth scroll behavior', () => assert(mainCode.includes("behavior: prefersReduced ? 'auto' : 'smooth'")));
pages.forEach(p => {
  check(`${p}: back-to-top button has aria-label`, () => {
    const h = readHtml(p);
    const idx = h.indexOf('id="back-to-top"');
    assert(h.substring(idx, idx + 100).includes('aria-label'));
  });
});
check('Hero images are eager-loaded in index.html', () => {
  const h = readHtml('index.html');
  assert(h.includes('hero-culture.jpg') && h.includes('loading="eager"'));
});
check('Below-fold images use loading="lazy" in index.html', () => {
  const h = readHtml('index.html');
  assert(h.includes('loading="lazy"'));
});

// =============================================================================
console.log('\n━━━ Suite 9 · Security & Bug Fix Verification ━━━');
// =============================================================================
check('XSS prevention: escapeHTML escapes quotes and tags', () => {
  const malicious = evCtx.escapeHTML('<img src=x onerror="alert(1)">');
  assert(!malicious.includes('<img'));
  assert(malicious.includes('&lt;'));
  assert(malicious.includes('&quot;'));
});
check('event-details.html has no hardcoded event-hackathon.jpg', () => {
  assert(!readHtml('event-details.html').includes('event-hackathon.jpg'));
});
check('event-details.html has no hardcoded InnovateX title', () => {
  assert(!readHtml('event-details.html').includes('InnovateX 2026: Campus Hackathon'));
});
check('event-details.html uses neutral placeholder.svg for initial image', () => {
  assert(readHtml('event-details.html').includes('placeholder.svg'));
});

// =============================================================================
console.log('\n━━━ Suite 10 · Main.js Lifecycle Initialization ━━━');
// =============================================================================
check('DOMContentLoaded wires initMobileNavigation', () => assert(mainCode.includes('initMobileNavigation()')));
check('DOMContentLoaded wires initImageFallbacks', () => assert(mainCode.includes('initImageFallbacks()')));
check('DOMContentLoaded wires initThemeToggle', () => assert(mainCode.includes('initThemeToggle()')));
check('DOMContentLoaded wires initScrollReveal', () => assert(mainCode.includes('initScrollReveal()')));
check('DOMContentLoaded wires initScrollProgress', () => assert(mainCode.includes('initScrollProgress()')));
check('DOMContentLoaded wires initBackToTop', () => assert(mainCode.includes('initBackToTop()')));

// =============================================================================
// RESULTS
// =============================================================================
const total = passed + failed;
console.log(`\n${'━'.repeat(60)}`);
console.log(`RESULTS: ${passed} / ${total} passed   |   ${failed} failed`);
console.log('━'.repeat(60));
if (failed > 0) process.exit(1);
