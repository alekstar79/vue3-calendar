<template>
  <div class="calendar-header">
    <div class="header-top">
      <button
        class="nav-button"
        :aria-label="localeConfig.prevMonth"
        @click="$emit('previous-month')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path data-v-cbad8447="" d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>

      <div class="month-year">
        <span class="month-name">{{ currentMonthName }}</span>
        <div class="year-section">
          <YearPicker
            v-model="selectedYear"
            :is-dark-theme="isDarkTheme"
            placeholder="Select year..."
            @update:modelValue="$emit('year-changed', $event)"
          />
        </div>
      </div>

      <button
        class="nav-button"
        :aria-label="localeConfig.nextMonth"
        @click="$emit('next-month')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path data-v-cbad8447="" d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </button>
    </div>

    <div class="header-buttons">
      <button class="btn-today" @click="$emit('today')">{{ localeConfig.today }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { getLocaleConfig } from '@/composable/locales'
import { getMonthName } from '@/composable/date-utils'
import { SupportedLocale } from '@/composable/locales'
import YearPicker from './YearPicker.vue'

interface Props {
  currentDate: Date
  locale: SupportedLocale
  isDarkTheme?: boolean
}

interface Emits {
  (e: 'previous-month'): void
  (e: 'next-month'): void
  (e: 'today'): void
  (e: 'year-changed', year: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localeConfig = computed(() => getLocaleConfig(props.locale))
const currentMonthName = computed(() => getMonthName(props.currentDate, props.locale))
const selectedYear = ref(props.currentDate.getFullYear())

// Watch for currentDate changes from parent
watch(() => props.currentDate, (newDate) => {
  selectedYear.value = newDate.getFullYear()
})

// Emit year changes
watch(selectedYear, (newYear) => {
  if (newYear !== props.currentDate.getFullYear()) {
    emit('year-changed', newYear)
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as vars;
@use '@/styles/mixins' as mixins;

.calendar-header {
  display: flex;
  flex-direction: column;
  padding: vars.$spacing-lg;
  background: linear-gradient(135deg, vars.$color-primary 0%, vars.$color-primary-dark 100%);
  color: vars.$text-light;
  gap: vars.$spacing-md;

  .header-top {
    @include mixins.flex-between;
    width: 100%;

    .nav-button {
      @include mixins.button-reset;
      @include mixins.focus-ring;
      display: grid;
      place-content: center;
      padding: vars.$spacing-sm vars.$spacing-md;
      border-radius: vars.$border-radius-md;
      background-color: rgba(vars.$color-white, 0.2);
      color: inherit;
      font-size: vars.$font-size-lg;
      font-weight: vars.$font-weight-bold;
      @include mixins.transition;

      &:hover {
        background-color: rgba(vars.$color-white, 0.3);
        transform: scale(1.1);
      }

      &:active {
        background-color: rgba(vars.$color-white, 0.15);
        transform: scale(0.95);
      }
    }

    .month-year {
      @include mixins.flex-column;
      @include mixins.flex-center;
      text-align: center;
      flex: 1;
      gap: vars.$spacing-xs;

      .month-name {
        font-size: vars.$font-size-xl;
        font-weight: vars.$font-weight-bold;
        letter-spacing: 0.5px;
      }

      .year-section {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .header-buttons {
    display: flex;
    gap: vars.$spacing-sm;
    justify-content: center;

    .btn-today {
      @include mixins.button-reset;
      @include mixins.focus-ring;
      padding: vars.$spacing-sm vars.$spacing-lg;
      border-radius: vars.$border-radius-md;
      background-color: rgba(vars.$color-white, 0.2);
      color: inherit;
      font-size: vars.$font-size-sm;
      font-weight: vars.$font-weight-semibold;
      @include mixins.transition;

      &:hover {
        background-color: rgba(vars.$color-white, 0.3);
      }

      &:active {
        background-color: rgba(vars.$color-white, 0.15);
      }
    }
  }
}
</style>
