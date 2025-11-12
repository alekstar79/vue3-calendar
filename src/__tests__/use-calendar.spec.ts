/**
 * Unit tests for Calendar composable
 */

import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { useCalendar } from '@/composable/use-calendar'

describe('useCalendar', () => {
  describe('initialization', () => {
    it('should initialize with default date if not provided', () => {
      const calendar = useCalendar()
      expect(calendar.displayMonth.value).toBeDefined()
      expect(calendar.currentDate.value).toBeDefined()
    })

    it('should initialize with provided date string', () => {
      const calendar = useCalendar('2024-06-15')
      expect(calendar.displayMonth.value.getMonth()).toBe(5) // June is 5
      expect(calendar.displayMonth.value.getFullYear()).toBe(2024)
    })

    it('should initialize with provided Date object', () => {
      const testDate = new Date(2024, 5, 15) // June 15, 2024
      const calendar = useCalendar(testDate)
      expect(calendar.displayMonth.value.getMonth()).toBe(5)
      expect(calendar.displayMonth.value.getFullYear()).toBe(2024)
    })
  })

  describe('date selection', () => {
    it('should select a date', () => {
      const calendar = useCalendar()
      const testDate = new Date(2024, 0, 15)
      calendar.selectDate(testDate)
      expect(calendar.selectedDate.value).toEqual(testDate)
    })

    it('should check if date is selected', () => {
      const calendar = useCalendar()
      const testDate = new Date(2024, 0, 15)
      calendar.selectDate(testDate)
      expect(calendar.isDateSelected(testDate)).toBe(true)
    })

    it('should identify unselected dates', () => {
      const calendar = useCalendar()
      const selectedDate = new Date(2024, 0, 15)
      const unselectedDate = new Date(2024, 0, 16)
      calendar.selectDate(selectedDate)
      expect(calendar.isDateSelected(unselectedDate)).toBe(false)
    })
  })

  describe('month navigation', () => {
    it('should move to next month', () => {
      const calendar = useCalendar('2024-01-15')
      const initialMonth = calendar.displayMonth.value.getMonth()
      calendar.nextMonth()
      expect(calendar.displayMonth.value.getMonth()).toBe((initialMonth + 1) % 12)
    })

    it('should move to previous month', () => {
      const calendar = useCalendar('2024-01-15')
      const initialMonth = calendar.displayMonth.value.getMonth()
      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1
      calendar.previousMonth()
      expect(calendar.displayMonth.value.getMonth()).toBe(expectedMonth)
    })

    it('should handle year boundary for next month', () => {
      const calendar = useCalendar('2024-12-15')
      calendar.nextMonth()
      expect(calendar.displayMonth.value.getMonth()).toBe(0) // January
      expect(calendar.displayMonth.value.getFullYear()).toBe(2025)
    })

    it('should handle year boundary for previous month', () => {
      const calendar = useCalendar('2024-01-15')
      calendar.previousMonth()
      expect(calendar.displayMonth.value.getMonth()).toBe(11) // December
      expect(calendar.displayMonth.value.getFullYear()).toBe(2023)
    })
  })

  describe('date navigation', () => {
    it('should go to today', () => {
      const calendar = useCalendar('2024-01-15')
      calendar.goToToday()
      const today = new Date()
      expect(calendar.displayMonth.value.getMonth()).toBe(today.getMonth())
      expect(calendar.displayMonth.value.getFullYear()).toBe(today.getFullYear())
    })

    it('should navigate to specific date by Date object', () => {
      const calendar = useCalendar()
      const targetDate = new Date(2024, 5, 15)
      calendar.goToDate(targetDate)
      expect(calendar.displayMonth.value.getMonth()).toBe(5)
      expect(calendar.selectedDate.value).toEqual(targetDate)
    })

    it('should navigate to specific date by string', () => {
      const calendar = useCalendar()
      calendar.goToDate('2024-06-15')
      expect(calendar.displayMonth.value.getMonth()).toBe(5)
    })
  })

  describe('month view', () => {
    it('should get month view as 2D array', () => {
      const calendar = useCalendar('2024-01-15')
      const monthView = calendar.getMonthView()
      expect(Array.isArray(monthView)).toBe(true)
      expect(monthView.length).toBeGreaterThanOrEqual(4)
      expect(monthView.every((week) => Array.isArray(week) && week.length === 7)).toBe(true)
    })

    it('should check if date is in current month', () => {
      const calendar = useCalendar('2024-01-15')
      const dateInMonth = new Date(2024, 0, 20)
      const dateOutOfMonth = new Date(2024, 1, 15)
      expect(calendar.isDateInCurrentMonth(dateInMonth)).toBe(true)
      expect(calendar.isDateInCurrentMonth(dateOutOfMonth)).toBe(false)
    })
  })

  describe('localization', () => {
    it('should accept different locales', () => {
      const calendarEN = useCalendar('2024-01-15', ref('en-US'))
      const calendarRU = useCalendar('2024-01-15', ref('ru-RU'))
      // Both should initialize successfully
      expect(calendarEN.displayMonth.value).toBeDefined()
      expect(calendarRU.displayMonth.value).toBeDefined()
    })
  })
})
