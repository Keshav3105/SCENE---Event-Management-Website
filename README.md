# SCENE — Campus Event Discovery & Culture Platform

> *"Your campus. Your scene."*

A photography-driven, editorial event discovery platform for university culture, hackathons, sports derbies, and creative workshops. Built as a Web Designing minor college assignment using semantic HTML5, modern CSS3, and vanilla JavaScript.

---

## 📌 Brand & Visual Identity

**SCENE** breaks away from conventional SaaS dashboard templates in favor of a warm, tactile, and editorial visual language:
- **Design Direction**: Editorial + Nostalgic + Contemporary + Photography-driven.
- **Palette**: Warm ivory canvas (`#F5F0E7`), deep espresso typography (`#211B18`), burnt orange accents (`#C6532D`), and muted slate tones (`#7E97A6`).
- **Typography**: Expressive editorial serif headlines (**Playfair Display**) paired with contemporary sans-serif body text (**Plus Jakarta Sans**).
- **Art Direction**: Curated high-resolution photography stored locally, asymmetrical hero composition, horizontal visual chronicle strips, and magazine-style layout grids.

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 with accessibility attributes (`aria-*`, `role`).
- **Styling**: Modern CSS3 (CSS Custom Properties, Flexbox, CSS Grid, mobile-first responsive media queries).
- **Interactivity**: Vanilla JavaScript (ES6+), DOM manipulation, `URLSearchParams`, and `localStorage` API.
- **Dependencies**: Zero runtime frameworks or external libraries.

---

## 📂 Project Structure

```text
k-explore/
├── AGENTS.md               # Assignment brief and development rules
├── README.md               # Project documentation and brand guide
├── .gitignore              # Ignored files and directories
├── index.html              # SCENE Homepage (Hero, visual chronicle, curated lineup)
├── events.html             # Events catalog with search & category filters
├── event-details.html      # Event editorial overview & registration shell
├── registrations.html      # My Registrations dashboard & pass management
├── css/
│   └── style.css           # SCENE design system & responsive stylesheet
├── js/
│   ├── events.js           # Central event catalog and lookup utilities
│   ├── storage.js          # LocalStorage CRUD and validation engine
│   ├── registration.js     # Form validation and registration controller
│   └── main.js             # Mobile navigation & image fallback handlers
└── assets/
    └── images/             # Local photography archive & fallback SVG
```

---

## 🚀 Getting Started

No build step or package manager is required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-username>/k-explore.git
   cd k-explore
   ```
2. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, serve using a lightweight local web server (e.g., Live Server in VS Code, or `python -m http.server 8000`).

---

## 📋 Implementation Progress

- [x] **Milestone 1**: Scaffolding, repository setup, shared navigation, and initial README.
- [x] **Milestone 2**: Complete SCENE Homepage redesign (warm ivory palette, asymmetrical collage hero, visual chronicle strip, curated editorial lineup, photo category grid).
- [x] **Milestone 3**: Redesigned Events catalog, Event Details, and My Registrations pages with SCENE visual identity.
- [x] **Milestone 4**: Centralized event dataset (`js/events.js`) with sample events and local image mapping.
- [x] **Milestone 5**: Interactive search, category filters, combined filtering, URL query parameter syncing, and empty state.
- [x] **Milestone 6**: Dynamic Event Details lookup (`?id=...`) and graceful invalid ID handling.
- [x] **Milestone 7**: Registration form validation (full name, RFC email, 10-digit Indian phone) and inline UX feedback.
- [x] **Milestone 8**: Defensive LocalStorage engine (`js/storage.js`), collision-resistant ID generation, and duplicate prevention.
- [x] **Milestone 9**: Interactive My Registrations dashboard (`registrations.html`) with cancellation confirmation modal and empty state.
- [ ] **Milestone 10**: Final verification, accessibility audit, and submission prep.

---

## 📝 Author & Acknowledgements

Developed for Web Designing minor assignment.
