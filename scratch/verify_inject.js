const fs = require('fs');
const files = ['index.html','events.html','event-details.html','registrations.html'];
files.forEach(f => {
  const h = fs.readFileSync(f, 'utf8');
  const sp = h.includes('id="scroll-progress"');
  const btt = h.includes('id="back-to-top"');
  console.log(f + ': progress=' + sp + ', btt=' + btt);
});
