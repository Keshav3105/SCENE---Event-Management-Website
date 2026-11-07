# SCENE --- Project Progress & Handoff

Last updated: 7 November 2026

Read this file together with `AGENTS.md` and `README.md` before making
changes. This is a handoff record, not proof that every item is
currently present or passing. Inspect the actual repository and verify
before editing.

## 1. Project overview

-   **Project:** SCENE --- Campus Event Discovery & Management Website
-   **Assignment:** Web Designing minor assignment (the assignment
    handout calls the project category "K Explore"; the actual website
    brand is SCENE).
-   **Live website:** https://scene-events.netlify.app/
-   **GitHub repository:**
    https://github.com/Keshav3105/SCENE---Event-Management-Website
-   **Stack:** HTML5, CSS3, vanilla JavaScript
-   **Backend/database:** None
-   **Deployment:** Netlify, serving the repository root as static files
-   **Registration storage:** Browser LocalStorage

Do not introduce a framework, backend, database, package manager, or
dependency unless explicitly requested.

## 2. Design direction --- preserve it

The completed website uses the SCENE identity: - Warm ivory background -
Espresso/dark brown text - Burnt-orange accent - Muted blue and beige
supporting colours - Playfair Display and Plus Jakarta Sans typography -
Editorial, photography-led event discovery layout

Do not revert to the original K Explore brief's dark navy/purple design.
Do not redesign or replace the existing UI while doing maintenance work.

## 3. Project structure

The project has included these files and folders (inspect the actual
repository before relying on this list):

``` text
K-Explore/
├── index.html
├── events.html
├── event-details.html
├── registrations.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── events.js
│   ├── storage.js
│   └── registration.js
├── assets/
│   └── images/
├── README.md
├── AGENTS.md
├── .gitignore
├── test_phase2.js
├── test_phase3.js
├── test_browser_phase3.js
└── test_ui_corrections.js
```

Test files may or may not be present in the current working tree. Verify
before running them.

## 4. Completed work

### Phase 1 --- Website structure and SCENE UI

-   Multi-page static website created.
-   Homepage, events listing, event details, and My Registrations pages.
-   Shared responsive styling and navigation.
-   SCENE branding and editorial visual direction implemented.
-   Local image assets added.

### Phase 2 --- Event discovery

-   Central event data in `js/events.js`.
-   Originally 8 sample events, two each across Technical, Cultural,
    Sports, and Workshop categories.
-   Event cards rendered dynamically.
-   Search and category filtering work together.
-   Category query parameter support.
-   Event detail pages use an event ID in the URL.
-   Invalid/missing event IDs have a graceful not-found state.

### Phase 3 --- Registration and LocalStorage

-   Registration form validation.
-   Event preselected from event details page.
-   Duplicate registration prevention for the same event/email.
-   Registration pass IDs generated.
-   Registrations saved in LocalStorage.
-   My Registrations page displays saved passes.
-   Cancellation requires confirmation.
-   Corrupt LocalStorage data recovery exists.

### Security/robustness maintenance

A later committed maintenance pass was reported as successful: -
Escaping values rendered into event-card and empty-state HTML in
`js/events.js`. - Escaping saved registration values rendered by
`js/registration.js`. - Image fallback behaviour was reviewed/adjusted
during that pass. - Test suites were reported passing: `test_phase2.js`,
`test_phase3.js`, `test_browser_phase3.js`, and
`test_ui_corrections.js`.

These are prior reported results. Re-run the tests against the current
restored working tree before relying on them.

### Sample event dates

The sample event dates were updated to future dates in November/December
2026 and January 2027 in a separate task. The user intended to commit
that change before implementing the countdown. Verify the current
`js/events.js` and Git history to confirm those dates are still present.
Do not change event dates unless explicitly requested.

## 5. Current state --- important

The user attempted to implement the assignment's bonus countdown timer
using Antigravity. The attempt caused regressions: - Multiple events
disappeared from the website/event listing. - Event discovery/details
behaviour became incorrect. - The countdown did not work as expected.

The user restored the project to the previous working version again
after that attempt.

**The intended current baseline is the last known working committed
version, without the failed countdown implementation.** Confirm this by
inspecting Git status, event data, and pages. Do not assume the failed
implementation is still present.

The user is now planning to use Ollama/local models because hosted model
credits ran out.

## 6. Remaining goals

The assignment bonus challenge mentions: 1. Dark/light mode. 2. Event
countdown timers. 3. Animations. 4. LocalStorage-based registration data
management.

LocalStorage registration management is already implemented as part of
Phase 3. Verify and document it; do not rebuild it unnecessarily.

The user wants to implement the remaining bonus features, but the
immediate priority is to implement them safely without damaging existing
event discovery or registration.

### Outstanding known UI issue: event image flash

On `event-details.html`, when opening an event, the main image briefly
displays the first/dummy event's image and then switches to the selected
event's image.

Likely area to inspect: initial hardcoded placeholder content in
`event-details.html` and the JavaScript that replaces it after loading
the event selected by `?id=...`. This is a hypothesis, not a confirmed
root cause.

Fix this without changing event data or the detail page's overall
layout. Avoid showing another event's image during loading; use a
neutral placeholder or hide the event content until the selected event
data is rendered.

### Countdown feature requirements

-   Homepage: countdown for the actual featured event.
-   Event details page: independent countdown for the selected event.
-   Read the event's actual date/time from the existing central event
    data; never hardcode countdown values or duplicate event dates in
    HTML.
-   Update once per second.
-   Handle invalid dates and dates that have passed.
-   Stop/clear intervals when no longer needed.
-   Preserve all 8 events, event IDs, event card rendering, search,
    filters, registration and LocalStorage.
-   Do not modify event records merely to implement the countdown.
-   Do not rewrite `js/events.js` event data or event card generation to
    add the timer.
-   Prefer a small isolated countdown module/function and minimal
    HTML/CSS hooks.
-   Do not claim an event has "started" unless available data supports
    that conclusion. If only a start datetime is available, show a
    neutral past-start message when it passes.

### Dark/light mode requirements

-   Add a theme toggle in the shared navigation/header.
-   Preserve the SCENE colour identity in both themes.
-   Persist the selected theme in LocalStorage.
-   Apply the theme consistently across all pages.
-   Avoid flash of the wrong theme on page load where practical.
-   Respect keyboard accessibility and reduced-motion preferences.

### Animation requirements

-   Add subtle, purposeful transitions/reveal effects only.
-   Respect `prefers-reduced-motion`.
-   Do not make the site feel like a generic SaaS template.
-   Do not introduce animation libraries.

## 7. Regression prevention rules

Before any implementation: 1. Read `AGENTS.md`, `README.md`, and this
`progress.md`. 2. Inspect actual files and current Git state. 3. Run
existing tests and record the baseline. 4. Confirm there are exactly 8
event records. 5. Confirm homepage and events page display all events.
6. Confirm search, filters, details, registration, cancellation and
LocalStorage work. 7. Identify the smallest possible change set.

After each feature: 1. Reconfirm all 8 event records remain. 2.
Reconfirm all 8 appear in the events listing. 3. Test featured events on
homepage. 4. Test search and category filtering. 5. Open multiple event
detail URLs and confirm correct event data appears. 6. Test registration
and cancellation. 7. Re-run all existing tests. 8. Inspect browser
console for errors. 9. Review the diff; reject unrelated rewrites.

**Never remove, replace, reorder, or recreate event records to implement
a feature.** **Never rewrite event listing or card-rendering logic for
the countdown.** **Never commit, push, or deploy automatically.** **Do
not use `git reset --hard` or discard changes without checking
`git status` and confirming what will be lost.**

## 8. Suggested Git workflow

Keep each feature in its own commit. Commit only after reviewing the
diff and passing tests.

Suggested future commit messages: -
`fix: prevent incorrect event image flash` -
`feat: add dynamic event countdown timer` -
`feat: add persistent dark and light themes` -
`feat: add accessible interface animations` -
`docs: update SCENE project documentation`

Do not create artificial commits just to increase the commit count.

## 9. README and AGENTS documentation status

A prior audit found that `README.md` and `AGENTS.md` needed updates: -
Replace outdated K Explore branding with SCENE where it describes the
actual finished website. - Add the live Netlify URL and correct GitHub
repository URL. - Document actual project structure and features. -
Correct inaccurate claims about mobile-first CSS or URL-synchronised
search. - Explain LocalStorage accurately: registrations are stored only
in the current browser and are not shared between devices/users. - Add
screenshots if available. - Update `AGENTS.md` so it describes the final
SCENE design and architecture rather than the original assignment's
outdated design direction.

The user postponed these documentation edits while fixing functionality.
Check current files before editing; they may have been updated since
this note was written.

## 10. Handoff instructions for any new AI model/agent

"You are continuing an existing, mostly completed student project. Read
`progress.md`, `AGENTS.md`, and `README.md` first. Inspect the current
source and Git status before editing. The current restored working
version is the source of truth. Do not assume earlier failed countdown
code is present. Do not rebuild the site. Make one small, isolated
change at a time. Preserve all 8 events and all existing functionality.
Run existing tests before and after each change. Do not commit, push, or
deploy. If the root cause is unclear or a safe minimal fix cannot be
made, explain findings and ask before proceeding."

## 11. Immediate next actions

1.  Verify the restored working tree with `git status`.
2.  Run the existing test suites.
3.  Confirm 8 events exist and are displayed.
4.  Investigate and fix the event-image flash as a separate small task.
5.  Implement the countdown in isolation and test it before moving on.
6.  Only then implement dark/light mode and animations.
7.  Update README and AGENTS documentation.
8.  Commit and push reviewed, tested changes.


## 12. Phase 1 Completed: Event Details Image & Content Flash Fix

Completed: 7 November 2026

### What was implemented:
- Replaced the hardcoded dummy hackathon image (`assets/images/event-hackathon.jpg`) in `event-details.html` with SCENE's neutral brand placeholder (`assets/images/placeholder.svg`).
- Cleared static hackathon text (title, about description, schedule highlights, eligibility, logistics date/venue/capacity/fee, and pre-selected form input) from the HTML template.
- Added `id="detail-price-badge"` to the badge next to category and dynamically populated it with `event.price` in `js/events.js`.
- Replaced the hardcoded page title and meta description in `event-details.html` with neutral placeholders until dynamic binding occurs.
- Preserved existing layout, aspect ratio (`16 / 10`), broken-image fallback handling (`data-fallback="assets/images/placeholder.svg"`), and graceful invalid event ID handling.

### Files modified:
- `event-details.html`
- `js/events.js`

### Tests performed & results:
- **Static Template Flash Verification**: Confirmed no hardcoded hackathon image or title remains in static HTML. Initial image source is neutral placeholder SVG. (PASS)
- **URL Parameter Binding Tests**:
  - `?id=tech-01`: Correctly binds InnovateX title, hackathon image, Technical badge, Free Admission, pre-selected form input, and document title. (PASS)
  - `?id=cult-01`: Correctly binds Rhythm & Rhapsody title, gala image (`assets/images/event-gala.jpg`), Cultural badge, Complimentary Pass, pre-selected form input, and document title. (PASS)
  - `?id=sport-01`: Correctly binds Football Derby title, sports derby image (`assets/images/event-sports.jpg`), Sports badge, Free Entry, and pre-selected form input. (PASS)
  - `?id=work-01`: Correctly binds AI Masterclass title, workshop image (`assets/images/cat-workshop.jpg`), Workshop badge, and Free Admission. (PASS)
  - `?id=invalid-id`: Confirmed graceful "Event Not Found" error state with return buttons. (PASS)
- **Dataset Integrity**: All 8 original events remain present and unmodified. (PASS)
- **Registration & LocalStorage**: Verified pass creation, duplicate email rejection, pass cancellation, and corrupt LocalStorage recovery. (PASS)

### Current Git status:
- Tracked modified: `event-details.html`, `js/events.js`
- Untracked: `js/countdown.js`, `progress.md`
- No commits made (per instructions).

### Remaining tasks:
1. Implement event countdown timer.
2. Implement dark/light mode (Bonus).
3. Add subtle interface animations (Bonus).
4. Update README and AGENTS documentation.

### Newly discovered issues:
- None. All existing features remain fully functional without regressions.


## 13. Font Consistency & Layout Shift (FOUT) Fix

Completed: 7 November 2026

### Root Cause Analysis:
- Late-loading `@import url(...)` in `css/style.css` created a chained request waterfall (HTML -> `style.css` -> Google Fonts CSS -> WOFF2 binaries).
- Google Fonts `<link>` and `<link rel="preconnect">` tags were missing from all 4 HTML files (`index.html`, `events.html`, `event-details.html`, `registrations.html`).
- The browser initially rendered text using system fallback fonts. In fallback fonts, text had narrower metrics, allowing elements (such as the Events page subtitle) to temporarily fit on one line before `Plus Jakarta Sans` arrived late and triggered a reflow/re-wrap onto two lines.

### What was implemented:
- Added `rel="preconnect"` for `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (crossorigin) to `<head>` across all 4 HTML pages for early DNS/TLS resolution.
- Added canonical `<link rel="stylesheet">` for Google Fonts in `<head>` preceding `css/style.css` across all 4 HTML pages (`JetBrains Mono` 500,600; `Playfair Display` 400,600,700,900, italic 400,600; `Plus Jakarta Sans` 400,500,600,700; `display=swap`).
- Removed late-loading `@import` rule from `css/style.css`, eliminating CSS parsing delays and redundant stylesheet fetches.
- Preserved existing CSS typography variables (`--font-serif`, `--font-sans`, `--font-mono`) and all styling.

### Files modified:
- `index.html`
- `events.html`
- `event-details.html`
- `registrations.html`
- `css/style.css`
- `progress.md`

### Tests performed & results:
- **Canonical Font Links Verification**: Verified all 4 HTML files contain identical preconnect and font links in correct document order. (PASS)
- **CSS Import Check**: Verified `css/style.css` contains zero `@import` rules. (PASS)
- **Typography Variable Integrity**: Verified `--font-serif`, `--font-sans`, and `--font-mono` remain configured and referenced throughout CSS. (PASS)
- **Phase 2 & Phase 3 Regressions**: Ran central event data tests, card rendering, category filtering, search, form validation, LocalStorage CRUD, collision resistance, and corrupt storage recovery tests. (ALL PASS)
- **UI Integrity Suite**: Verified modal buttons, card footers, and HTML structure across all 4 pages. (PASS)


## 14. Final Bug Fixes, UI/UX Enhancements, Full Regression & Documentation Completion

Completed: 7 November 2026

### What was completed:
1. **Typography & Layout Stability Fix**:
   - Switched font delivery to `&display=block` with `<link rel="preconnect">` in `<head>` of all 4 pages.
   - Removed blocking `@import` from `css/style.css`.
   - Increased `.section-subtitle` `max-width` to `660px` to prevent line-wrapping shifts on standard screens.
2. **Event Details Content & Image Flickering Fix**:
   - Replaced hardcoded static InnovateX content in `event-details.html` with neutral placeholders and SVG fallback image.
   - Dynamically bound `#detail-price-badge` and event parameters inside `initEventDetailsPage()` in `js/events.js`.
3. **Dark Mode Contrast & Modal Styling Fix**:
   - Corrected `--text-inverse: #F3ECE1;` in `[data-theme="dark"]`, fixing dark-on-black manifesto quote (achieving 16.74:1 WCAG AAA contrast ratio).
   - Styled `[data-theme="dark"] .modal-dialog` with dark palette surfaces instead of mismatched selector.
4. **UI/UX Quality-of-Life Improvements**:
   - Implemented fixed scroll progress bar (`#scroll-progress`) at the top of the viewport.
   - Implemented floating back-to-top button (`#back-to-top`) with smooth scroll and reduced-motion support.
   - Optimized image loading: hero images eager-loaded, below-fold images lazy-loaded.
   - Added visible keyboard focus rings (`:focus-visible` and `:focus-within`) for accessible navigation.
5. **Documentation & Verification**:
   - Rewrote `README.md` to comprehensively document all 12 requested sections accurately.
   - Ran 275-point regression test suite (`scratch/test_regression.js`) — 100% PASS (275/275).
   - Ran focused final fixes test suite (`scratch/test_final_fixes.js`) — 100% PASS (8/8).
   - Ran simulated browser DOM/script execution across all 4 pages (`scratch/test_browser_all.js`) — 100% PASS (0 runtime errors).
