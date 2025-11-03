<template>
  <section class="calendar-results-section">
    <div class="results-container">
      <div class="result-card">
        <div class="card-header">
          <h3 class="result-title">Selected Date Information</h3>
          <div class="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <div v-if="lastSelectedDate" class="result-content">
          <div class="info-item">
            <span class="info-label">Formatted:</span>
            <span class="info-value">{{ lastSelectedDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Locale format:</span>
            <span class="info-value">{{ formatDateForLocale(lastSelectedDate) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Timestamp:</span>
            <span class="info-value timestamp">{{ getDateTimestamp(lastSelectedDate) }}</span>
          </div>
        </div>
        <div v-else class="result-content">
          <div class="no-selection-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="no-data-icon">
              <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <rect x="3" y="4" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M8 14H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p class="no-selection-message">
              No date selected yet
            </p>
            <p class="no-selection-hint">
              Click on a date in the calendar
            </p>
          </div>
        </div>
      </div>

      <div class="event-log-card">
        <div class="card-header">
          <h3 class="event-log-title">Event Log</h3>
          <div class="card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <div class="event-log-container">
          <div
            v-for="logEntry in eventLogEntries"
            :key="logEntry.id"
            class="event-log-entry"
          >
            <div class="event-content">
              <span class="event-timestamp">{{ logEntry.timestamp }}</span>
              <span class="event-description">{{ logEntry.message }}</span>
            </div>
            <div class="event-indicator"></div>
          </div>

          <div v-if="eventLogEntries.length === 0" class="empty-log-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="no-data-icon">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>

            <p class="empty-log-message">
              No events yet
            </p>

            <p class="empty-log-hint">
              Selection events will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * @file Calendar Results Component
 * @component CalendarResults2
 * @description Display panel for selected date information and event logging
 */

import { ref, watch } from 'vue'

/**
 * Component props definition
 */
const props = defineProps({
  selectedDate: {
    type: String,
    default: null
  },
  eventLog: {
    type: Array,
    default: () => []
  },
  currentLocale: {
    type: String,
    default: 'ru-RU'
  }
})

/**
 * Local reactive state
 */
const lastSelectedDate = ref(props.selectedDate)
const eventLogEntries = ref([...props.eventLog])

/**
 * Format date according to current locale
 * @param {string} dateString - Date string to format
 * @returns {string}
 */
const formatDateForLocale = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString + 'T00:00:00')

  return date.toLocaleDateString(props.currentLocale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get timestamp from date string
 * @param {string} dateString - Date string
 * @returns {string}
 */
const getDateTimestamp = (dateString) => {
  if (!dateString) return ''

  return new Date(dateString + 'T00:00:00')
      .getTime().toString()
}

watch(() => props.selectedDate, (newDate) => {
  lastSelectedDate.value = newDate
})

watch(() => props.eventLog, (newLog) => {
  eventLogEntries.value = [...newLog]
}, { deep: true })
</script>

<style scoped>
.calendar-results-section {
  height: 100%;
  padding: 0;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
}

.result-card,
.event-log-card {
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .1);
  border: 1px solid rgba(255, 255, 255, .8);
}

.result-card {
  flex: .82;
}
.event-log-card {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f5f9;
}

.result-title,
.event-log-title {
  color: #1e293b;
  font-size: 1.3em;
  font-weight: 700;
  margin: 0;
}

.card-icon {
  color: #6366f1;
  background: #f1f5f9;
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  line-height: 1.6;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #64748b;
  font-size: .9em;
}

.info-value {
  color: #1e293b;
  font-weight: 500;
  text-align: right;
}

.timestamp {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.85em;
  background: #f8fafc;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.no-selection-state,
.empty-log-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.no-data-icon {
  color: #cbd5e1;
  margin-bottom: 16px;
}

.no-selection-message,
.empty-log-message {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 8px;
  color: #64748b;
}

.no-selection-hint,
.empty-log-hint {
  font-size: 0.9em;
  color: #94a3b8;
}

.event-log-container {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.event-log-entry {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.event-log-entry:hover {
  background: #f8fafc;
  margin: 0 -16px;
  padding: 16px;
  border-radius: 12px;
}

.event-log-entry:last-child {
  border-bottom: none;
}

.event-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 16px;
}

.event-timestamp {
  color: #6366f1;
  font-weight: 600;
  font-size: 0.85em;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  min-width: 70px;
  text-align: center;
}

.event-description {
  color: #475569;
  flex: 1;
  text-align: left;
}

.event-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  margin-left: 12px;
}

/* Custom scrollbar */
.event-log-container::-webkit-scrollbar {
  width: 6px;
}
.event-log-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.event-log-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.event-log-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 1024px) {
  .result-card,
  .event-log-card {
    padding: 25px;
  }
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .info-value {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .result-card,
  .event-log-card {
    padding: 20px;
    border-radius: 16px;
  }
  .card-header {
    margin-bottom: 15px;
  }
  .result-title,
  .event-log-title {
    font-size: 1.2em;
  }
}
</style>
