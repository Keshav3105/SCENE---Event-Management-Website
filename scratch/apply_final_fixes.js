const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Google Fonts snippet to insert into HTML files
const fontsSnippet = `  <!-- Google Fonts Preconnect and Canonical Block Display Stylesheet -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=block">`;

// Helper to update HTML head with fontsSnippet before <link rel="stylesheet" href="css/style.css">
function addFontsToHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove any previous preconnect/fonts.googleapis links if any
  content = content.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/g, '');
  content = content.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>/g, '');
  content = content.replace(/\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2[^"]*">/g, '');
  
  // Insert before <link rel="stylesheet" href="css/style.css">
  const target = '<link rel="stylesheet" href="css/style.css">';
  if (!content.includes(target)) {
    throw new Error(`Target not found in ${filePath}`);
  }
  content = content.replace(target, `${fontsSnippet}\n  ${target}`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated fonts in ${filePath}`);
}

addFontsToHtml(path.join(rootDir, 'index.html'));
addFontsToHtml(path.join(rootDir, 'events.html'));
addFontsToHtml(path.join(rootDir, 'registrations.html'));

// 2. Update event-details.html (fonts + eliminate static hackathon flash)
let detailsHtml = fs.readFileSync(path.join(rootDir, 'event-details.html'), 'utf8');
// Clean out any old font links
detailsHtml = detailsHtml.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/g, '');
detailsHtml = detailsHtml.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*>/g, '');
detailsHtml = detailsHtml.replace(/\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2[^"]*">/g, '');

// Insert fonts
const targetStyle = '<link rel="stylesheet" href="css/style.css">';
detailsHtml = detailsHtml.replace(targetStyle, `${fontsSnippet}\n  ${targetStyle}`);

// Update title and meta description
detailsHtml = detailsHtml.replace(
  '<title>InnovateX 2026: Campus Hackathon &mdash; SCENE</title>',
  '<title>Event Details &mdash; SCENE</title>'
);
detailsHtml = detailsHtml.replace(
  '<meta name="description" content="View full event schedule, venue directions, and reserve passes for InnovateX 2026 on SCENE.">',
  '<meta name="description" content="View event schedules, logistics, venue directions, and reserve passes on SCENE.">'
);

// Replace static detail image
const oldImg = `<img id="detail-image"
                 src="assets/images/event-hackathon.jpg"
                 alt="InnovateX 2026 Campus Hackathon"
                 class="detail-img"
                 data-fallback="assets/images/placeholder.svg">`;

const newImg = `<img id="detail-image"
                 src="assets/images/placeholder.svg"
                 alt=""
                 class="detail-img"
                 data-fallback="assets/images/placeholder.svg">`;

if (detailsHtml.includes(oldImg)) {
  detailsHtml = detailsHtml.replace(oldImg, newImg);
} else {
  // Regex fallback
  detailsHtml = detailsHtml.replace(/<img id="detail-image"[\s\S]*?data-fallback="assets\/images\/placeholder\.svg">/, newImg);
}

// Replace badges
const oldBadges = `<span id="detail-category-badge" class="badge badge-tech">Technical</span>
              <span class="badge badge-outline">Free Admission</span>`;
const newBadges = `<span id="detail-category-badge" class="badge">Loading...</span>
              <span id="detail-price-badge" class="badge badge-outline"></span>`;
detailsHtml = detailsHtml.replace(oldBadges, newBadges);

// Replace title
detailsHtml = detailsHtml.replace(
  /<h1 id="detail-title" class="section-title"[^>]*>[\s\S]*?<\/h1>/,
  '<h1 id="detail-title" class="section-title" style="text-align: left; font-size: clamp(2rem, 3.5vw, 2.75rem);">&nbsp;</h1>'
);

// Replace description
detailsHtml = detailsHtml.replace(
  /<p id="detail-desc" class="detail-text">[\s\S]*?<\/p>/,
  '<p id="detail-desc" class="detail-text"></p>'
);

// Replace highlights list
detailsHtml = detailsHtml.replace(
  /<ul id="detail-highlights-list"[\s\S]*?<\/ul>/,
  '<ul id="detail-highlights-list" style="list-style: disc; margin-left: 1.5rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem;"></ul>'
);

// Replace eligibility
detailsHtml = detailsHtml.replace(
  /<p id="detail-eligibility" class="detail-text">[\s\S]*?<\/p>/,
  '<p id="detail-eligibility" class="detail-text"></p>'
);

// Replace sidebar logistics info values
detailsHtml = detailsHtml.replace(
  '<div id="detail-date" class="sidebar-info-val">March 28, 2026 &bull; 09:00 AM</div>',
  '<div id="detail-date" class="sidebar-info-val">&mdash;</div>'
);
detailsHtml = detailsHtml.replace(
  '<div id="detail-venue" class="sidebar-info-val">Tech Innovation Complex, Hall A</div>',
  '<div id="detail-venue" class="sidebar-info-val">&mdash;</div>'
);
detailsHtml = detailsHtml.replace(
  '<div id="detail-capacity" class="sidebar-info-val">300 Seats (Limited)</div>',
  '<div id="detail-capacity" class="sidebar-info-val">&mdash;</div>'
);
detailsHtml = detailsHtml.replace(
  '<div id="detail-fee" class="sidebar-info-val" style="color: var(--cat-sports);">Complimentary Pass</div>',
  '<div id="detail-fee" class="sidebar-info-val" style="color: var(--cat-sports);">&mdash;</div>'
);

// Replace registration input value
detailsHtml = detailsHtml.replace(
  '<input type="text" id="reg-event-name" class="form-control" value="InnovateX 2026: Campus Hackathon" readonly>',
  '<input type="text" id="reg-event-name" class="form-control" value="" readonly>'
);

fs.writeFileSync(path.join(rootDir, 'event-details.html'), detailsHtml, 'utf8');
console.log('Updated event-details.html successfully.');

// 3. Update js/events.js (bind price badge)
let eventsJs = fs.readFileSync(path.join(rootDir, 'js/events.js'), 'utf8');
const targetPriceCode = `  const categoryBadge = document.getElementById('detail-category-badge');
  if (categoryBadge) {
    categoryBadge.className = \`badge \${getCategoryBadgeClass(event.category)}\`;
    categoryBadge.textContent = event.category;
  }`;

const updatedPriceCode = `  const categoryBadge = document.getElementById('detail-category-badge');
  if (categoryBadge) {
    categoryBadge.className = \`badge \${getCategoryBadgeClass(event.category)}\`;
    categoryBadge.textContent = event.category;
  }

  const priceBadge = document.getElementById('detail-price-badge');
  if (priceBadge) {
    priceBadge.textContent = event.price;
  }`;

if (!eventsJs.includes('detail-price-badge')) {
  eventsJs = eventsJs.replace(targetPriceCode, updatedPriceCode);
  fs.writeFileSync(path.join(rootDir, 'js/events.js'), eventsJs, 'utf8');
  console.log('Updated js/events.js with detail-price-badge binding.');
} else {
  console.log('js/events.js already has detail-price-badge binding.');
}

// 4. Update css/style.css
let css = fs.readFileSync(path.join(rootDir, 'css/style.css'), 'utf8');

// Remove @import line 8
css = css.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?[^']*'\);\r?\n?/, '');

// Update .section-subtitle max-width from 620px to 660px
css = css.replace(
  /\.section-subtitle\s*\{([^}]*?)max-width:\s*620px;([^}]*?)\}/,
  '.section-subtitle {\$1max-width: 660px;\$2}'
);

// Update .modal-dialog background-color from #FFFFFF to var(--bg-card)
css = css.replace(
  /\.modal-dialog\s*\{([^}]*?)background-color:\s*#FFFFFF;([^}]*?)\}/,
  '.modal-dialog {\$1background-color: var(--bg-card);\$2}'
);

// Update [data-theme="dark"] variables
css = css.replace(/--text-main:\s*#EDE5D8;/, '--text-main: #F3ECE1;');
css = css.replace(/--text-muted:\s*#B8A99E;/, '--text-muted: #C4B5A8;');
css = css.replace(/--text-dim:\s*#84756C;/, '--text-dim: #9E8F84;');
css = css.replace(/--text-inverse:\s*#181412;/, '--text-inverse: #F3ECE1;');

// Update dark mode modal selector
css = css.replace(
  /\[data-theme="dark"\] \.modal-card\s*\{/,
  '[data-theme="dark"] .modal-dialog,\n[data-theme="dark"] .modal-card {'
);

// Add .modal-dialog to transition list if not present
if (!css.includes('.modal-dialog,\n.modal-card,')) {
  css = css.replace('.modal-card,\n.count-unit,', '.modal-dialog,\n.modal-card,\n.count-unit,');
}

fs.writeFileSync(path.join(rootDir, 'css/style.css'), css, 'utf8');
console.log('Updated css/style.css successfully.');
