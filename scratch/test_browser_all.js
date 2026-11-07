/**
 * Browser Verification Simulation
 * Simulates page loading and script execution for each HTML page based on its actual <script src="..."> tags.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');

const scriptCache = {
  'js/countdown.js': fs.readFileSync(path.join(root, 'js', 'countdown.js'), 'utf8'),
  'js/events.js': fs.readFileSync(path.join(root, 'js', 'events.js'), 'utf8'),
  'js/storage.js': fs.readFileSync(path.join(root, 'js', 'storage.js'), 'utf8'),
  'js/registration.js': fs.readFileSync(path.join(root, 'js', 'registration.js'), 'utf8'),
  'js/main.js': fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8')
};

function createElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    attributes: {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    style: {},
    children: [],
    innerHTML: '',
    textContent: '',
    value: '',
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k] ?? null; },
    removeAttribute(k) { delete this.attributes[k]; },
    addEventListener(evt, fn) {},
    dispatchEvent() {},
    contains() { return false; },
    querySelector(s) { return createElement('div'); },
    querySelectorAll(s) { return []; }
  };
  return el;
}

function simulatePage(pageName, urlQuery = '') {
  console.log(`\nTesting Browser Simulation for: ${pageName}${urlQuery}`);
  const html = fs.readFileSync(path.join(root, pageName), 'utf8');

  // Extract <script src="..."> from the HTML
  const scriptTags = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);
  console.log(`  Scripts loaded: ${scriptTags.join(', ')}`);

  const errors = [];
  const warnings = [];

  const elements = {};
  const idMatches = [...html.matchAll(/id="([^"]+)"/g)];
  idMatches.forEach(m => {
    elements[m[1]] = createElement('div');
  });

  const domListeners = [];
  const fakeDoc = {
    title: '',
    documentElement: {
      getAttribute(k) { return null; },
      setAttribute(k, v) {},
      removeAttribute(k) {},
      scrollTop: 0,
      scrollHeight: 2000
    },
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = createElement('div');
      }
      return elements[id];
    },
    querySelectorAll(selector) {
      return [];
    },
    querySelector(selector) {
      return createElement('div');
    },
    addEventListener(evt, fn) {
      if (evt === 'DOMContentLoaded') {
        domListeners.push(fn);
      }
    }
  };

  const fakeWin = {
    location: {
      search: urlQuery,
      pathname: `/${pageName}`
    },
    scrollY: 0,
    innerHeight: 800,
    scrollTo(opts) {},
    addEventListener(evt, fn) {},
    matchMedia(q) {
      return { matches: false, addEventListener() {} };
    }
  };

  const sandbox = vm.createContext({
    window: fakeWin,
    document: fakeDoc,
    URLSearchParams: class {
      constructor(query = '') {
        this.params = {};
        if (query.startsWith('?')) query = query.slice(1);
        query.split('&').forEach(part => {
          const [k, v] = part.split('=');
          if (k) this.params[decodeURIComponent(k)] = decodeURIComponent(v || '');
        });
      }
      get(k) { return this.params[k] ?? null; }
    },
    localStorage: {
      getItem(k) { return null; },
      setItem(k, v) {},
      removeItem(k) {},
      clear() {}
    },
    console: {
      log(...args) {},
      warn(...args) { warnings.push(args.join(' ')); },
      error(...args) { errors.push(args.join(' ')); }
    },
    Date, Math, String, Number, Boolean, Array, Object, JSON, parseInt, parseFloat, isNaN,
    setTimeout: (fn) => 0,
    setInterval: (fn) => 0,
    clearTimeout: () => {},
    clearInterval: () => {}
  });

  // Run only the scripts declared in this HTML file in order
  try {
    scriptTags.forEach(src => {
      const code = scriptCache[src];
      if (code) {
        vm.runInContext(code, sandbox);
      } else {
        throw new Error(`Script not found in cache: ${src}`);
      }
    });

    // Fire DOMContentLoaded
    domListeners.forEach(fn => fn());
  } catch (err) {
    errors.push(err.stack || err.message);
  }

  assert.strictEqual(errors.length, 0, `Errors during ${pageName} simulation: ${errors.join('\n')}`);
  console.log(`  ✓ ${pageName}: Executed cleanly with 0 console/runtime errors.`);
}

simulatePage('index.html');
simulatePage('events.html');
simulatePage('event-details.html', '?id=tech-01');
simulatePage('event-details.html', '?id=cult-01');
simulatePage('event-details.html', '?id=invalid-id');
simulatePage('registrations.html');

console.log('\n--- ALL BROWSER SIMULATIONS PASSED (0 RUNTIME ERRORS) ---');
