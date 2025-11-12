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
          <button @click="clearDateSelection" class="control-button secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Clear Selection
          </button>

          <!-- Кнопка переключения темы -->
          <button @click="toggleTheme" class="control-button theme-toggle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 20V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M2 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M20 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ isDarkTheme ? 'Light Mode' : 'Dark Mode' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { SupportedLocale } from '../../src/composable/locales'

interface Props {
  initialDate: string
  selectedLocale: SupportedLocale
  isDarkTheme: boolean
}

interface Emits {
  (e: 'update:initialDate', data: string): void
  (e: 'update:selectedLocale', data: string): void
  (e: 'clear-selection'): void
  (e: 'toggle-theme'): void
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: '',
  selectedLocale: 'ru-RU',
  isDarkTheme: false
})

const emit = defineEmits<Emits>()

const initialDateValue = ref(props.initialDate)
const selectedLocale = ref(props.selectedLocale)

const clearDateSelection = () => {
  emit('clear-selection')
}

const toggleTheme = () => {
  emit('toggle-theme')
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

<style lang="scss" scoped>
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
  transition: all 0.3s ease;
}

:deep(.dark-theme) .control-card {
  background: #1e293b;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .3);
  border: 1px solid rgba(55, 65, 81, 0.5);
  color: #f1f5f9;
}

.control-title {
  margin-bottom: 25px;
  color: #1e293b;
  font-size: 1.3em;
  font-weight: 700;
  padding-bottom: 31px;
  border-bottom: 2px solid #f1f5f9;
  transition: all 0.3s ease;
}

:deep(.dark-theme) .control-title {
  color: #f1f5f9;
  border-bottom-color: #374151;
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
  transition: all 0.3s ease;
}

:deep(.dark-theme) .control-label {
  color: #e2e8f0;
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
  color: #1e293b;
}

:deep(.dark-theme) .control-select,
:deep(.dark-theme) .control-input {
  background: #374151;
  border-color: #4b5563;
  color: #f1f5f9;
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

:deep(.dark-theme) .control-select__wrapper::before {
  color: #9ca3af;
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

.control-button.secondary {
  background: #64748b;
  box-shadow: 0 4px 12px rgba(100, 116, 139, .3);
}

.control-button.secondary:hover {
  background: #475569;
  box-shadow: 0 8px 20px rgba(100, 116, 139, .4);
  transform: translateY(-2px);
}

.control-button.theme-toggle {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 4px 12px rgba(245, 158, 11, .3);
}

.control-button.theme-toggle:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  box-shadow: 0 8px 20px rgba(245, 158, 11, .4);
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
