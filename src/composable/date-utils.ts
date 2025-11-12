/**
 * Date utility functions for calendar operations
 * Provides comprehensive date manipulation and formatting utilities
 */

export type WeekdayFormatOption = 'long' | 'short' | 'narrow'

export interface CalendarDate {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
}

/**
 * Get first day of month
 * @static
 * @param {Date} date - Reference date
 * @returns {Date} First day of month
 */
function getFirstDayOfMonth(date: Date): Date
{
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get last day of month
 * @static
 * @param {Date} date - Reference date
 * @returns {Date} Last day of month
 */
function getLastDayOfMonth(date: Date): Date
{
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Generate calendar days for a month with configurable week start day
 * @param {Date} date - Reference date for the month
 * @param {'monday' | 'sunday'} weekStartsOn - First day of the week
 * @returns {CalendarDate[][]} 2D array of calendar days organized by weeks
 */
function generateMonthCalendarDays(date: Date, weekStartsOn: 'monday' | 'sunday'): CalendarDate[][]
{
  const month = date.getMonth()

  const firstDayOfMonth = getFirstDayOfMonth(date)
  const lastDayOfMonth = getLastDayOfMonth(date)

  // Calculate start and end of calendar based on week start day
  const calendarStartDate = new Date(firstDayOfMonth)
  const calendarEndDate = new Date(lastDayOfMonth)

  if (weekStartsOn === 'monday') {
    // Monday-based week logic
    const firstWeekdayIndex = (firstDayOfMonth.getDay() + 6) % 7 // Convert to Monday-based week (0=Monday, 6=Sunday)
    const lastWeekdayIndex = (lastDayOfMonth.getDay() + 6) % 7

    calendarStartDate.setDate(firstDayOfMonth.getDate() - firstWeekdayIndex)
    calendarEndDate.setDate(lastDayOfMonth.getDate() + (6 - lastWeekdayIndex))
  } else {
    // Sunday-based week logic
    const firstWeekdayIndex = firstDayOfMonth.getDay() // 0=Sunday, 6=Saturday
    const lastWeekdayIndex = lastDayOfMonth.getDay()

    calendarStartDate.setDate(firstDayOfMonth.getDate() - firstWeekdayIndex)
    calendarEndDate.setDate(lastDayOfMonth.getDate() + (6 - lastWeekdayIndex))
  }

  const currentDate = new Date(calendarStartDate)
  const weeks: CalendarDate[][] = []

  // Generate weeks until we reach calendarEndDate
  while (currentDate <= calendarEndDate) {
    const week: CalendarDate[] = []

    // Create one week (7 days)
    for (let i = 0; i < 7; i++) {
      week.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: isToday(currentDate)
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    weeks.push(week)
  }

  return weeks
}

/**
 * Get all days in a month as a 2D array (weeks)
 * @param {Date} date - Reference date for the month
 * @param {'monday' | 'sunday'} weekStartsOn - First day of the week (default: 'monday')
 * @returns {CalendarDate[][]} 2D array of calendar days organized by weeks
 */
export function getMonthDays(
  date: Date,
  weekStartsOn: 'monday' | 'sunday' = 'monday'
): CalendarDate[][] {
  return generateMonthCalendarDays(date, weekStartsOn)
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean
{
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string
{
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Parse date from YYYY-MM-DD string
 */
export function parseDate(dateString: string): Date | null
{
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null

  const [, year, month, day] = match

  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

/**
 * Get month name
 */
export function getMonthName(date: Date, locale: string = 'en-US'): string
{
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
}

/**
 * Get day names based on week start day
 */
export function getDayNames(
  locale: string = 'en-US',
  weekday: WeekdayFormatOption,
  weekStartsOn: 'monday' | 'sunday'
): string[] {
  const days: string[] = []
  const baseDate = new Date(2025, 10, 2) // November 2, 2025 is Sunday

  if (weekStartsOn === 'monday') {
    // Start from Monday (November 3, 2025)
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + i + 1) // +1 to start from Monday
      days.push(
        new Intl.DateTimeFormat(locale, { weekday }).format(date)
      )
    }
  } else {
    // Start from Sunday (November 2, 2025)
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + i)
      days.push(
        new Intl.DateTimeFormat(locale, { weekday }).format(date)
      )
    }
  }

  return days
}

/**
 * Get short day names
 */
export function getShortDayNames(
  locale: string = 'en-US',
  weekStartsOn: 'monday' | 'sunday' = 'monday'
): string[] {
  return getDayNames(locale, 'short', weekStartsOn)
}

/**
 * Get full day names
 */
export function getFullDayNames(
  locale: string = 'en-US',
  weekStartsOn: 'monday' | 'sunday' = 'monday'
): string[] {
  return getDayNames(locale, 'long', weekStartsOn)
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date
{
  const newDate = new Date(date)
  newDate.setMonth(newDate.getMonth() + months)

  return newDate
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date
{
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)

  return newDate
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean
{
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

/**
 * Get ISO week number
 */
export function getWeekNumber(date: Date): number
{
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))

  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
