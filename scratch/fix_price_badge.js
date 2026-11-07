const fs = require('fs');
let js = fs.readFileSync('js/events.js', 'utf8');
const target = 'categoryBadge.textContent = event.category;\r\n  }';
const addition = `categoryBadge.textContent = event.category;
  }

  const priceBadge = document.getElementById('detail-price-badge');
  if (priceBadge) {
    priceBadge.textContent = event.price;
  }`;

if (js.includes(target)) {
  js = js.replace(target, addition.replace(/\n/g, '\r\n'));
} else {
  js = js.replace('categoryBadge.textContent = event.category;\n  }', addition);
}
fs.writeFileSync('js/events.js', js, 'utf8');
console.log('js/events.js updated.');
