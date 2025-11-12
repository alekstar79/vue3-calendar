<template>
  <div id="application-root" :class="{ 'dark-theme': isDarkTheme }">
    <div class="application-container">
      <header class="application-header">
        <div class="header-content">
          <h1 class="application-title">Vue 3 Calendar</h1>

          <p class="application-description">
            A responsive, customizable calendar component built with Vue 3 Composition API
          </p>
        </div>
        <div class="header-background">
          <div class="floating-element"></div>
          <div class="floating-element"></div>
        </div>
      </header>

      <main class="application-content">
        <div class="content-grid">
          <div class="controls-section">
            <CalendarControls
              v-model:initial-date="initialDate"
              v-model:selected-locale="locale"
              :is-dark-theme="isDarkTheme"
              @clear-selection="handleClearSelection"
              @toggle-theme="toggleTheme"
            />
          </div>

          <div class="calendar-section">
            <Calendar
              ref="calendar"
              :initial-date="initialDate"
              :locale="locale"
              :is-dark-theme="isDarkTheme"
              @date-selected="onDateSelected"
            />
          </div>

          <div class="results-section">
            <CalendarResults
              :selected-date="selectedDate"
              :event-log="applicationEventLog"
              :current-locale="locale"
              :is-dark-theme="isDarkTheme"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, useTemplateRef } from 'vue'
import { formatDate } from '../src/composable/date-utils'
import { SupportedLocale } from '../dist-lib/composable/locales'
import CalendarControls from './components/CalendarControls.vue'
import CalendarResults from './components/CalendarResults.vue'
import Calendar from '../src/components/Calendar.vue'

const initialDate = ref('2025-01-01')
const locale = ref<SupportedLocale>('ru-RU')
const selectedDate = ref(null)
const applicationEventLog = ref([])
const calendar = useTemplateRef<typeof Calendar>('calendar')
const isDarkTheme = ref(false)

const addEventToLog = (message: string) => {
  const currentTime = new Date()
  const formattedTime = currentTime.toLocaleTimeString()

  applicationEventLog.value.unshift({
    id: Date.now() + Math.random(),
    timestamp: formattedTime,
    message: message
  })

  // Keep only last 10 log entries
  if (applicationEventLog.value.length > 10) {
    applicationEventLog.value = applicationEventLog.value.slice(0, 10)
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  addEventToLog(`Theme changed to ${isDarkTheme.value ? 'dark' : 'light'}`)
}

const onDateSelected = (date: Date | null) => {
  if (date) {
    selectedDate.value = formatDate(date)
    addEventToLog(`Date selected: ${selectedDate.value}`)
  } else {
    selectedDate.value = null
  }
}

const handleClearSelection = () => {
  calendar.value?.clearSelection()
  addEventToLog('Date selection cleared')
}

watch(initialDate, (newDate) => {
  if (newDate) {
    addEventToLog(`Initial date changed to: ${newDate}`)
    selectedDate.value = null
  }
})

watch(locale, (newLocale) => {
  addEventToLog(`Application locale changed to: ${newLocale}`)
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --danger-hover: #dc2626;

  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  --border-radius: 8px;
  --border-radius-lg: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  min-height: 100vh;
  color: var(--gray-800);
  line-height: 1.6;
  overflow-x: hidden;
  transition: var(--transition);
}

body.dark-theme {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  color: var(--gray-200);
}

#application-root {
  min-height: 100vh;
  padding: 20px;
  transition: var(--transition);
}

.application-container {
  max-width: 990px;
  margin: 0 auto;
  background: rgba(255, 255, 255, .95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, .2);
  overflow: hidden;
  position: relative;
  transition: var(--transition);
}

.dark-theme .application-container {
  background: rgba(30, 41, 59, 0.95);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(55, 65, 81, 0.5);
  color: var(--gray-200);
}

.application-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 25px 40px;
  position: relative;
  overflow: hidden;
}

.dark-theme .application-header {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.header-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}
.floating-element:nth-child(1) {
  width: 120px;
  height: 120px;
  top: -30px;
  right: -30px;
}
.floating-element:nth-child(2) {
  width: 80px;
  height: 80px;
  bottom: -20px;
  left: 10%;
}

.application-title {
  font-size: 3em;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.application-description {
  font-size: 1.2em;
  opacity: .9;
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto;
}
.application-content {
  padding: 40px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-template-rows: auto 1fr;
  gap: 30px;
  grid-template-areas:
    "controls calendar"
    "results results";
}

.controls-section {
  grid-area: controls;
}

.calendar-section {
  grid-area: calendar;
  display: flex;
  justify-content: center;
  width: 100%;
}

.results-section {
  grid-area: results;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "calendar"
      "controls"
      "results";
  }

  .application-header {
    padding: 30px;
  }
  .application-title {
    font-size: 2.5em;
  }
}

@media (max-width: 768px) {
  .application-title {
    font-size: 2em;
  }
  .application-content {
    padding: 25px;
  }

  #application-root {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .application-container {
    border-radius: 0;
  }
  .application-header {
    padding: 30px 20px;
  }
  .application-title {
    font-size: 1.8em;
  }
  .application-content {
    padding: 20px;
  }

  #application-root {
    padding: 0;
  }
}
</style>
