# SCENE — Campus Event Discovery & Management Platform

> *"Your campus. Your scene."*

A modern, responsive, photography-driven event discovery and registration platform for university campus culture. Built for a Web Designing minor college assignment using semantic **HTML5**, **CSS3**, and **vanilla JavaScript (ES6+)**.

- **Live Deployment**: [https://scene-gray-gamma.vercel.app/](https://scene-gray-gamma.vercel.app/)
- **GitHub Repository**: [https://github.com/Keshav3105/SCENE---Event-Management-Website](https://github.com/Keshav3105/SCENE---Event-Management-Website)

---

## 1. Project Overview & Purpose

**SCENE** breaks away from standard SaaS template aesthetics in favor of a tactile, editorial visual identity. It serves as a unified digital hub for university events, allowing students to explore upcoming campus happenings, filter and search through active categories, view detailed event schedules and logistics, reserve admission passes, and manage registrations directly from their browser.

The project strictly adheres to native web standards with zero dependencies, build tools, external frameworks, or server-side databases, making it straightforward to audit and understand.

---

## 2. Features & Bonus Challenges

### Core Features
- **Editorial Homepage (`index.html`)**: Asymmetrical hero banner, live countdown to the campus flagship event, horizontal visual chronicle photo strip, curated events lineup, and category grid.
- **Interactive Event Catalog (`events.html`)**: Live search and category filtering with instant UI updates, event result counters, and dedicated empty-state feedback with a one-click filter reset.
- **Dynamic Event Details (`event-details.html`)**: URL-driven view (`?id=...`) pulling full schedules, venue info, entry fees, eligibility guidelines, and interactive registration forms from central event data with zero initial content flashing. Graceful fallback for invalid/missing IDs.
- **Event Pass Reservation**: Form validation (full name, email, 10-digit Indian phone), instant validation feedback, unique collision-resistant pass ID generation, and duplicate pass prevention.
- **My Registrations Dashboard (`registrations.html`)**: Live listing of saved passes retrieved from browser storage, individual pass cancellation with confirmation modals, and empty state guides.

### Bonus Challenges Implemented
- **Event Countdown Timers**: Live ticking countdown (Days, Hours, Minutes, Seconds) for the featured homepage event and dynamic selected event countdowns on detail pages. Handles past and invalid dates safely.
- **Dark / Light Mode**: Seamless theme toggle in navigation bar with instant pre-render check to prevent theme flashes (FOUC), accessible sun/moon icons, and persistent LocalStorage theme memory.
- **Subtle Scroll Animations**: Viewport entry animations (`IntersectionObserver`), staggered photo reveals, hover micro-interactions on cards and buttons, with full `@media (prefers-reduced-motion: reduce)` compliance.
- **Local Persistence**: Client-side CRUD via `localStorage` with defensive error handling for corrupt data or restricted storage modes.

---

## 3. Technology Stack

- **Markup**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, dialog modals, and accessible ARIA attributes).
- **Styling**: Modern CSS3 using CSS Custom Properties (design tokens), CSS Flexbox, CSS Grid, clamp-based fluid typography, and responsive media queries.
- **Scripting**: Pure vanilla JavaScript (ES6+), DOM manipulation, `IntersectionObserver`, `URLSearchParams`, and Web Storage API (`localStorage`).
- **Typography**: Google Fonts — *Playfair Display* (expressive serif headings) paired with *Plus Jakarta Sans* (contemporary sans-serif body text) and *JetBrains Mono* (pass IDs and counters).
- **Assets**: Locally hosted photography archive in `assets/images/` with SVG placeholder fallbacks.
- **Dependencies**: Zero runtime dependencies, package managers, or bundlers.

---

## 4. Project Folder Structure

```text
K-Explore/
├── index.html              # Homepage with flagship countdown & editorial highlights
├── events.html             # Events catalog with live search & multi-category filtering
├── event-details.html      # Dynamic event overview, logistics, and pass reservation
├── registrations.html      # My Registrations dashboard & pass cancellation modal
├── css/
│   └── style.css           # Global stylesheet, design system tokens, & dark theme
├── js/
│   ├── countdown.js        # Reusable countdown timer engine & date parser
│   ├── events.js           # Centralized event dataset (8 events) & catalog controllers
│   ├── storage.js          # Defensive LocalStorage CRUD and pass ID generator
│   ├── registration.js     # Form validation, duplicate guards, & dashboard logic
│   └── main.js             # Mobile navigation, theme toggle, scroll reveal & UI/UX
├── assets/
│   └── images/             # Local photography assets and placeholder SVG
├── progress.md             # Project roadmap, task logs, and phase handoff notes
├── AGENTS.md               # Assignment rules and technical specifications
├── .gitignore              # Standard version control ignore list
└── README.md               # Project documentation
```

---

## 5. How to Run Locally

Because the project is completely static, no compilation, npm install, or build pipeline is required.

### Option A: Direct Browser Opening
1. Clone or download the repository:
   ```bash
   git clone https://github.com/Keshav3105/SCENE---Event-Management-Website.git
   cd SCENE---Event-Management-Website
   ```
2. Double-click `index.html` or open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option B: Local Development Server (Recommended)
Running through a lightweight local server ensures clean URL parameter parsing across all environments:
- **VS Code**: Right-click `index.html` and select **Open with Live Server**.
- **Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.
- **Node.js**:
  ```bash
  npx serve .
  ```

---

## 6. Event Data Management

All sample campus events are centralized in `js/events.js` within the immutable `CAMPUS_EVENTS` collection.

Each event record contains:
- `id`: Unique string identifier (`tech-01`, `cult-01`, `sport-01`, `work-01`, etc.).
- `title`: Event name.
- `category`: Category (`Technical`, `Cultural`, `Sports`, `Workshop`).
- `date`, `time`, `datetimeDisplay`: Standardized human-readable and parseable timestamps.
- `venue`: Campus location details.
- `image`: Relative path to local imagery with automatic SVG fallback.
- `price`: Admission tier (`Free Admission`, `Complimentary Pass`, etc.).
- `capacity`: Seating or attendee limit.
- `featured` & `flagship`: Boolean flags determining homepage hero hierarchy.
- `shortDescription`, `fullDescription`: Contextual summaries.
- `highlights`: Array of itinerary and schedule items.
- `eligibility`: Attendee prerequisites and dress codes.

Public helper methods (`getAllEvents()`, `getEventById()`, `getFeaturedEvents()`) expose safe read-only access.

---

## 7. Search & Filtering Functionality

The events catalog (`events.html`) provides unified real-time discovery:
- **Keyword Search**: Debounced search matching event titles and venues case-insensitively.
- **Category Filter Pills**: Interactive buttons filtering by `All`, `Technical`, `Cultural`, `Sports`, or `Workshop`.
- **Combined Filtering**: Search queries and category selections operate simultaneously to refine results.
- **URL Synchronization**: Direct linking support via URL parameters (`events.html?category=Technical` or `events.html?search=hackathon`).
- **Zero-State Handling**: When no events match, a friendly editorial message is displayed alongside a one-click "Reset Filters" action.

---

## 8. Registration & LocalStorage Engine

Pass reservations are handled client-side using browser `localStorage` (`js/storage.js` and `js/registration.js`):
1. **Form Validation**:
   - **Full Name**: Minimum 2 characters, alphabetic characters, spaces, and standard punctuation.
   - **Email**: RFC 5322 regex validation.
   - **Mobile Number**: 10-digit Indian mobile format (`/^[6-9]\d{9}$/`), supporting optional `+91` or `0` prefix.
2. **Duplicate Prevention**:
   - `hasDuplicateRegistration(eventId, attendeeEmail)` validates whether the provided email address has already claimed a pass for the specified event. Duplicate attempts trigger clear inline alerts without overwriting records.
3. **Collision-Resistant Pass IDs**:
   - `generateUniqueRegistrationId()` formats alphanumeric passes in the pattern `SCENE-2026-XXXX`.
4. **Cancellation & Storage Safety**:
   - Registrations persist under the key `scene_registrations`.
   - Passes can be cancelled from `registrations.html` with explicit confirmation modals.
   - Defensive JSON parsing ensures corrupted or missing localStorage data safely degrades to an empty list without throwing uncaught exceptions.
   - *Note*: As a pure static application, LocalStorage records reside solely in the local browser and are not synchronized across devices.

---

## 9. Countdown Timer Implementation

Implemented in `js/countdown.js` with zero external dependencies:
- **Engine**: `startCountdown(dateStr, timeStr, containerElement)` continuously updates Days, Hours, Minutes, and Seconds.
- **Homepage Integration**: Automatically binds to the active featured/flagship event (`tech-01`).
- **Event Details Integration**: Dynamically reads the selected event's schedule from `?id=...` and runs an independent countdown timer.
- **Edge-Case Resilience**: Safely handles elapsed dates (displays *"Event has started"* without showing negative values), invalid date formats, and clears previous timers upon re-rendering.

---

## 10. Dark / Light Mode & Theme Persistence

Theming is controlled via CSS custom properties in `css/style.css` and managed by `js/main.js`:
- **Light Theme**: Warm ivory background (`#F5F0E7`), deep espresso text (`#211B18`), and burnt orange accents (`#C6532D`).
- **Dark Theme**: Charcoal/espresso background (`#181412`), high-contrast warm ivory text (`#F3ECE1`), elevated cards (`#211B18`), and adjusted category tones.
- **Flash-of-Unstyled-Theme (FOUC) Prevention**: An inline script executes in the `<head>` of all 4 pages prior to DOM rendering, checking `localStorage.getItem('scene_theme')` and setting `data-theme="dark"` immediately.
- **Accessibility**: Meets WCAG AAA contrast guidelines (16.7:1 for dark mode manifesto quote) and provides descriptive `aria-label` updates on the toggle button.

---

## 11. Animations & UI/UX Enhancements

- **Scroll Reveal**: Elements marked with `.reveal-on-scroll` smoothly fade and slide in via native `IntersectionObserver` when scrolled into view.
- **Smooth Navigation**: In-page anchor jumps and scroll interactions glide smoothly via CSS `scroll-behavior: smooth`.
- **Reading Progress Bar**: A subtle 3px burnt orange indicator (`#scroll-progress`) at the top of the viewport reflects scroll depth in real time.
- **Back-to-Top Floating Button**: Smoothly scrolls users back to top; fades in only after scrolling 300px; shifts defensively on mobile screens to prevent overlapping primary navigation.
- **Lazy Loading**: Below-the-fold images use native `loading="lazy"` while above-the-fold hero imagery remains `loading="eager"` to optimize Largest Contentful Paint (LCP).
- **Reduced Motion Support**: Fully respects `@media (prefers-reduced-motion: reduce)`, disabling animations and switching scroll behaviors to instantaneous transitions.

---

## 12. Automated & Regression Testing

The test suite in `scratch/` provides comprehensive verification without requiring external test runners:

| Test File | Description | Status |
|-----------|-------------|--------|
| `scratch/test_final_fixes.js` | Verifies font block links, zero `@import`, dark mode contrast (>16:1), and placeholder cleanup | **PASS** (8/8) |
| `scratch/test_regression.js` | 275-point test across HTML structure, CSS system, Event Data, Registration, Storage, Countdown, Theme, Animations, UI/UX, and Security | **PASS** (275/275) |
| `scratch/test_browser_all.js` | Simulates DOM loading, navigation, and script execution across all 4 HTML pages and parameter lookups | **PASS** (6/6 pages, 0 errors) |

To execute the test suite locally:
```bash
node scratch/test_regression.js
node scratch/test_final_fixes.js
node scratch/test_browser_all.js
```

---

## 📄 License & Attribution

Developed as a Web Designing college minor assignment. All photography assets are used under educational fair-use guidelines.
