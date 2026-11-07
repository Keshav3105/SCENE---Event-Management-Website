/**
 * SCENE - Event Countdown Timer Utility
 *
 * Provides reusable startCountdown(dateStr, timeStr, containerElement) which
 * renders a live days / hours / minutes / seconds countdown inside the given container.
 *
 * Requirements:
 * - Four units: Days, Hours, Minutes, Seconds.
 * - Updates every second.
 * - Handles past events gracefully without negative numbers.
 * - Handles invalid or missing event data gracefully.
 * - Manages and cleans up intervals properly.
 */

/**
 * Parses a date string (e.g. "November 15, 2026") and 12-hour time string
 * (e.g. "09:00 AM") into a JavaScript Date object in local timezone.
 *
 * @param {string} dateStr - Date string
 * @param {string} [timeStr] - Optional 12-hour time string "hh:mm AM/PM"
 * @returns {Date|null} Parsed Date object, or null if invalid.
 */
function parseEventDateTime(dateStr, timeStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const parsed = new Date(dateStr.trim());
  if (isNaN(parsed.getTime())) return null;

  if (timeStr && typeof timeStr === 'string') {
    const timeMatch = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const meridiem = timeMatch[3].toUpperCase();
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      parsed.setHours(hours, minutes, 0, 0);
    }
  } else {
    parsed.setHours(0, 0, 0, 0);
  }

  return parsed;
}

/**
 * Safely clears any active countdown interval associated with a DOM element.
 *
 * @param {HTMLElement} container
 */
function clearCountdown(container) {
  if (container && container._countdownInterval) {
    clearInterval(container._countdownInterval);
    container._countdownInterval = null;
  }
}

/**
 * Starts a live 1-second countdown inside the given container element.
 *
 * @param {string} dateStr - Event date (e.g. "November 15, 2026")
 * @param {string} timeStr - Event time (e.g. "09:00 AM")
 * @param {HTMLElement} container - Target container DOM element
 */
function startCountdown(dateStr, timeStr, container) {
  if (!container) return;

  // Clear any existing timer on this element
  clearCountdown(container);

  const targetDate = parseEventDateTime(dateStr, timeStr);
  if (!targetDate) {
    container.innerHTML = '<span class="countdown-unavailable">Date unavailable</span>';
    return;
  }

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function update() {
    const now = Date.now();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      container.innerHTML = '<span class="countdown-ended">Event has started</span>';
      clearCountdown(container);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    container.innerHTML = `
      <div class="count-unit"><span class="count-value">${pad(days)}</span><span class="count-label">Days</span></div>
      <div class="count-unit"><span class="count-value">${pad(hours)}</span><span class="count-label">Hours</span></div>
      <div class="count-unit"><span class="count-value">${pad(minutes)}</span><span class="count-label">Minutes</span></div>
      <div class="count-unit"><span class="count-value">${pad(seconds)}</span><span class="count-label">Seconds</span></div>
    `;
  }

  // Initial immediate render
  update();

  // If the event hasn't started yet, set 1-second recurring interval
  if (targetDate.getTime() > Date.now()) {
    container._countdownInterval = setInterval(update, 1000);
  }
}

// Clean up intervals when navigating away from page
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('pagehide', () => {
    const activeUnits = document.querySelectorAll('.countdown-units');
    activeUnits.forEach(el => clearCountdown(el));
  });
}

// CommonJS export for automated Node tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { startCountdown, clearCountdown, parseEventDateTime };
}
