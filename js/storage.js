/**
 * SCENE - LocalStorage Engine for Campus Event Registrations
 * Provides safe, defensive CRUD operations with corrupted data recovery and collision-free ID generation.
 */

const STORAGE_KEY = 'scene_registrations';
const CORRUPT_BACKUP_KEY = 'scene_registrations_corrupt_backup';
const generatedSessionIds = new Set();

/**
 * Retrieves all stored registrations safely from LocalStorage.
 * Recovers gracefully from corrupted JSON without silent data destruction.
 * @returns {Array<Object>}
 */
function getStoredRegistrations() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('[SCENE Storage] Expected array in LocalStorage, found non-array. Backing up corrupted data.');
      localStorage.setItem(CORRUPT_BACKUP_KEY, rawData);
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('[SCENE Storage] LocalStorage JSON parsing error (recovering):', error);
    try {
      // Backup unparseable raw string before returning clean slate
      const badData = localStorage.getItem(STORAGE_KEY);
      if (badData) {
        localStorage.setItem(CORRUPT_BACKUP_KEY, badData);
      }
      localStorage.setItem(STORAGE_KEY, '[]');
    } catch (backupErr) {
      console.error('[SCENE Storage] Failed to backup corrupt data:', backupErr);
    }
    return [];
  }
}

/**
 * Checks whether an email is already registered for a specific event ID.
 * @param {string} eventId
 * @param {string} email
 * @returns {boolean}
 */
function hasDuplicateRegistration(eventId, email) {
  if (!eventId || !email) return false;
  const cleanId = String(eventId).trim().toLowerCase();
  const cleanEmail = String(email).trim().toLowerCase();

  const registrations = getStoredRegistrations();
  return registrations.some(reg => 
    String(reg.eventId).trim().toLowerCase() === cleanId &&
    String(reg.attendeeEmail).trim().toLowerCase() === cleanEmail
  );
}

/**
 * Generates a collision-resistant unique registration ID (e.g. SCENE-2026-4821).
 * Verifies against existing registrations to prevent duplicate IDs.
 * @param {Array<Object>} [existingList]
 * @returns {string}
 */
function generateUniqueRegistrationId(existingList) {
  const existing = existingList || getStoredRegistrations();
  const existingIds = new Set(existing.map(r => r.id));

  let candidateId = '';
  let attempts = 0;
  const maxAttempts = 2000;

  do {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    candidateId = `SCENE-2026-${randomNum}`;
    attempts++;
  } while ((existingIds.has(candidateId) || generatedSessionIds.has(candidateId)) && attempts < maxAttempts);

  // Fallback in astronomical case of max attempts
  if (existingIds.has(candidateId) || generatedSessionIds.has(candidateId)) {
    candidateId = `SCENE-2026-${Date.now().toString().slice(-4)}`;
  }

  generatedSessionIds.add(candidateId);
  return candidateId;
}

/**
 * Saves a new registration record into LocalStorage.
 * @param {Object} data - Attendee and event details
 * @returns {Object} The saved registration record with assigned unique ID
 */
function saveRegistration(data) {
  if (!data || !data.eventId || !data.attendeeEmail) {
    throw new Error('[SCENE Storage] Invalid registration payload: eventId and attendeeEmail are required.');
  }

  const registrations = getStoredRegistrations();

  // Guard against duplicate
  if (hasDuplicateRegistration(data.eventId, data.attendeeEmail)) {
    throw new Error('A registration with this email address already exists for this event.');
  }

  const now = new Date();
  const uniqueId = generateUniqueRegistrationId(registrations);

  const newRecord = {
    id: uniqueId,
    eventId: data.eventId,
    eventTitle: data.eventTitle || 'Campus Event',
    category: data.category || 'General',
    eventDate: data.eventDate || '',
    eventVenue: data.eventVenue || '',
    attendeeName: data.attendeeName.trim(),
    attendeeEmail: data.attendeeEmail.trim().toLowerCase(),
    attendeePhone: data.attendeePhone.trim(),
    registeredAt: now.toISOString(),
    formattedRegisteredDate: now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  };

  // Prepend new record so recent passes appear first
  registrations.unshift(newRecord);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  } catch (writeErr) {
    console.error('[SCENE Storage] LocalStorage write error (quota exceeded?):', writeErr);
    throw new Error('Unable to save your registration due to browser storage limitations.');
  }

  return newRecord;
}

/**
 * Deletes a single registration record by its unique ID.
 * @param {string} registrationId
 * @returns {boolean} True if successfully found and deleted
 */
function deleteRegistration(registrationId) {
  if (!registrationId) return false;
  const cleanId = String(registrationId).trim().toUpperCase();

  const registrations = getStoredRegistrations();
  const initialLength = registrations.length;

  const filtered = registrations.filter(reg => String(reg.id).trim().toUpperCase() !== cleanId);

  if (filtered.length !== initialLength) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (writeErr) {
      console.error('[SCENE Storage] Failed to update storage after deletion:', writeErr);
      return false;
    }
  }

  return false;
}

/**
 * Clears all stored registrations. Primarily used for testing/demo resets.
 */
function clearAllRegistrations() {
  localStorage.removeItem(STORAGE_KEY);
}
