// noinspection JSUnusedLocalSymbols

import { computed, ComputedRef, Ref, ref } from 'vue'
import { type CalendarDate, addMonths, getMonthDays, isSameDay, parseDate } from './date-utils.ts'
import { SupportedLocale, getLocaleConfig } from './locales'

/**
 * Composition API hook for calendar logic
 * Handles state management and business logic
 */

export interface CalendarState {
  currentDate: Ref<Date>
  monthView: ComputedRef<CalendarDate[][]>
  selectedDate: Ref<Date | null>
  displayMonth: Ref<Date>
}

export interface CalendarMethods {
  selectDate: (date: Date) => void
  clearSelectedDate: () => void
  setInitialDate: (date: Date) => void
  nextMonth: () => void
  previousMonth: () => void
  goToToday: () => void
  goToDate: (date: Date | string) => void
  setDisplayMonth: (date: Date) => void
  setYear: (year: number) => void
  getMonthView: () => any[][]
  isDateSelected: (date: Date) => boolean
  isDateInCurrentMonth: (date: Date) => boolean
}

export function useCalendar(
  initialDate?: string | Date,
  locale: Ref<SupportedLocale> = ref('en-US')
): CalendarState & CalendarMethods {
  // Parse initial date
  let startDate: Date
  let initialSelectedDate: Date | null = null

  if (initialDate) {
    if (typeof initialDate === 'string') {
      startDate = parseDate(initialDate) || new Date()
      initialSelectedDate = parseDate(initialDate)
    } else {
      startDate = initialDate
      initialSelectedDate = initialDate
    }
  } else {
    startDate = new Date()
  }

  const currentDate = ref<Date>(new Date())
  const displayMonth = ref<Date>(new Date(startDate))

  // Initialize selectedDate with initial date (if provided)
  const selectedDate = ref<Date | null>(initialSelectedDate)

  // Get locale configuration for week start day
  const localeConfig = computed(() => getLocaleConfig(locale.value))

  // Computed properties
  const monthView = computed<CalendarDate[][]>(() => {
    return getMonthDays(displayMonth.value, localeConfig.value.weekStartsOn)
  })

  // Methods
  const selectDate = (date: Date): Date => selectedDate.value = date

  const clearSelectedDate = (): void => selectedDate.value = null

  // Method to set initial date without emitting events
  const setInitialDate = (date: Date): void => {
    displayMonth.value = new Date(date)
    selectedDate.value = new Date(date)
  }

  const nextMonth = (): Date => displayMonth.value = addMonths(displayMonth.value, 1)

  const previousMonth = (): Date => displayMonth.value = addMonths(displayMonth.value, -1)

  const goToToday = (): void => {
    const today = new Date()

    displayMonth.value = today
    selectedDate.value = today
  }

  const goToDate = (date: Date | string): void =>
  {
    const targetDate = typeof date === 'string' ? parseDate(date) : date

    if (targetDate) {
      displayMonth.value = new Date(targetDate)
      selectedDate.value = new Date(targetDate)
    }
  }

  const setDisplayMonth = (date: Date): Date => displayMonth.value = date

  const setYear = (year: number): void => {
    const newDate = new Date(displayMonth.value)
    newDate.setFullYear(year)
    displayMonth.value = newDate
  }

  const getMonthView = () => monthView.value

  const isDateSelected = (date: Date): boolean => {
    return selectedDate.value ? isSameDay(date, selectedDate.value) : false
  }

  const isDateInCurrentMonth = (date: Date): boolean =>
  {
    return (
      date.getMonth() === displayMonth.value.getMonth() &&
      date.getFullYear() === displayMonth.value.getFullYear()
    )
  }

  return {
    currentDate,
    selectedDate,
    displayMonth,
    monthView,
    selectDate,
    clearSelectedDate,
    setInitialDate,
    nextMonth,
    previousMonth,
    goToToday,
    goToDate,
    setDisplayMonth,
    setYear,
    getMonthView,
    isDateSelected,
    isDateInCurrentMonth,
  }
}
