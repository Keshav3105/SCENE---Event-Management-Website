const fs = require('fs');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

const scrollProgressHtml = '  <!-- Scroll Progress Indicator -->\n  <div id="scroll-progress" aria-hidden="true"></div>\n';

const htmlFiles = ['index.html', 'events.html', 'event-details.html', 'registrations.html'];
htmlFiles.forEach(file => {
  let html = fs.readFileSync(path.join(rootDir, file), 'utf8');
  if (!html.includes('id="scroll-progress"')) {
    // Replace <body> followed by any line ending
    html = html.replace(/<body>\r?\n/, '<body>\r\n' + scrollProgressHtml);
    fs.writeFileSync(path.join(rootDir, file), html, 'utf8');
    console.log('✓ scroll-progress injected into ' + file);
  } else {
    console.log('⚠ already present in ' + file);
  }
});
