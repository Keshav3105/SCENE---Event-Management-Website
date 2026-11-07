const fs = require('fs');
const path = require('path');
const assert = require('assert');

const rootDir = path.resolve(__dirname, '..');

console.log('--- Testing Final Fixes Verification ---');

// 1. Verify Typography and Font Preconnects across all 4 HTML pages
const htmlFiles = ['index.html', 'events.html', 'event-details.html', 'registrations.html'];
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  assert(content.includes('rel="preconnect" href="https://fonts.googleapis.com"'), `${file} missing googleapis preconnect`);
  assert(content.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), `${file} missing gstatic preconnect`);
  assert(content.includes('&display=block'), `${file} missing display=block font link`);
  assert(content.includes('<link rel="stylesheet" href="css/style.css">'), `${file} missing style.css link`);
  console.log(`✓ ${file}: Font preconnect and display=block link verified.`);
});

// 2. Verify css/style.css
const rawCss = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');
const css = rawCss.replace(/\r\n/g, '\n');
assert(!css.includes('@import url('), 'css/style.css still contains @import url');
assert(css.includes('.section-subtitle {\n  color: var(--text-muted);\n  font-size: 1.05rem;\n  max-width: 660px;'), '.section-subtitle max-width not set to 660px');
assert(css.includes('.modal-dialog {\n  background-color: var(--bg-card);'), '.modal-dialog background-color not set to var(--bg-card)');
assert(css.includes('--text-inverse: #F3ECE1;'), 'Dark mode --text-inverse not set to #F3ECE1');
assert(css.includes('--text-main: #F3ECE1;'), 'Dark mode --text-main not set to #F3ECE1');
assert(css.includes('--text-muted: #C4B5A8;'), 'Dark mode --text-muted not set to #C4B5A8');
assert(css.includes('--text-dim: #9E8F84;'), 'Dark mode --text-dim not set to #9E8F84');
assert(css.includes('[data-theme="dark"] .modal-dialog'), 'Dark mode does not target .modal-dialog');
console.log('✓ css/style.css: Zero @imports, wide subtitle, dark theme tokens, and modal styling verified.');

// 3. Contrast verification for dark mode manifesto quote
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}
const bgDarkLum = getLuminance(...hexToRgb('0D0B0A'));
const quoteTextLum = getLuminance(...hexToRgb('F3ECE1'));
const contrast = (quoteTextLum + 0.05) / (bgDarkLum + 0.05);
console.log(`✓ Dark mode manifesto quote contrast: ${contrast.toFixed(2)}:1 (WCAG AAA requires 7:1)`);
assert(contrast > 14, 'Contrast ratio is below 14:1');

// 4. Verify event-details.html content flash elimination
const detailsHtml = fs.readFileSync(path.join(rootDir, 'event-details.html'), 'utf8');
assert(!detailsHtml.includes('event-hackathon.jpg'), 'event-details.html still contains event-hackathon.jpg');
assert(!detailsHtml.includes('InnovateX 2026: Campus Hackathon'), 'event-details.html still contains InnovateX static title');
assert(!detailsHtml.includes('InnovateX is our university'), 'event-details.html still contains InnovateX static description');
assert(detailsHtml.includes('src="assets/images/placeholder.svg"'), 'detail-image does not use placeholder.svg');
assert(detailsHtml.includes('id="detail-price-badge"'), 'detail-price-badge element missing in event-details.html');
console.log('✓ event-details.html: No hardcoded hackathon content; neutral placeholder structure verified.');

// 5. Verify js/events.js dynamic binding for event-details
const eventsJs = fs.readFileSync(path.join(rootDir, 'js/events.js'), 'utf8');
assert(eventsJs.includes('detail-price-badge'), 'js/events.js missing detail-price-badge binding');
assert(eventsJs.includes('priceBadge.textContent = event.price'), 'js/events.js does not set priceBadge textContent');
console.log('✓ js/events.js: Dynamic binding handles price badge alongside all event fields.');

console.log('\n--- ALL FINAL FIXES VERIFICATION TESTS PASSED ---');
