/**
 * SCENE - Centralized Event Data Store & Discovery Helpers
 * Contains all campus event records, categories, and query lookup methods.
 */

const CAMPUS_EVENTS = [
  {
    id: 'tech-01',
    title: 'InnovateX 2026: Campus Hackathon',
    category: 'Technical',
    date: 'November 15, 2026',
    time: '09:00 AM',
    datetimeDisplay: 'November 15, 2026 • 09:00 AM',
    venue: 'Tech Innovation Complex, Hall A',
    image: 'assets/images/event-hackathon.jpg',
    price: 'Free Admission',
    capacity: '300 Seats (Limited)',
    featured: true,
    flagship: true,
    shortDescription: 'A 36-hour sprint bringing together student developers, designers, and innovators to build impactful campus solutions.',
    fullDescription: 'InnovateX is our university’s premier annual 36-hour hackathon bringing together students across engineering, design, and business disciplines. Participants form multidisciplinary teams of 2 to 4 members to conceptualize, prototype, and pitch tech-driven solutions for challenges across Smart Campus Sustainability, HealthTech, and Generative AI applications. Mentors from leading tech firms will provide hands-on guidance throughout the weekend.',
    highlights: [
      'Day 1 (09:00 AM): Opening Keynote, Track Announcements & Team Formation.',
      'Day 1 (02:00 PM): Hands-on API & Cloud Sandbox Mentorship Workshop.',
      'Day 2 (10:00 AM): Mid-way Code Review and Pitch Coaching Sessions.',
      'Day 2 (04:00 PM): Final Project Expo, Jury Demos, and Awards Ceremony.'
    ],
    eligibility: 'Open to all enrolled undergraduate and postgraduate students. Bring your university ID card, laptop, charger, and an enthusiastic mindset. Meals and high-speed network access are provided.'
  },
  {
    id: 'cult-01',
    title: 'Rhythm & Rhapsody: Annual Spring Gala',
    category: 'Cultural',
    date: 'November 22, 2026',
    time: '05:30 PM',
    datetimeDisplay: 'November 22, 2026 • 05:30 PM',
    venue: 'Open Air Amphitheatre',
    image: 'assets/images/event-gala.jpg',
    price: 'Complimentary Pass',
    capacity: '800 Seats',
    featured: true,
    flagship: false,
    shortDescription: 'An electrifying evening of contemporary choreography, live collegiate bands, and theatrical performances celebrating campus creativity.',
    fullDescription: 'Rhythm & Rhapsody is the university’s signature cultural celebration. Under the stars of the Open Air Amphitheatre, the evening showcases the finest collegiate musicians, contemporary fusion ensembles, and award-winning street dance crews. Experience live original compositions alongside vibrant classical and pop acts.',
    highlights: [
      '05:30 PM: Acoustic Lounge & Student Visual Arts Showcase.',
      '06:45 PM: Departmental Choral & Instrumental Performances.',
      '08:00 PM: Battle of the College Bands & Headline Rock Act.',
      '09:30 PM: Grand Finale Dance Showcase.'
    ],
    eligibility: 'Open to all students, alumni, and faculty members. Free entrance pass required for seating allocation.'
  },
  {
    id: 'sport-01',
    title: 'Campus Premier League: Football Derby',
    category: 'Sports',
    date: 'December 03, 2026',
    time: '03:00 PM',
    datetimeDisplay: 'December 03, 2026 • 03:00 PM',
    venue: 'University Sports Complex • Stadium 1',
    image: 'assets/images/event-sports.jpg',
    price: 'Free Entry',
    capacity: '1,200 Spectators',
    featured: true,
    flagship: false,
    shortDescription: 'Inter-department football championship with 16 departmental teams competing for victory and the annual trophy.',
    fullDescription: 'The biggest athletic showdown of the semester. The Campus Premier League Football Derby pits the top collegiate squads against each other in high-intensity knockout matches. Expect thunderous student cheering, official referees, live match commentary, and half-time entertainment.',
    highlights: [
      '03:00 PM: Semi-Final 1 (Computer Science vs. Mechanical).',
      '04:45 PM: Semi-Final 2 (Electronics vs. Civil Engineering).',
      '06:15 PM: Half-Time Skills Exhibition & Crossbar Challenge.',
      '07:00 PM: Championship Final & Trophy Presentation.'
    ],
    eligibility: 'Open seating in Stadium 1 stands. Bring your college fan gear and ID card for venue access.'
  },
  {
    id: 'work-01',
    title: 'Fullstack AI & Modern Web Masterclass',
    category: 'Workshop',
    date: 'December 12, 2026',
    time: '10:00 AM',
    datetimeDisplay: 'December 12, 2026 • 10:00 AM',
    venue: 'Computer Labs • Room 302',
    image: 'assets/images/cat-workshop.jpg',
    price: 'Free Admission',
    capacity: '60 Participants (Preregistration required)',
    featured: false,
    flagship: false,
    shortDescription: 'Learn modern client-side architectures, API integration, and deployment workflows with industry practitioners.',
    fullDescription: 'An intensive, hands-on four-hour technical masterclass focusing on building responsive modern web applications powered by generative AI endpoints and client-side persistence. Led by alumni working at premier product companies, participants will build and deploy a working project during the session.',
    highlights: [
      '10:00 AM: Modern Frontend Architecture & Semantic Web Patterns.',
      '11:15 AM: RESTful Integration & Client-side Storage Design.',
      '12:30 PM: AI Microservices & Prompt Engineering in Code.',
      '01:30 PM: Project Demos, Q&A, and Certification of Attendance.'
    ],
    eligibility: 'Open to 2nd, 3rd, and 4th-year undergraduates. Basic familiarity with HTML, CSS, and JavaScript is recommended. University lab computers provided.'
  },
  {
    id: 'tech-02',
    title: 'Autonomous Robotics & Cyber-Physical Expo',
    category: 'Technical',
    date: 'December 19, 2026',
    time: '11:00 AM',
    datetimeDisplay: 'December 19, 2026 • 11:00 AM',
    venue: 'Mechatronics Innovation Arena',
    image: 'assets/images/cat-tech.jpg',
    price: 'Free Admission',
    capacity: '250 Visitors',
    featured: false,
    flagship: false,
    shortDescription: 'Live demonstrations of drone navigation, humanoid robotics, and embedded IoT systems built by student research groups.',
    fullDescription: 'The annual Cyber-Physical Systems Expo spotlights breakthrough student engineering projects from robotics research labs across campus. Featuring live obstacle navigation trials, automated warehouse bot races, and hands-on sensor programming booths.',
    highlights: [
      '11:00 AM: Keynote on Autonomous Mobile Navigation Systems.',
      '12:30 PM: Robot Maze Challenge & Obstacle Avoidance Trials.',
      '02:00 PM: Interactive Drone Simulator Arena.',
      '03:30 PM: Best Hardware Prototype Innovation Awards.'
    ],
    eligibility: 'Open to all students, faculty, and visiting high school tech enthusiasts.'
  },
  {
    id: 'cult-02',
    title: 'Echoes & Footlights: Dramatic Arts Festival',
    category: 'Cultural',
    date: 'January 09, 2027',
    time: '06:00 PM',
    datetimeDisplay: 'January 09, 2027 • 06:00 PM',
    venue: 'Central Auditorium',
    image: 'assets/images/strip-theater.jpg',
    price: 'Free Admission',
    capacity: '450 Seats',
    featured: false,
    flagship: false,
    shortDescription: 'A curated evening of one-act plays, original student monologues, and experimental theatrical storytelling.',
    fullDescription: 'Presented by the University Dramatics Society, Echoes & Footlights is a celebration of student playwrights and actors. This year’s festival features three original one-act productions exploring human connection, satire, and campus coming-of-age stories.',
    highlights: [
      '06:00 PM: Opening Play: "The Midnight Circuit" (Satire).',
      '07:15 PM: Original Monologue Competition Finalists.',
      '08:00 PM: Headlining Drama: "City of Echoes".',
      '09:15 PM: Audience Choice & Best Actor Accolades.'
    ],
    eligibility: 'All students and staff welcome. Doors close promptly at 05:55 PM to avoid performance disruptions.'
  },
  {
    id: 'sport-02',
    title: 'Inter-Collegiate Badminton Open Championship',
    category: 'Sports',
    date: 'January 16, 2027',
    time: '09:30 AM',
    datetimeDisplay: 'January 16, 2027 • 09:30 AM',
    venue: 'Indoor Sports Arena • Courts 1-4',
    image: 'assets/images/cat-sports.jpg',
    price: 'Free Admission',
    capacity: '350 Spectators',
    featured: false,
    flagship: false,
    shortDescription: 'Singles and doubles badminton matches featuring elite student shuttlers competing for university ranking points.',
    fullDescription: 'Sanctioned by the University Sports Board, the Badminton Open features Men’s Singles, Women’s Singles, and Mixed Doubles divisions. Experience high-octane smashes, lightning rallies, and intense sportsmanship.',
    highlights: [
      '09:30 AM: Preliminary Rounds (Singles & Doubles).',
      '01:00 PM: Quarter-Finals and Semi-Final Shootouts.',
      '04:30 PM: Championship Finals Across All Divisions.',
      '06:00 PM: Medal Ceremony & All-Star Player Recognitions.'
    ],
    eligibility: 'Spectator entry is free for all students. Non-marking indoor athletic shoes required in court areas.'
  },
  {
    id: 'work-02',
    title: 'Generative Design & Typography Workshop',
    category: 'Workshop',
    date: 'January 23, 2027',
    time: '02:00 PM',
    datetimeDisplay: 'January 23, 2027 • 02:00 PM',
    venue: 'School of Design • Studio B',
    image: 'assets/images/strip-workshop.jpg',
    price: 'Free Admission',
    capacity: '40 Participants',
    featured: false,
    flagship: false,
    shortDescription: 'Explore algorithmic editorial layouts, creative coding, and experimental typography in a collaborative studio setup.',
    fullDescription: 'Merge classical editorial design principles with creative programming. In this studio workshop, students will learn how to build dynamic visual identities, custom type animations, and generative poster art using browser-native technologies.',
    highlights: [
      '02:00 PM: The Art of Editorial Type: Hierarchy & Voice.',
      '03:00 PM: Generative Canvas & SVG Layout Techniques.',
      '04:30 PM: Hands-on Poster Jam & Peer Feedback Critique.',
      '05:30 PM: Digital Exhibition Showcase.'
    ],
    eligibility: 'Open to all interested students regardless of department. Bring a laptop with a modern web browser.'
  }
];

/**
 * Returns all campus events.
 */
function getAllEvents() {
  return [...CAMPUS_EVENTS];
}

/**
 * Retrieves a single event by unique ID.
 * @param {string} id
 */
function getEventById(id) {
  if (!id) return null;
  return CAMPUS_EVENTS.find(e => e.id.toLowerCase() === id.trim().toLowerCase()) || null;
}

/**
 * Returns featured flagship events.
 */
function getFeaturedEvents() {
  return CAMPUS_EVENTS.filter(e => e.featured);
}

/**
 * Filters events by case-insensitive keyword (title or venue) and category.
 * @param {string} query
 * @param {string} category
 */
function filterEvents(query = '', category = 'All') {
  const cleanQuery = query.trim().toLowerCase();
  const cleanCat = category.trim().toLowerCase();

  return CAMPUS_EVENTS.filter(event => {
    const matchesCategory =
      cleanCat === 'all' ||
      cleanCat === '' ||
      event.category.toLowerCase() === cleanCat;

    const matchesQuery =
      cleanQuery === '' ||
      event.title.toLowerCase().includes(cleanQuery) ||
      event.venue.toLowerCase().includes(cleanQuery) ||
      event.shortDescription.toLowerCase().includes(cleanQuery);

    return matchesCategory && matchesQuery;
  });
}

/**
 * Generates badge CSS class based on category name.
 * @param {string} category
 */
function getCategoryBadgeClass(category) {
  const cat = (category || '').toLowerCase();
  switch (cat) {
    case 'technical': return 'badge-tech';
    case 'cultural': return 'badge-cultural';
    case 'sports': return 'badge-sports';
    case 'workshop': return 'badge-workshop';
    default: return 'badge-outline';
  }
}

/**
 * Builds HTML for a standard event catalog card.
 * @param {Object} event
 */
function renderEventCardHTML(event) {
  const badgeClass = getCategoryBadgeClass(event.category);
  return `
    <article class="event-card" data-id="${escapeHTML(event.id)}">
      <div class="event-card-media">
        <img src="${escapeHTML(event.image)}"
             alt="${escapeHTML(event.title)}"
             class="event-card-img"
             loading="lazy"
             data-fallback="assets/images/placeholder.svg">
        <div class="event-card-badge-wrap">
          <span class="badge ${badgeClass}">${escapeHTML(event.category)}</span>
        </div>
      </div>
      <div class="event-card-body">
        <h2 class="event-card-title">${escapeHTML(event.title)}</h2>
        <div class="event-meta-list">
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${escapeHTML(event.datetimeDisplay)}</span>
          </div>
          <div class="event-meta-item">
            <svg class="event-meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${escapeHTML(event.venue)}</span>
          </div>
        </div>
        <p class="event-card-desc">${escapeHTML(event.shortDescription)}</p>
        <div class="event-card-footer">
          <span class="event-price-tag">${escapeHTML(event.price)}</span>
          <a href="event-details.html?id=${encodeURIComponent(event.id)}" class="btn btn-primary btn-sm">Details &rarr;</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Builds HTML for empty state when no events match the search/category filters.
 * @param {string} query
 * @param {string} category
 */
function renderEmptyStateHTML(query = '', category = 'All') {
  let message = 'No upcoming campus events matched your current filters.';
  if (query && category !== 'All') {
    message = `No events found matching &ldquo;${escapeHTML(query)}&rdquo; in the ${escapeHTML(category)} track.`;
  } else if (query) {
    message = `No events found matching &ldquo;${escapeHTML(query)}&rdquo;. Try another keyword.`;
  } else if (category !== 'All') {
    message = `No events are currently scheduled under the ${escapeHTML(category)} track.`;
  }

  return `
    <div class="empty-state" style="grid-column: 1 / -1;" role="status">
      <div class="empty-icon" aria-hidden="true">🔍</div>
      <h3 class="empty-title">No Matching Events Found</h3>
      <p class="empty-desc">${message}</p>
      <button type="button" id="reset-filters-btn" class="btn btn-primary">
        Reset All Filters
      </button>
    </div>
  `;
}

/* ==========================================================================
   Page Controllers for Events Discovery
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('events-catalog-grid')) {
    initEventsCatalogPage();
  }
  if (document.getElementById('event-detail-container')) {
    initEventDetailsPage();
  }
  if (document.getElementById('featured-events-container')) {
    initHomePageFeatured();
  }
});

/**
 * Controller for events.html: Live search, category filtering, combined filtering, and URL params.
 */
function initEventsCatalogPage() {
  const grid = document.getElementById('events-catalog-grid');
  const searchInput = document.getElementById('event-search-input');
  const filterPills = document.querySelectorAll('.filter-pill');
  const countBadge = document.getElementById('events-count-badge');

  if (!grid) return;

  // Read URL query parameters (e.g., ?category=Technical or ?search=hackathon)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('category') || 'All';
  const initialQuery = urlParams.get('search') || '';

  let currentCategory = initialCat;
  let currentQuery = initialQuery;

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  // Set active filter pill based on URL or default
  filterPills.forEach(pill => {
    const pillCat = pill.getAttribute('data-category');
    if (pillCat && pillCat.toLowerCase() === currentCategory.toLowerCase()) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Render function that executes combined search and category filtering
  function applyFilters() {
    const matched = filterEvents(currentQuery, currentCategory);

    if (matched.length > 0) {
      grid.innerHTML = matched.map(e => renderEventCardHTML(e)).join('');
      if (countBadge) {
        countBadge.textContent = `Showing ${matched.length} campus event${matched.length === 1 ? '' : 's'}`;
      }
    } else {
      grid.innerHTML = renderEmptyStateHTML(currentQuery, currentCategory);
      if (countBadge) {
        countBadge.textContent = 'No events match your criteria';
      }

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'All';
          currentQuery = '';
          if (searchInput) searchInput.value = '';
          filterPills.forEach(p => {
            if (p.getAttribute('data-category') === 'All') p.classList.add('active');
            else p.classList.remove('active');
          });
          applyFilters();
          // Update URL cleanly without reloading
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        });
      }
    }

    // Reattach fallback handlers to newly injected image elements
    if (typeof initImageFallbacks === 'function') {
      initImageFallbacks();
    }
  }

  // Handle live search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value;
      applyFilters();
    });
  }

  // Handle category filter pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category') || 'All';

      // Update URL query parameter cleanly
      const url = new URL(window.location);
      if (currentCategory !== 'All') {
        url.searchParams.set('category', currentCategory);
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState({}, '', url);

      applyFilters();
    });
  });

  // Initial render
  applyFilters();
}

/**
 * Controller for event-details.html: reads query param ?id=..., retrieves event, or displays error state.
 */
function initEventDetailsPage() {
  const container = document.getElementById('event-detail-container');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (!eventId) {
    renderMissingEventState('No Event Selected', 'Please choose an event from our catalog to view schedules, venues, and registration passes.');
    return;
  }

  const event = getEventById(eventId);
  if (!event) {
    renderMissingEventState('Event Not Found', `We could not find an event with the ID &ldquo;${escapeHTML(eventId)}&rdquo;. It may have concluded or the link might be incorrect.`);
    return;
  }

  // Update Document Title
  document.title = `${event.title} — SCENE`;

  // Render Full Event Content
  const detailImg = document.getElementById('detail-image');
  if (detailImg) {
    detailImg.src = event.image;
    detailImg.alt = event.title;
  }

  const categoryBadge = document.getElementById('detail-category-badge');
  if (categoryBadge) {
    categoryBadge.className = `badge ${getCategoryBadgeClass(event.category)}`;
    categoryBadge.textContent = event.category;
  }

  const titleEl = document.getElementById('detail-title');
  if (titleEl) titleEl.textContent = event.title;

  const descEl = document.getElementById('detail-desc');
  if (descEl) descEl.textContent = event.fullDescription;

  const dateEl = document.getElementById('detail-date');
  if (dateEl) dateEl.textContent = event.datetimeDisplay;

  const venueEl = document.getElementById('detail-venue');
  if (venueEl) venueEl.textContent = event.venue;

  const capacityEl = document.getElementById('detail-capacity');
  if (capacityEl) capacityEl.textContent = event.capacity;

  const feeEl = document.getElementById('detail-fee');
  if (feeEl) feeEl.textContent = event.price;

  const eligEl = document.getElementById('detail-eligibility');
  if (eligEl) eligEl.textContent = event.eligibility;

  // Pre-fill registration event input
  const regEventInput = document.getElementById('reg-event-name');
  if (regEventInput) {
    regEventInput.value = event.title;
    regEventInput.setAttribute('data-event-id', event.id);
  }

  // Populate Highlights List
  const highlightsContainer = document.getElementById('detail-highlights-list');
  if (highlightsContainer && Array.isArray(event.highlights)) {
    highlightsContainer.innerHTML = event.highlights.map(h => `<li>${h}</li>`).join('');
  }

  // Reattach image fallback
    if (typeof initImageFallbacks === 'function') {
    initImageFallbacks();
  }

  // Initialize countdown for selected event
  const detailCountdownEl = document.getElementById('detail-countdown');
  if (detailCountdownEl && typeof startCountdown === 'function') {
    startCountdown(event.date, event.time, detailCountdownEl);
  }
}

/**
 * Displays a clean, editorial empty/error state when an event ID is invalid or missing.
 */
function renderMissingEventState(title, message) {
  const container = document.getElementById('event-detail-container');
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1; margin: 4rem auto; max-width: 620px;" role="alert">
      <div class="empty-icon" aria-hidden="true">🎫</div>
      <h2 class="empty-title">${title}</h2>
      <p class="empty-desc">${message}</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="events.html" class="btn btn-primary">&larr; Return to Events Catalog</a>
        <a href="index.html" class="btn btn-outline">Go to Homepage</a>
      </div>
    </div>
  `;
}

/**
 * Controller for index.html: renders featured events lineup dynamically from central data.
 */
function initHomePageFeatured() {
  const container = document.getElementById('featured-events-container');
  if (!container) return;

  const featured = getFeaturedEvents();
  if (featured.length === 0) return;

  const flagship = featured.find(e => e.flagship) || featured[0];
  const supporting = featured.filter(e => e.id !== flagship.id).slice(0, 2);

  container.innerHTML = `
    <div class="editorial-events-layout">
      <!-- Flagship Main Card -->
      <article class="flagship-event-card">
        <div class="flagship-media">
          <img src="${flagship.image}"
               alt="${flagship.title}"
               loading="lazy"
               data-fallback="assets/images/placeholder.svg">
          <div class="flagship-badge-overlay">
            <span class="badge ${getCategoryBadgeClass(flagship.category)}">${flagship.category}</span>
          </div>
        </div>
        <div class="flagship-body">
          <h3 class="flagship-title">${flagship.title}</h3>
          <div class="flagship-meta">
            <div class="flagship-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${flagship.datetimeDisplay}</span>
            </div>
            <div class="flagship-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${flagship.venue}</span>
            </div>
          </div>
                    <div class="featured-countdown-wrap">
            <span class="countdown-eyebrow">Event Starts In</span>
            <div id="featured-countdown" class="countdown-units" aria-live="polite"></div>
          </div>
          <p class="flagship-desc">${flagship.shortDescription}</p>
          <div class="event-card-footer">
            <span class="event-price-tag">${flagship.price}</span>
            <a href="event-details.html?id=${encodeURIComponent(flagship.id)}" class="btn btn-primary btn-sm">Details &rarr;</a>
          </div>
        </div>
      </article>

      <!-- Supporting Stack -->
      <div class="supporting-events-stack">
        ${supporting.map(supp => `
          <article class="supporting-event-card">
            <div class="supporting-media">
              <img src="${supp.image}"
                   alt="${supp.title}"
                   loading="lazy"
                   data-fallback="assets/images/placeholder.svg">
              <div class="supporting-badge-wrap">
                <span class="badge ${getCategoryBadgeClass(supp.category)}">${supp.category}</span>
              </div>
            </div>
            <div class="supporting-body">
              <h3 class="supporting-title">${supp.title}</h3>
              <div class="supporting-meta">
                <span>${supp.datetimeDisplay}</span>
                <span>${supp.venue}</span>
              </div>
              <p class="supporting-desc">${supp.shortDescription}</p>
              <div class="event-card-footer">
                <span class="event-price-tag">${supp.price}</span>
                <a href="event-details.html?id=${encodeURIComponent(supp.id)}" class="btn btn-primary btn-sm">Details &rarr;</a>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

    if (typeof initImageFallbacks === 'function') {
    initImageFallbacks();
  }

  // Initialize countdown for flagship featured event
  const featuredCountdownEl = document.getElementById('featured-countdown');
  if (featuredCountdownEl && typeof startCountdown === 'function') {
    startCountdown(flagship.date, flagship.time, featuredCountdownEl);
  }
}

/**
 * Escapes HTML characters to prevent XSS.
 */
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
