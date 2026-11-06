# K Explore --- Antigravity Project Instructions

> This file is the single source of truth for the K Explore college
> assignment. Read it before planning or editing. Follow the phases in
> order. Do not repeatedly ask the user to restate requirements.

## 1. Project goal

Build **K Explore**, a polished, responsive event discovery and
registration website for a Web Designing minor assignment.

The assignment requires: - An attractive homepage and hero section. -
Upcoming/featured event cards with event name, date, venue, image and
short description. - Event browsing, search and category filters. -
Individual event details and a registration option. - Registration
fields: participant name, email, phone number and selected event. -
JavaScript form validation and a success confirmation. - Responsive
layouts for mobile, tablet and desktop. - HTML5, CSS3 and JavaScript. -
Git/GitHub version control, deployment and a README.

Optional enhancements: dark/light mode, countdown timer, animations and
LocalStorage registration storage.

## 2. Fixed technical decisions

-   Use **HTML5, CSS3 and vanilla JavaScript only**.
-   Do not use React, Next.js, TypeScript, a backend, a database,
    authentication or payment processing.
-   Use browser LocalStorage for demo registration persistence.
-   Use a small, understandable multi-page structure.
-   Avoid build tools and dependencies unless a requirement cannot
    reasonably be met without them.
-   Keep the code readable and suitable for a beginner to explain in a
    college viva.
-   Use semantic HTML, accessible labels, keyboard-friendly controls and
    responsive CSS.
-   Use realistic sample events. Clearly treat them as demo data.
-   Do not claim LocalStorage data is shared across devices or visible
    to an administrator.

## 3. Suggested project structure

Create only what is needed; do not create empty or redundant files.

``` text
k-explore/
├── AGENTS.md
├── index.html
├── events.html
├── event-details.html
├── registrations.html
├── css/
│   └── style.css
├── js/
│   ├── events.js
│   ├── main.js
│   ├── registration.js
│   └── storage.js
├── assets/
│   └── images/
├── README.md
└── .gitignore
```

Keep shared navigation, footer and styling consistent across pages. If a
simpler structure is more appropriate, explain the reason before
changing this structure.

## 4. Design direction

Create a modern, premium-looking event discovery platform: - Default
visual direction: deep navy background with restrained purple/blue
accents. - Strong typography, generous spacing and clear visual
hierarchy. - A memorable hero section with a clear "Explore Events" call
to action. - Attractive event cards with useful imagery, date, category,
venue and concise description. - Consistent buttons, form controls,
navigation and footer. - Subtle transitions and hover states; avoid
excessive animation, glass effects or visual clutter. - Mobile
navigation must be usable on small screens. - Maintain readable contrast
and visible keyboard focus. - Use external image URLs only when
appropriate and provide sensible fallbacks. Do not spend time repeatedly
searching for images or redesigning the whole site.

## 5. Required data and functionality

### Event data

Keep sample event data in one central JavaScript file. Each event should
have: - Unique ID - Title - Category - Date and time - Venue - Image -
Short description - Full description - Optional price (clearly labelled
as sample data)

### Event discovery

-   Render event cards from the central data source.
-   Search by event title (and optionally venue).
-   Filter by category.
-   Allow search and category filters to work together.
-   Show a friendly empty state when no event matches.
-   Link each event to its details page using its unique ID in a URL
    query parameter.
-   Handle an invalid or missing event ID gracefully.

### Registration

-   Collect full name, email, 10-digit Indian mobile number and selected
    event.
-   Preselect the event when registration begins from an event details
    page.
-   Validate required fields, email format and mobile number.
-   Show understandable inline validation messages.
-   Do not save invalid submissions.
-   Generate a unique registration ID after successful validation.
-   Save registrations in LocalStorage.
-   Prevent duplicate registration for the same event using the same
    email address.
-   Show a success confirmation with registration ID and event
    information.
-   The My Registrations page must show saved records after refresh.
-   Allow cancellation only after confirmation and remove only the
    selected record.
-   Show a useful empty state when there are no registrations.
-   Handle malformed or missing LocalStorage data safely.

## 6. Credit-efficient working rules

These rules are important: 1. Work in the smallest useful scope. Inspect
only files relevant to the current task. 2. Do not regenerate the whole
project for a small change. 3. Do not repeatedly re-explain or restate
this file in chat. 4. Do not run broad audits after every minor edit.
Test the affected feature first. 5. Do not use browser automation for
every CSS adjustment. Use it for meaningful end-to-end checks. 6. Do not
install packages or add integrations unless necessary and approved. 7.
Prefer one concise implementation pass, followed by one targeted
correction pass. 8. Before editing, briefly state which files will
change and why. 9. If a requirement is ambiguous, choose the simplest
sensible implementation and record the assumption rather than spending
multiple turns exploring alternatives. 10. Do not make speculative
changes to already-working features. 11. Do not repeat a test that has
already passed unless related code changed. 12. Keep responses concise:
summarize files changed, checks run, results and any remaining issue.

## 7. Development phases --- follow sequentially

Do not attempt all phases in one giant operation. Complete one phase,
report its result, and wait for the user's instruction before starting
the next.

### Phase 0 --- Inspect and plan

-   Inspect the workspace.
-   Confirm the project root and current files.
-   Convert the assignment requirements into a short checklist.
-   Propose the smallest suitable implementation plan.
-   Do not write application code yet.
-   Do not create unnecessary planning documents; this `AGENTS.md` is
    the project brief.

### Phase 1 --- Static UI

-   Create the page structure and shared CSS.
-   Build the homepage, event listing, event details shell and
    registrations page shell.
-   Use sample event content.
-   Ensure responsive layouts.
-   Do not implement registration logic yet.
-   Check the pages locally and fix only obvious layout/navigation
    issues.

### Phase 2 --- Event discovery

-   Centralize event data.
-   Implement event rendering, search, category filtering and
    details-page lookup.
-   Test search, combined filters, valid event IDs and invalid event
    IDs.

### Phase 3 --- Registration and LocalStorage

-   Implement form validation, registration IDs, duplicate prevention,
    storage, confirmation, registration listing and cancellation.
-   Test invalid input, valid input, refresh persistence, duplicate
    registration and cancellation.

### Phase 4 --- Optional enhancements

Only after all required features work, consider: - Dark/light mode
persisted in LocalStorage. - Countdown timer for a future event. -
Small, restrained animations. Do not add optional features if they risk
breaking core functionality or the submission deadline.

### Phase 5 --- Final verification

Run a focused final check: - All navigation links work. - Event cards
and details show correct data. - Search and category filters work
together. - Invalid and valid form submissions behave correctly. -
Registration persists after refresh. - Duplicate registration is
prevented. - Cancellation removes the correct record. - Mobile, tablet
and desktop layouts are usable. - No obvious console errors. Report
passed/failed checks honestly. Fix only confirmed issues.

### Phase 6 --- Submission preparation

-   Write a clear README with overview, features, technologies, folder
    structure, local run instructions, LocalStorage explanation and
    screenshot/deployment placeholders.
-   Add a suitable `.gitignore`.
-   Check static hosting compatibility.
-   Provide Git commands, but do not initialize Git, commit, push,
    create a remote repository or deploy without the user's explicit
    approval.
-   Never invent a GitHub or deployment URL.

## 8. Safety and approval boundaries

-   Work only inside the opened K Explore workspace.
-   Do not read unrelated files or enable access outside the workspace.
-   Do not request or store passwords, API keys, tokens or personal
    data.
-   Never expose secrets in code, logs or README.
-   Do not run destructive commands such as deleting directories, bulk
    overwrites, disk operations or cleanup commands without asking
    first.
-   Ask before installing dependencies, changing system settings,
    modifying files outside the workspace, creating Git commits, pushing
    to GitHub or deploying.
-   Do not use `Always Proceed` or disable sandbox protections.
-   If a command is unfamiliar or has broad effects, explain it and
    request approval.
-   Preserve existing user work. Inspect before overwriting files.

## 9. Definition of done

The project is complete when all mandatory assignment requirements work,
the site is responsive, the README is present, the GitHub repository is
ready and the site is deployed. Optional enhancements are secondary to
correctness and a reliable submission.
