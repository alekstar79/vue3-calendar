<template>
  <button
    class="calendar-day"
    :class="{
      'today': isToday,
      'selected': isSelected,
      'other-month': !isCurrentMonth,
    }"
    :disabled="!isCurrentMonth"
    :aria-label="`${date.getDate()} ${getMonthName(date, locale)}`"
    @click="$emit('click', date)"
  >
    {{ date.getDate() }}
  </button>
</template>

<script setup lang="ts">
import { SupportedLocale } from '@/composable/locales'
import { getMonthName } from '@/composable/date-utils'

interface Props {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  locale: SupportedLocale
}

interface Emits {
  (e: 'click', date: Date): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped lang="scss">
@use '@/styles/variables' as vars;
@use '@/styles/mixins' as mixins;

.calendar-day {
  @include mixins.button-reset;
  @include mixins.focus-ring;
  position: relative;
  padding: vars.$spacing-sm;
  text-align: center;
  border: vars.$border-width solid transparent;
  border-radius: vars.$border-radius-md;
  background-color: transparent;
  cursor: pointer;
  font-size: vars.$font-size-md;
  font-weight: vars.$font-weight-medium;
  color: vars.$text-primary;
  @include mixins.transition('background-color, border-color, color, transform');
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Today style - always has border */
  &.today {
    border-color: vars.$color-primary;
    background-color: vars.$color-primary-light;
    color: vars.$color-primary-dark;
    font-weight: vars.$font-weight-bold;
    box-shadow: inset 0 0 0 2px vars.$color-primary;
  }

  &:hover:not(:disabled) {
    background-color: vars.$bg-secondary;
    border-color: vars.$color-primary;
    transform: translateY(-2px);

    /* Ensure text remains visible on hover for selected dates */
    &.selected {
      color: vars.$text-light;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &.selected {
    background-color: vars.$color-primary;
    color: vars.$text-light;
    border-color: vars.$color-primary-dark;
    font-weight: vars.$font-weight-bold;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      border: 2px solid rgba(vars.$color-white, 0.3);
      pointer-events: none;
    }
  }

  &.other-month {
    color: vars.$text-muted;
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
      border-color: transparent;
      transform: none;
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.dark-theme .calendar-day {
  color: vars.$dark-text-primary;
  background-color: transparent;

  &:hover:not(:disabled) {
    background-color: vars.$dark-bg-tertiary;
    border-color: vars.$color-primary;
    color: vars.$dark-text-primary;

    &.selected {
      background-color: vars.$color-primary;
      color: vars.$text-light;
    }
  }

  &.today {
    border-color: vars.$color-primary;
    background-color: rgba(vars.$color-primary, 0.2);
    color: vars.$dark-text-primary;
    box-shadow: inset 0 0 0 2px vars.$color-primary;
  }

  &.selected {
    background-color: vars.$color-primary;
    color: vars.$text-light;
    border-color: vars.$color-primary-light;
  }

  &.other-month {
    color: vars.$dark-text-muted;
    opacity: 0.6;

    &:hover {
      background-color: transparent;
      border-color: transparent;
    }
  }
}

@media (max-width: vars.$breakpoint-sm) {
  .calendar-day {
    padding: vars.$spacing-sm;
    font-size: vars.$font-size-sm;
    min-height: 32px;
  }
}
</style>
