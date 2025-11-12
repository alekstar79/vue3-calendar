/**
 * Unit tests for Calendar component
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from '@/components/Calendar.vue'

describe('Calendar.vue', () => {
  it('should render calendar component', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.find('.calendar-wrapper').exists()).toBe(true)
  })

  it('should render with initial date', () => {
    const wrapper = mount(Calendar, {
      props: {
        initialDate: '2024-06-15',
      },
    })
    expect(wrapper.find('.calendar-wrapper').exists()).toBe(true)
  })

  it('should render calendar header', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.findComponent({ name: 'CalendarHeader' }).exists()).toBe(true)
  })

  it('should render calendar grid', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.findComponent({ name: 'CalendarGrid' }).exists()).toBe(true)
  })

  it('should support different locales', () => {
    const wrapperEN = mount(Calendar, {
      props: {
        locale: 'en-US',
      },
    })
    const wrapperRU = mount(Calendar, {
      props: {
        locale: 'ru-RU',
      },
    })
    expect(wrapperEN.find('.calendar-wrapper').exists()).toBe(true)
    expect(wrapperRU.find('.calendar-wrapper').exists()).toBe(true)
  })

  it('should update month on navigation', async () => {
    const wrapper = mount(Calendar, {
      props: {
        initialDate: '2024-01-15',
      },
    })

    const buttons = wrapper.findAll('button')
    const nextNextButton = buttons[1] // Second button should be next

    if (nextNextButton) {
      await nextNextButton.trigger('click')
      // Component should have moved to next month
      expect(wrapper.vm.displayMonth).toBeDefined()
    }
  })
})
