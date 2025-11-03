<template>
  <div id="application-root">
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
              @set-current-date="handleSetCurrentDate"
              @clear-selection="handleClearSelection"
            />
          </div>

          <div class="calendar-section">
            <Calendar
              :initial-date="initialDate"
              :locale="locale"
              @date-selected="handleDateSelection"
            />
          </div>

          <div class="results-section">
            <CalendarResults
              :selected-date="lastSelectedDate"
              :event-log="applicationEventLog"
              :current-locale="locale"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
/**
 * @file Demo Application Main Component
 * @component App
 * @description Main demo application showcasing the calendar component
 */

import { ref, watch } from 'vue'
import CalendarControls from '@/components/CalendarControls'
import CalendarResults from '@/components/CalendarResults'
import Calendar from '@/components/Calendar'

const initialDate = ref('2025-01-01')
const locale = ref('ru-RU')
const lastSelectedDate = ref(null)
const applicationEventLog = ref([])

/**
 * @param {string} selectedDate - Selected date in YYYY-MM-DD format
 */
const handleDateSelection = (selectedDate) => {
  lastSelectedDate.value = selectedDate
  addEventToLog(`Date selected: ${selectedDate}`)
}

const handleSetCurrentDate = () => {
  addEventToLog('Initial date set to current date')
}

const handleClearSelection = () => {
  lastSelectedDate.value = null
  addEventToLog('Date selection cleared')
}

/**
 * @param {string} message - Event message to log
 */
const addEventToLog = (message) => {
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

watch(initialDate, (newDate) => {
  if (newDate) {
    addEventToLog(`Initial date changed to: ${newDate}`)
  }
})

watch(locale, (newLocale) => {
  addEventToLog(`Application locale changed to: ${newLocale}`)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #1a1a1a;
}

#application-root {
  min-height: 100vh;
  padding: 20px;
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
}

.application-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 25px 40px;
  position: relative;
  overflow: hidden;
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
