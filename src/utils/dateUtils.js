/**
 * @file Date manipulation utilities
 * @module utils/dateUtils
 */

/**
 * Utility functions for date operations
 * @class DateUtils
 */
export class DateUtils
{
  /**
   * Format date as YYYY-MM-DD
   * @static
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  static formatToIsoString(date)
  {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * Parse date from YYYY-MM-DD string
   * @static
   * @param {string} dateString - Date string to parse
   * @returns {Date} Parsed date object
   * @throws {Error} If date format is invalid
   */
  static parseFromIsoString(dateString)
  {
    if (!dateString) return new Date()

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD')
    }

    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      throw new Error('Invalid date values')
    }

    return date
  }

  /**
   * Get first day of month
   * @static
   * @param {Date} date - Reference date
   * @returns {Date} First day of month
   */
  static getFirstDayOfMonth(date)
  {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  /**
   * Get last day of month
   * @static
   * @param {Date} date - Reference date
   * @returns {Date} Last day of month
   */
  static getLastDayOfMonth(date)
  {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }

  /**
   * Check if two dates are the same day
   * @static
   * @param {Date} firstDate - First date
   * @param {Date} secondDate - Second date
   * @returns {boolean} Whether dates are the same day
   */
  static areDatesEqual(firstDate, secondDate)
  {
    return this.formatToIsoString(firstDate) === this.formatToIsoString(secondDate)
  }

  /**
   * Check if date is today
   * @static
   * @param {Date} date - Date to check
   * @returns {boolean} Whether date is today
   */
  static isCurrentDate(date)
  {
    return this.areDatesEqual(date, new Date())
  }

  /**
   * Get day names for locale
   * @static
   * @param {string} locale - Locale identifier
   * @returns {string[]} Array of day names
   */
  static getWeekdayNames(locale)
  {
    const baseDate = new Date(2025, 10, 3) // November 3, 2025 is Monday
    const weekdays = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate)

      date.setDate(baseDate.getDate() + i)
      weekdays.push(
        date.toLocaleDateString(locale, { weekday: 'short' })
      )
    }

    return weekdays
  }

  /**
   * Format month and year for display
   * @static
   * @param {Date} date - Date to format
   * @param {string} locale - Locale identifier
   * @returns {string} Formatted month and year
   */
  static formatMonthAndYear(date, locale)
  {
    return date.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric'
    })
  }

  /**
   * Generate calendar days array for month
   * @static
   * @param {Date} date - Reference date for month
   * @returns {Object[]} Array of day objects
   */
  static generateMonthCalendarDays(date)
  {
    const month = date.getMonth()

    const firstDayOfMonth = this.getFirstDayOfMonth(date)
    const lastDayOfMonth = this.getLastDayOfMonth(date)

    const calendarStartDate = new Date(firstDayOfMonth)
    const firstWeekdayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Convert to Monday-based week
    calendarStartDate.setDate(firstDayOfMonth.getDate() - firstWeekdayIndex)

    const calendarEndDate = new Date(lastDayOfMonth)
    const lastWeekdayIndex = (lastDayOfMonth.getDay() + 6) % 7
    calendarEndDate.setDate(lastDayOfMonth.getDate() + (6 - lastWeekdayIndex))

    const calendarDays = []
    const currentDate = new Date(calendarStartDate)

    while (currentDate <= calendarEndDate) {
      calendarDays.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return calendarDays
  }
}
