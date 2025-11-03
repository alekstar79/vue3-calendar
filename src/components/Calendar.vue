<template>
  <section class="calendar-display-section">
    <div class="calendar-container">
      <div class="calendar">
        <div class="calendar-header">
          <button
            @click="navigateToPreviousMonth"
            class="navigation-button"
            type="button"
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <span class="current-month-display">{{ formattedCurrentMonth }}</span>

          <button
            @click="navigateToNextMonth"
            class="navigation-button"
            type="button"
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="calendar-weekdays">
          <div
            v-for="weekdayName in weekdayNames"
            :key="weekdayName"
            class="weekday-name"
          >
            {{ weekdayName }}
          </div>
        </div>

        <div class="calendar-days-grid">
          <div
            v-for="calendarDay in monthCalendarDays"
            :key="calendarDay.date.toString()"
            :class="[
              'calendar-day',
              {
                'non-current-month': !calendarDay.isCurrentMonth,
                'selected-date': isDateSelected(calendarDay.date),
                'current-date': isDateToday(calendarDay.date)
              }
            ]"
            @click="handleCalendarDayClick(calendarDay.date)"
          >
            <span class="day-number">{{ calendarDay.date.getDate() }}</span>
            <div
              v-if="isDateToday(calendarDay.date) && !isDateSelected(calendarDay.date)"
              class="today-indicator"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * @file Calendar Component
 * @component Calendar2
 * @description A responsive, customizable calendar component
 */

import { useCalendar } from '@/composable/useCalendar'
import { DateUtils } from '@/utils/dateUtils'
import { watch } from 'vue'

const props = defineProps({
  /**
   * Initial date in YYYY-MM-DD format
   * @type {string}
   */
  initialDate: {
    type: String,
    default: null,
    /**
     * @param {string} value
     * @returns {boolean}
     */
    validator: (value) => {
      return value ? /^\d{4}-\d{2}-\d{2}$/.test(value) : true
    }
  },
  /**
   * @type {string}
   */
  locale: {
    type: String,
    default: 'ru-RU'
  }
})

const emit = defineEmits(['date-selected'])

/**
 * Calendar composition function
 */
const {
  // currentDisplayedDate,
  // selectedDate,
  currentLocale,
  monthCalendarDays,
  formattedCurrentMonth,
  weekdayNames,
  navigateToPreviousMonth,
  navigateToNextMonth,
  handleDateSelection,
  isDateSelected,
  isDateToday,
  updateCalendarLocale,
  updateDate
} = useCalendar({
  initialDate: props.initialDate,
  locale: props.locale
})

watch(() => props.initialDate, updateDate)

watch(() => props.locale, (newLocale) => {
  if (newLocale && newLocale !== currentLocale.value) {
    updateCalendarLocale(newLocale)
  }
})

/**
 * @param {Date} clickedDate - The date that was clicked
 */
const handleCalendarDayClick = (clickedDate) => {
  handleDateSelection(clickedDate)
  emit('date-selected', DateUtils.formatToIsoString(clickedDate))
}
</script>

<style scoped>
.calendar-display-section {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0;
}

.calendar-container {
  width: 100%;
  max-width: 420px;
}

.calendar {
  height: 100%;
  border: none;
  border-radius: 20px;
  padding: 30px 25px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, .1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.navigation-button {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  color: #475569;
  transition: all .3s cubic-bezier(0.4, 0, .2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navigation-button:hover {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.current-month-display {
  font-weight: 700;
  font-size: 1.3em;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.weekday-name {
  text-align: center;
  font-weight: 600;
  font-size: 0.85em;
  color: #64748b;
  padding: 12px 0;
  text-transform: uppercase;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 39px;
  gap: 10px;
}

.calendar-day {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  font-weight: 500;
}

.calendar-day:hover {
  background-color: #f1f5f9;
  border-color: #e2e8f0;
}

.non-current-month {
  color: #cbd5e1;
}

.non-current-month:hover {
  background-color: #f8fafc;
  color: #94a3b8;
}

.selected-date {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
  border-color: #6366f1;
}

.current-date {
  border-color: #6366f1;
  font-weight: 600;
}

.current-date:not(.selected-date) {
  background-color: #f8fafc;
  color: #6366f1;
}

.today-indicator {
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #6366f1;
}

.selected-date .today-indicator {
  background: white;
}

.day-number {
  position: relative;
  z-index: 1;
}

@media (max-width: 480px) {
  .calendar {
    padding: 20px 15px;
    border-radius: 16px;
  }
  .calendar-day {
    height: 42px;
    border-radius: 10px;
  }
  .current-month-display {
    font-size: 1.2em;
  }
  .calendar-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }
}
</style>
