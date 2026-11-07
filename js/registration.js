/**
 * SCENE - Registration Controller & Validation Engine
 * Handles form validation, Indian mobile number verification, duplicate rejection,
 * double-submission prevention, and interactive pass cancellation modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('event-registration-form')) {
    initRegistrationForm();
  }
  if (document.getElementById('registrations-list-container')) {
    initMyRegistrationsDashboard();
  }
});

/* ==========================================================================
   Validation Helpers
   ========================================================================== */

/**
 * Validates participant full name: at least 2 characters, alphabetic + common punctuation.
 * @param {string} name
 * @returns {boolean}
 */
function isValidFullName(name) {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.length < 2) return false;
  // Allow letters, spaces, hyphens, and apostrophes
  return /^[a-zA-Z\s'.-]{2,50}$/.test(trimmed);
}

/**
 * Validates email address according to standard email format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email) return false;
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

/**
 * Validates 10-digit Indian mobile number starting with 6, 7, 8, or 9.
 * @param {string} phone
 * @returns {boolean}
 */
function isValidIndianPhone(phone) {
  if (!phone) return false;
  // Strip spaces, dashes, or optional +91 country prefix
  const cleaned = phone.trim().replace(/^(\+91|0)/, '').replace(/[\s-]/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

/* ==========================================================================
   Event Details Registration Form Controller
   ========================================================================== */

function initRegistrationForm() {
  const form = document.getElementById('event-registration-form');
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const eventNameInput = document.getElementById('reg-event-name');
  const submitBtn = form.querySelector('button[type="submit"]');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const alertBanner = document.getElementById('form-alert-banner');

  if (!form || !nameInput || !emailInput || !phoneInput) return;

  // Real-time error dismissal on input
  nameInput.addEventListener('input', () => {
    nameInput.removeAttribute('aria-invalid');
    if (nameError) nameError.classList.remove('visible');
    hideAlertBanner();
  });

  emailInput.addEventListener('input', () => {
    emailInput.removeAttribute('aria-invalid');
    if (emailError) emailError.classList.remove('visible');
    hideAlertBanner();
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.removeAttribute('aria-invalid');
    if (phoneError) phoneError.classList.remove('visible');
    hideAlertBanner();
  });

  function showAlertBanner(message, type = 'warning') {
    if (!alertBanner) return;
    alertBanner.textContent = message;
    alertBanner.className = `alert-banner alert-${type} visible`;
    alertBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlertBanner() {
    if (!alertBanner) return;
    alertBanner.className = 'alert-banner';
    alertBanner.textContent = '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlertBanner();

    let hasErrors = false;

    // 1. Validate Full Name
    const nameVal = nameInput.value;
    if (!isValidFullName(nameVal)) {
      nameInput.setAttribute('aria-invalid', 'true');
      if (nameError) nameError.classList.add('visible');
      hasErrors = true;
    }

    // 2. Validate Email
    const emailVal = emailInput.value;
    if (!isValidEmail(emailVal)) {
      emailInput.setAttribute('aria-invalid', 'true');
      if (emailError) emailError.classList.add('visible');
      hasErrors = true;
    }

    // 3. Validate Indian Mobile
    const phoneVal = phoneInput.value;
    if (!isValidIndianPhone(phoneVal)) {
      phoneInput.setAttribute('aria-invalid', 'true');
      if (phoneError) phoneError.classList.add('visible');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Resolve Event ID from input attribute or URL param
    let eventId = eventNameInput ? eventNameInput.getAttribute('data-event-id') : null;
    if (!eventId) {
      const urlParams = new URLSearchParams(window.location.search);
      eventId = urlParams.get('id');
    }

    const eventRecord = typeof getEventById === 'function' ? getEventById(eventId) : null;
    const resolvedEventId = eventRecord ? eventRecord.id : (eventId || 'campus-event');
    const resolvedEventTitle = eventRecord ? eventRecord.title : (eventNameInput ? eventNameInput.value : 'Campus Event');
    const resolvedCategory = eventRecord ? eventRecord.category : 'General';
    const resolvedDate = eventRecord ? eventRecord.datetimeDisplay : '';
    const resolvedVenue = eventRecord ? eventRecord.venue : '';

    // Safeguard 3: Accidental Double-Submission Prevention
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span style="display:inline-block; animation: spin 1s linear infinite; margin-right: 0.5rem;">⏳</span>
      Reserving Your Pass...
    `;

    try {
      // 4. Duplicate Check
      if (typeof hasDuplicateRegistration === 'function' && hasDuplicateRegistration(resolvedEventId, emailVal)) {
        showAlertBanner(
          `You have already reserved a pass for this event with "${emailVal}". You can review your active passes under My Registrations.`,
          'warning'
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }

      // 5. Save to LocalStorage
      const cleanedPhone = phoneVal.trim().replace(/^(\+91|0)/, '').replace(/[\s-]/g, '');
      const savedRecord = saveRegistration({
        eventId: resolvedEventId,
        eventTitle: resolvedEventTitle,
        category: resolvedCategory,
        eventDate: resolvedDate,
        eventVenue: resolvedVenue,
        attendeeName: nameVal,
        attendeeEmail: emailVal,
        attendeePhone: cleanedPhone
      });

      // Clear Form Fields
      nameInput.value = '';
      emailInput.value = '';
      phoneInput.value = '';

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // 6. Show Success Confirmation Modal
      showSuccessModal(savedRecord);

    } catch (saveError) {
      console.error('[SCENE Registration] Error saving pass:', saveError);
      showAlertBanner(saveError.message || 'An unexpected error occurred while saving your pass. Please try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/**
 * Displays the SCENE editorial pass confirmation modal upon successful registration.
 * @param {Object} record
 */
function showSuccessModal(record) {
  const modal = document.getElementById('registration-success-modal');
  if (!modal) {
    alert(`Pass Confirmed! Registration ID: ${record.id}`);
    return;
  }

  const passIdEl = document.getElementById('modal-pass-id');
  const titleEl = document.getElementById('modal-event-title');
  const attendeeEl = document.getElementById('modal-attendee-name');
  const dateEl = document.getElementById('modal-event-datetime');
  const venueEl = document.getElementById('modal-event-venue');

  if (passIdEl) passIdEl.textContent = record.id;
  if (titleEl) titleEl.textContent = record.eventTitle;
  if (attendeeEl) attendeeEl.textContent = record.attendeeName;
  if (dateEl) dateEl.textContent = record.eventDate;
  if (venueEl) venueEl.textContent = record.eventVenue;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  // Trap focus to close button
  const closeBtn = modal.querySelector('.modal-close-trigger');
  if (closeBtn) closeBtn.focus();
}

/* ==========================================================================
   My Registrations Dashboard Controller (registrations.html)
   ========================================================================== */

function initMyRegistrationsDashboard() {
  const container = document.getElementById('registrations-list-container');
  if (!container) return;

  function renderRegistrations() {
    const list = typeof getStoredRegistrations === 'function' ? getStoredRegistrations() : [];

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;" role="status">
          <div class="empty-icon" aria-hidden="true">🎫</div>
          <h2 class="empty-title">No Passes Reserved Yet</h2>
          <p class="empty-desc">
            You haven’t registered for any campus events yet. Explore upcoming hackathons, galas, and tournaments to claim your pass.
          </p>
          <a href="events.html" class="btn btn-primary">Browse Campus Events &rarr;</a>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(reg => `
      <article class="registration-card reveal-on-scroll" data-pass-id="${escapeHTML(reg.id)}">
        <div class="reg-card-header">
          <span class="reg-id-badge">${escapeHTML(reg.id)}</span>
          <span class="badge ${typeof getCategoryBadgeClass === 'function' ? getCategoryBadgeClass(reg.category) : 'badge-outline'}">${escapeHTML(reg.category)}</span>
        </div>
        
        <div>
          <h2 class="reg-event-title">${escapeHTML(reg.eventTitle)}</h2>
          <div style="font-size: 0.85rem; color: var(--text-dim); margin-top: 0.35rem; font-family: var(--font-sans);">
            Reserved on ${escapeHTML(reg.formattedRegisteredDate)} &bull; Confirmed Pass
          </div>
        </div>

        <div class="reg-meta-box">
          <div class="reg-detail-row">
            <span>Attendee</span>
            <span>${escapeHTML(reg.attendeeName)}</span>
          </div>
          <div class="reg-detail-row">
            <span>Email</span>
            <span>${escapeHTML(reg.attendeeEmail)}</span>
          </div>
          <div class="reg-detail-row">
            <span>Contact</span>
            <span>+91 ${escapeHTML(reg.attendeePhone)}</span>
          </div>
          <div class="reg-detail-row">
            <span>Event Date</span>
            <span>${escapeHTML(reg.eventDate)}</span>
          </div>
          <div class="reg-detail-row">
            <span>Venue</span>
            <span>${reg.eventVenue}</span>
          </div>
        </div>

        <div class="reg-card-footer">
          <button type="button"
                  class="btn btn-subtle btn-sm cancel-pass-trigger"
                  data-pass-id="${escapeHTML(reg.id)}"
                  data-event-title="${escapeHTML(reg.eventTitle)}"
                  aria-label="Cancel pass for ${escapeHTML(reg.eventTitle)}">
            Cancel Pass
          </button>
        </div>
      </article>
    `).join('');

    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }

    // Wire up cancellation prompts
    container.querySelectorAll('.cancel-pass-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const passId = btn.getAttribute('data-pass-id');
        const eventTitle = btn.getAttribute('data-event-title');
        openCancellationModal(passId, eventTitle);
      });
    });
  }

  // Initial render
  renderRegistrations();

  // Handle cancellation modal confirmation
  const cancelModal = document.getElementById('cancel-confirm-modal');
  const confirmCancelBtn = document.getElementById('confirm-cancel-action-btn');

  function openCancellationModal(passId, eventTitle) {
    if (!cancelModal) {
      if (confirm(`Are you sure you want to cancel your pass for "${eventTitle}"?`)) {
        deleteRegistration(passId);
        renderRegistrations();
      }
      return;
    }

    const titleTarget = document.getElementById('cancel-modal-event-title');
    if (titleTarget) titleTarget.textContent = eventTitle;
    if (confirmCancelBtn) confirmCancelBtn.setAttribute('data-target-pass-id', passId);

    cancelModal.classList.add('is-open');
    cancelModal.setAttribute('aria-hidden', 'false');
    if (confirmCancelBtn) confirmCancelBtn.focus();
  }

  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', () => {
      const targetId = confirmCancelBtn.getAttribute('data-target-pass-id');
      if (targetId && typeof deleteRegistration === 'function') {
        const deleted = deleteRegistration(targetId);
        if (deleted) {
          closeAllModals();
          renderRegistrations();
        }
      }
    });
  }
}

/* ==========================================================================
   Shared Modal Utilities (Backdrop, Escape key, Close Triggers)
   ========================================================================== */

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  });
}

// Global dismiss handlers
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close-trigger')) {
    closeAllModals();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});
