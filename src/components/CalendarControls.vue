<template>
  <section class="calendar-controls-section">
    <div class="control-card">
      <h3 class="control-title">Calendar Settings</h3>

      <div class="control-groups">
        <div class="control-group">
          <label for="locale-selector" class="control-label">
            <svg class="control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M7 12H17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Language / Locale
          </label>

          <div class="control-select__wrapper">
            <select
              id="locale-selector"
              v-model="selectedLocale"
              class="control-select"
            >
              <option value="ru-RU">Russian (Русский)</option>
              <option value="en-US">English (US)</option>
              <option value="de-DE">German (Deutsch)</option>
              <option value="fr-FR">French (Français)</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label for="initial-date-picker" class="control-label">
            <svg class="control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <rect x="3" y="4" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Initial Date
          </label>

          <input
            id="initial-date-picker"
            v-model="initialDateValue"
            type="date"
            class="control-input"
          >
        </div>

        <div class="control-group actions-group">
          <button @click="setCurrentDateAsInitial" class="control-button primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            </svg>
            Set to Today
          </button>

          <button @click="clearDateSelection" class="control-button secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * @file Calendar Controls Component
 * @component CalendarControls2
 * @description Control panel for calendar configuration and actions
 */

import { ref, watch } from 'vue'

const props = defineProps({
  initialDate: {
    type: String,
    default: ''
  },
  selectedLocale: {
    type: String,
    default: 'ru-RU'
  }
})

const emit = defineEmits([
  'update:initialDate',
  'update:selectedLocale',
  'set-current-date',
  'clear-selection'
])

const initialDateValue = ref(props.initialDate)
const selectedLocale = ref(props.selectedLocale)

const setCurrentDateAsInitial = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  initialDateValue.value = `${year}-${month}-${day}`
  emit('set-current-date')
}

const clearDateSelection = () => {
  initialDateValue.value = ''
  emit('clear-selection')
}

watch(initialDateValue, (newDate) => {
  emit('update:initialDate', newDate)
})

watch(selectedLocale, (newLocale) => {
  emit('update:selectedLocale', newLocale)
})

watch(() => props.initialDate, (newDate) => {
  initialDateValue.value = newDate
})

watch(() => props.selectedLocale, (newLocale) => {
  selectedLocale.value = newLocale
})
</script>

<style scoped>
.calendar-controls-section {
  height: 100%;
  padding: 0;
}

.control-card {
  height: 100%;
  padding: 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .1);
  border: 1px solid rgba(255, 255, 255, .8);
}

.control-title {
  margin-bottom: 25px;
  color: #1e293b;
  font-size: 1.3em;
  font-weight: 700;
  padding-bottom: 31px;
  border-bottom: 2px solid #f1f5f9;
}

.control-groups {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-label {
  font-weight: 600;
  color: #374151;
  font-size: .95em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-icon {
  color: #6366f1;
}

.control-select,
.control-input {
  padding: 12px 16px;
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1em;
  transition: all 0.3s cubic-bezier(.4, 0, .2, 1);
  background: white;
  font-family: 'Inter', sans-serif;
}

.control-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.control-select:focus,
.control-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, .1);
  transform: translateY(-1px);
}

.control-select__wrapper {
  position: relative;
}

.control-select__wrapper::before {
  content: '\25BC';
  font-size: 14px;
  color: #555;
  position: absolute;
  top: 50%;
  right: 22px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.actions-group {
  flex-direction: row;
  gap: 12px;
  margin-top: 10px;
}

.control-button {
  padding: 12px 20px;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: .95em;
  font-weight: 600;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.control-button.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 4px 12px rgba(99, 102, 241, .3);
}

.control-button.primary:hover {
  background: linear-gradient(135deg, #5b5ee0, #7c4df0);
  box-shadow: 0 8px 20px rgba(99, 102, 241, .4);
  transform: translateY(-2px);
}

.control-button.secondary {
  background: #64748b;
  box-shadow: 0 4px 12px rgba(100, 116, 139, .3);
}

.control-button.secondary:hover {
  background: #475569;
  box-shadow: 0 8px 20px rgba(100, 116, 139, .4);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .control-card {
    padding: 25px;
    border-radius: 16px;
  }
  .actions-group {
    flex-direction: column;
  }
  .control-groups {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .control-card {
    padding: 20px;
  }
}
</style>
