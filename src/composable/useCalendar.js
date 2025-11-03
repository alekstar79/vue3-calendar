/**
 * @file Calendar composition API
 * @module composables/useCalendar
 */

import { computed, ref, watch } from 'vue'
import { DateUtils } from '@/utils/dateUtils'

/**
 * Calendar composition function
 * @param {Object} config - Configuration object
 * @param {string} config.initialDate - Initial date in YYYY-MM-DD format
 * @param {string} config.locale - Locale identifier
 * @returns {Object} Calendar reactive state and methods
 */
export function useCalendar(config = {})
{
  const currentDisplayedDate = ref(initializeDisplayedDate(config.initialDate))
  const selectedDate = ref(initializeSelectedDate(config.initialDate))
  const currentLocale = ref(validateBrowserLocale(config.locale))

  const monthCalendarDays = computed(() =>
    DateUtils.generateMonthCalendarDays(currentDisplayedDate.value)
  )

  const formattedCurrentMonth = computed(() =>
    DateUtils.formatMonthAndYear(currentDisplayedDate.value, currentLocale.value)
  )

  const weekdayNames = computed(() =>
    DateUtils.getWeekdayNames(currentLocale.value)
  )

  /**
   * @param {string} initialDateString
   * @returns {Date}
   */
  function initializeDisplayedDate(initialDateString)
  {
    if (initialDateString) {
      try {
        return DateUtils.parseFromIsoString(initialDateString)
      } catch (error) {
        console.warn(`Invalid initial date format: ${initialDateString}`)
      }
    }

    return new Date()
  }

  /**
   * @param {string} initialDateString
   * @returns {Date|null}
   */
  function initializeSelectedDate(initialDateString)
  {
    if (initialDateString) {
      try {
        return DateUtils.parseFromIsoString(initialDateString)
      } catch (error) {
        return null
      }
    }

    return null
  }

  /**
   * @param {string} localeString
   * @returns {string}
   */
  function validateBrowserLocale(localeString)
  {
    const testLocale = localeString || 'ru-RU'

    try {
      new Date().toLocaleDateString(testLocale)
      return testLocale
    } catch (error) {
      console.warn(`Browser does not support locale: ${testLocale}`)
      return 'ru-RU'
    }
  }

  function navigateToPreviousMonth()
  {
    currentDisplayedDate.value = new Date(
      currentDisplayedDate.value.getFullYear(),
      currentDisplayedDate.value.getMonth() - 1,
      1
    )
  }

  function navigateToNextMonth()
  {
    currentDisplayedDate.value = new Date(
      currentDisplayedDate.value.getFullYear(),
      currentDisplayedDate.value.getMonth() + 1,
      1
    )
  }

  /**
   * @param {Date} date - Date to select
   */
  function handleDateSelection(date)
  {
    selectedDate.value = date
  }

  /**
   * @param {string} newLocale - New locale
   */
  function updateCalendarLocale(newLocale)
  {
    currentLocale.value = validateBrowserLocale(newLocale)
  }

  /**
   * Check if date is currently selected
   * @param {Date} date - Date to check
   * @returns {boolean}
   */
  function isDateSelected(date)
  {
    if (selectedDate.value) {
      return DateUtils.areDatesEqual(date, selectedDate.value)
    }

    return false
  }

  /**
   * @param {string} newDate - ISO string date
   * @param {string} oldDate - ISO string date
   */
  function updateDate(newDate, oldDate)
  {
    if (newDate === oldDate) return

    if (newDate) {
      try {
        const currentDate = DateUtils.parseFromIsoString(newDate)
        currentDisplayedDate.value = currentDate
        selectedDate.value = currentDate
      } catch (error) {
        console.warn(`Invalid date format: ${newDate}`)
        currentDisplayedDate.value = new Date()
        selectedDate.value = null
      }
    } else {
      selectedDate.value = null
    }
  }

  /**
   * @param {Date} date - Date to check
   * @returns {boolean}
   */
  function isDateToday(date)
  {
    return DateUtils.isCurrentDate(date)
  }

  watch(() => config.locale, (newLocale, oldLocale) => {
    if (newLocale && newLocale !== oldLocale) {
      currentLocale.value = validateBrowserLocale(newLocale)
    }
  })

  return {
    // Reactive state
    currentDisplayedDate,
    selectedDate,
    currentLocale,
    monthCalendarDays,
    formattedCurrentMonth,
    weekdayNames,

    // Methods
    navigateToPreviousMonth,
    navigateToNextMonth,
    handleDateSelection,
    updateCalendarLocale,
    updateDate,
    isDateSelected,
    isDateToday
  }
}
