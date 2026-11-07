const fs = require('fs');
let html = fs.readFileSync('event-details.html', 'utf8');
html = html.replace(
  /<span id="detail-category-badge"[\s\S]*?<\/span>[\s\r\n]*<span class="badge badge-outline">Free Admission<\/span>/,
  '<span id="detail-category-badge" class="badge">Loading...</span>\n              <span id="detail-price-badge" class="badge badge-outline"></span>'
);
fs.writeFileSync('event-details.html', html, 'utf8');
console.log('Badge updated successfully.');
