const fs = require('fs');
['index.html','events.html','event-details.html'].forEach(f => {
  const h = fs.readFileSync(f, 'utf8');
  const matches = [...h.matchAll(/<img[^>]+>/g)];
  console.log('\n' + f + ':');
  matches.forEach(m => {
    const full = m[0];
    const hasLazy = full.includes('loading=');
    const srcM = full.match(/src="([^"]+)"/);
    const src = srcM ? srcM[1].split('/').pop() : '?';
    console.log('  ' + (hasLazy ? 'LAZY ' : 'EAGER') + ' ' + src);
  });
});
