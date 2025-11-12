<template>
  <div class="calendar-wrapper" :class="{ 'dark-theme': isDarkTheme }">
    <CalendarHeader
      :current-date="displayMonth"
      :locale="locale"
      :is-dark-theme="isDarkTheme"
      @previous-month="previousMonth"
      @next-month="nextMonth"
      @year-changed="onYearChanged"
      @today="onToday"
    />
    <CalendarGrid
      :month-view="getMonthView()"
      :selected-date="selectedDate"
      :locale="locale"
      @date-selected="selectDate"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, toRef } from 'vue'
import { useCalendar } from '@/composable/use-calendar'
import { SupportedLocale } from '@/composable/locales'
import CalendarHeader from './CalendarHeader.vue'
import CalendarGrid from './CalendarGrid.vue'

interface Props {
  initialDate?: string | Date
  locale?: SupportedLocale
  isDarkTheme?: boolean
}

interface Emits {
  (e: 'date-selected', date: Date): void
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: undefined,
  locale: 'en-US',
  isDarkTheme: false
})

const emit = defineEmits<Emits>()

const onToday = () => {
  goToToday()
  if (selectedDate.value) {
    emit('date-selected', selectedDate.value)
  }
}

const onYearChanged = (year: number) => {
  setYear(year)
}

const localeRef = toRef(props, 'locale')

const {
  selectedDate,
  displayMonth,
  selectDate: calendarSelectDate,
  clearSelectedDate,
  setInitialDate,
  previousMonth,
  nextMonth,
  goToToday,
  setYear,
  getMonthView,
} = useCalendar(props.initialDate, localeRef)

const selectDate = (date: Date) => {
  calendarSelectDate(date)
  emit('date-selected', date)
}

const clearSelection = () => {
  clearSelectedDate()
  emit('date-selected', null as any)
}

// Watch for initialDate changes and update calendar without emitting selection events
watch(() => props.initialDate, (newInitialDate) => {
  if (newInitialDate) {
    const date = typeof newInitialDate === 'string'
      ? new Date(newInitialDate + 'T00:00:00')
      : new Date(newInitialDate)

    setInitialDate(date)
  }
})

defineExpose({
  clearSelection,
  displayMonth
})
</script>

<style scoped lang="scss">
.calendar-wrapper {
  width: 100%;
  border-radius: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: auto;
  transition: all 0.3s ease;

  &.dark-theme {
    background: #1e293b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
}
</style>
