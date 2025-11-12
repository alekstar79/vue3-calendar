/**
 * Unit tests for date utilities
 */

import { describe, it, expect } from 'vitest'
import {
  formatDate,
  parseDate,
  isToday,
  isSameDay,
  addDays,
  addMonths,
  getMonthDays,
  getMonthName,
  getShortDayNames,
  getWeekNumber,
} from '@/composable/date-utils.ts'

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD string', () => {
      const date = new Date(2024, 0, 15) // Jan 15, 2024
      expect(formatDate(date)).toBe('2024-01-15')
    })

    it('should pad single digit months and days', () => {
      const date = new Date(2024, 8, 5) // Sep 5, 2024
      expect(formatDate(date)).toBe('2024-09-05')
    })
  })

  describe('parseDate', () => {
    it('should parse YYYY-MM-DD string to Date', () => {
      const parsed = parseDate('2024-01-15')
      expect(parsed).toEqual(new Date(2024, 0, 15))
    })

    it('should return null for invalid format', () => {
      expect(parseDate('15-01-2024')).toBeNull()
      expect(parseDate('2024/01/15')).toBeNull()
      expect(parseDate('invalid')).toBeNull()
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('should return false for other dates', () => {
      const yesterday = new Date(Date.now() - 86400000)
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2024, 0, 15, 10, 30)
      const date2 = new Date(2024, 0, 15, 20, 45)
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('should return false for different days', () => {
      const date1 = new Date(2024, 0, 15)
      const date2 = new Date(2024, 0, 16)
      expect(isSameDay(date1, date2)).toBe(false)
    })
  })

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date(2024, 0, 15)
      const result = addDays(date, 5)
      expect(result).toEqual(new Date(2024, 0, 20))
    })

    it('should handle month overflow', () => {
      const date = new Date(2024, 0, 28)
      const result = addDays(date, 5)
      expect(result).toEqual(new Date(2024, 1, 2))
    })

    it('should handle negative days', () => {
      const date = new Date(2024, 0, 15)
      const result = addDays(date, -5)
      expect(result).toEqual(new Date(2024, 0, 10))
    })
  })

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date(2024, 0, 15)
      const result = addMonths(date, 3)
      expect(result).toEqual(new Date(2024, 3, 15))
    })

    it('should handle year overflow', () => {
      const date = new Date(2024, 10, 15)
      const result = addMonths(date, 3)
      expect(result).toEqual(new Date(2025, 1, 15))
    })

    it('should handle negative months', () => {
      const date = new Date(2024, 3, 15)
      const result = addMonths(date, -3)
      expect(result).toEqual(new Date(2024, 0, 15))
    })
  })

  describe('getMonthDays', () => {
    it('should return 6 weeks for a month', () => {
      const date = new Date(2024, 0, 1) // January 2024
      const weeks = getMonthDays(date)
      expect(weeks.length).toBeGreaterThanOrEqual(4)
      expect(weeks.length).toBeLessThanOrEqual(6)
    })

    it('should include days from previous month', () => {
      const date = new Date(2024, 0, 1) // January 2024 starts on Monday
      const weeks = getMonthDays(date)
      const firstWeek = weeks[0]
      // First week should have some days from previous month if month doesn't start on Sunday
      expect(firstWeek.length).toBe(7)
    })

    it('each day should have correct properties', () => {
      const date = new Date(2024, 0, 15)
      const weeks = getMonthDays(date)
      const firstDay = weeks[0][0]

      expect(firstDay).toHaveProperty('date')
      expect(firstDay).toHaveProperty('isCurrentMonth')
      expect(firstDay).toHaveProperty('isToday')
    })
  })

  describe('getMonthName', () => {
    it('should return correct month name in English', () => {
      const date = new Date(2024, 0, 1) // January
      expect(getMonthName(date, 'en-US')).toBe('January')
    })

    it('should return correct month names for all months', () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ]
      months.forEach((month, index) => {
        const date = new Date(2024, index, 1)
        expect(getMonthName(date, 'en-US')).toBe(month)
      })
    })
  })

  describe('getShortDayNames', () => {
    it('should return 7 short day names', () => {
      const days = getShortDayNames('en-US')
      expect(days.length).toBe(7)
      expect(days).toContain('Sun')
      expect(days).toContain('Mon')
    })
  })

  describe('getWeekNumber', () => {
    it('should return week number correctly', () => {
      const date = new Date(2024, 0, 1) // January 1, 2024
      const weekNum = getWeekNumber(date)
      expect(typeof weekNum).toBe('number')
      expect(weekNum).toBeGreaterThan(0)
      expect(weekNum).toBeLessThanOrEqual(53)
    })
  })
})
