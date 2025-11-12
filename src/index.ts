/**
 * Main library entry point
 * Exports all public API
 */

export { default as Calendar } from '@/components/Calendar.vue'
export { default as CalendarDay } from '@/components/CalendarDay.vue'
export { default as CalendarGrid } from '@/components/CalendarGrid.vue'
export { default as CalendarHeader } from '@/components/CalendarHeader.vue'
export { default as YearPicker } from '@/components/YearPicker.vue'

// Composable
export * from '@/composable/date-utils.ts'
export * from '@/composable/use-calendar.ts'
export * from '@/composable/locales.ts'

// Styles
import '@/styles/main.scss'
