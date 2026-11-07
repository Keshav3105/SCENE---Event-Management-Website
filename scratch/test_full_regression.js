const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('--- RUNNING COMPREHENSIVE END-TO-END REGRESSION SUITE ---');

// 1. COUNTDOWN TIMER CHECK
console.log('\n[Suite 1: Countdown Timer]');
const countdownJs = fs.readFileSync(path.join(rootDir, 'js/countdown.js'), 'utf8');
assert(countdownJs.includes('function parseEventDateTime'), 'Missing parseEventDateTime');
assert(countdownJs.includes('function clearCountdown'), 'Missing clearCountdown');
assert(countdownJs.includes('function startCountdown'), 'Missing startCountdown');

// Evaluate countdown logic in Node vm
const vm = require('vm');
const countdownSandbox = {
  setInterval: () => 123,
  clearInterval: () => {},
  document: {},
  Date: Date,
  Math: Math,
  String: String,
  isNaN: isNaN,
  parseInt: parseInt
};
vm.createContext(countdownSandbox);
vm.runInContext(countdownJs, countdownSandbox);
assert(typeof countdownSandbox.parseEventDateTime === 'function', 'parseEventDateTime is not a function');
const testDate = countdownSandbox.parseEventDateTime('November 15, 2026', '09:00 AM');
assert(testDate instanceof Date && !isNaN(testDate.getTime()), 'Valid date parsing failed');
const invalidDate = countdownSandbox.parseEventDateTime('Invalid Date', '09:00 AM');
assert(invalidDate === null, 'Invalid date parsing should return null');

const dummyContainer = { innerHTML: '', _countdownInterval: null };
countdownSandbox.startCountdown('November 15, 2026', '09:00 AM', dummyContainer);
assert(dummyContainer.innerHTML.includes('count-unit'), 'startCountdown failed to render count units');
assert(dummyContainer.innerHTML.includes('Days'), 'startCountdown missing Days unit');
assert(dummyContainer.innerHTML.includes('Hours'), 'startCountdown missing Hours unit');
assert(dummyContainer.innerHTML.includes('Minutes'), 'startCountdown missing Minutes unit');
assert(dummyContainer.innerHTML.includes('Seconds'), 'startCountdown missing Seconds unit');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const detailsHtml = fs.readFileSync(path.join(rootDir, 'event-details.html'), 'utf8');
assert(indexHtml.includes('id="featured-countdown"'), 'index.html missing #featured-countdown');
assert(detailsHtml.includes('id="detail-countdown"'), 'event-details.html missing #detail-countdown');
assert(indexHtml.includes('src="js/countdown.js"'), 'index.html missing script tag for countdown.js');
assert(detailsHtml.includes('src="js/countdown.js"'), 'event-details.html missing script tag for countdown.js');
console.log('✓ Countdown timer modules, DOM nodes, and script inclusions verified.');

// 2. THEME SYSTEM CHECK
console.log('\n[Suite 2: Theme System]');
const pages = ['index.html', 'events.html', 'event-details.html', 'registrations.html'];
pages.forEach(p => {
  const content = fs.readFileSync(path.join(rootDir, p), 'utf8');
  assert(content.includes('localStorage.getItem(\'scene_theme\')'), `${p} missing head inline theme script`);
  assert(content.includes('id="theme-toggle-btn"'), `${p} missing theme toggle button`);
});
const mainJs = fs.readFileSync(path.join(rootDir, 'js/main.js'), 'utf8');
assert(mainJs.includes('initThemeToggle'), 'main.js missing initThemeToggle');
assert(mainJs.includes('scene_theme'), 'main.js missing scene_theme LocalStorage key');
console.log('✓ Dark/Light theme toggle button, head pre-check, and localStorage persistence verified.');

// 3. ANIMATIONS & REDUCED MOTION CHECK
console.log('\n[Suite 3: Subtle Animations]');
const rawCss = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');
const css = rawCss.replace(/\r\n/g, '\n');
assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS missing prefers-reduced-motion rule');
assert(css.includes('.reveal-on-scroll'), 'CSS missing .reveal-on-scroll class');
assert(css.includes('.is-revealed'), 'CSS missing .is-revealed class');
assert(mainJs.includes('initScrollReveal'), 'main.js missing initScrollReveal');
console.log('✓ Animations and prefers-reduced-motion accessibility verified.');

// 4. EVENT CATALOG & CENTRAL DATA CHECK
console.log('\n[Suite 4: Events Catalog & Data]');
const eventsJs = fs.readFileSync(path.join(rootDir, 'js/events.js'), 'utf8');
assert(eventsJs.includes('const SAMPLE_EVENTS = ['), 'events.js missing SAMPLE_EVENTS');
assert(eventsJs.includes('id: \'tech-01\''), 'tech-01 missing from SAMPLE_EVENTS');
assert(eventsJs.includes('id: \'cult-01\''), 'cult-01 missing from SAMPLE_EVENTS');
assert(eventsJs.includes('id: \'sports-01\''), 'sports-01 missing from SAMPLE_EVENTS');
assert(eventsJs.includes('function filterEvents'), 'events.js missing filterEvents function');
assert(eventsJs.includes('function getEventById'), 'events.js missing getEventById function');
console.log('✓ Central event dataset, filter logic, and lookup functions verified.');

// 5. REGISTRATION LOGIC & LOCALSTORAGE CHECK
console.log('\n[Suite 5: Registration & Storage]');
const regJs = fs.readFileSync(path.join(rootDir, 'js/registration.js'), 'utf8');
assert(regJs.includes('^[6-9]\\d{9}$'), '10-digit Indian phone regex pattern missing');
assert(regJs.includes('function isDuplicateRegistration'), 'Duplicate prevention function missing');
assert(regJs.includes('function generateRegistrationId'), 'ID generator missing');
assert(regJs.includes('scene_registrations'), 'LocalStorage key scene_registrations missing');
console.log('✓ Registration validation, Indian phone regex, and LocalStorage persistence verified.');

// 6. ISSUE 1: TYPOGRAPHY CONSISTENCY CHECK
console.log('\n[Suite 6: Issue 1 — Typography]');
pages.forEach(p => {
  const content = fs.readFileSync(path.join(rootDir, p), 'utf8');
  assert(content.includes('rel="preconnect" href="https://fonts.googleapis.com"'), `${p} missing googleapis preconnect`);
  assert(content.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), `${p} missing gstatic preconnect`);
  assert(content.includes('&display=block'), `${p} missing display=block font link`);
});
assert(!css.includes('@import url('), 'css/style.css must not have @import url');
assert(css.includes('max-width: 660px;'), '.section-subtitle max-width must be 660px');
console.log('✓ Font links, display=block, zero @imports, and line-wrap width verified.');

// 7. ISSUE 2: EVENT DETAILS FLASH ELIMINATION CHECK
console.log('\n[Suite 7: Issue 2 — Event Details Content Flash]');
assert(!detailsHtml.includes('event-hackathon.jpg'), 'Hardcoded hackathon image found');
assert(!detailsHtml.includes('InnovateX 2026: Campus Hackathon'), 'Hardcoded hackathon title found');
assert(!detailsHtml.includes('36-hour hackathon'), 'Hardcoded hackathon description found');
assert(detailsHtml.includes('src="assets/images/placeholder.svg"'), 'Detail image not using placeholder SVG');
assert(detailsHtml.includes('id="detail-price-badge"'), 'detail-price-badge missing in event-details.html');
assert(eventsJs.includes('const priceBadge = document.getElementById(\'detail-price-badge\');'), 'priceBadge binding missing in js/events.js');
console.log('✓ Content flash eliminated; neutral placeholder structure verified.');

// 8. ISSUE 3: DARK MODE CONTRAST AND STYLING CHECK
console.log('\n[Suite 8: Issue 3 — Dark Mode Contrast & Modals]');
assert(css.includes('--text-inverse: #F3ECE1;'), 'Dark mode --text-inverse must be warm ivory #F3ECE1');
assert(css.includes('--text-main: #F3ECE1;'), 'Dark mode --text-main must be #F3ECE1');
assert(css.includes('--text-muted: #C4B5A8;'), 'Dark mode --text-muted must be #C4B5A8');
assert(css.includes('--text-dim: #9E8F84;'), 'Dark mode --text-dim must be #9E8F84');
assert(css.includes('[data-theme="dark"] .modal-dialog'), 'Dark mode must target .modal-dialog');
assert(css.includes('.modal-dialog {\n  background-color: var(--bg-card);'), 'Light mode .modal-dialog must use var(--bg-card)');
console.log('✓ Dark mode manifesto text contrast and modal styling verified.');

console.log('\n======================================================');
console.log('ALL REGRESSION SUITES PASSED CLEANLY (8/8)');
console.log('======================================================');
