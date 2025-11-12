<template>
  <div class="calendar-grid">
    <div class="day-names">
      <div v-for="day in dayNames" :key="day" class="day-name">
        {{ day }}
      </div>
    </div>

    <div class="weeks">
      <div v-for="(week, weekIndex) in monthView" :key="weekIndex" class="week">
        <CalendarDay
          v-for="(day, dayIndex) in week"
          :key="`${weekIndex}-${dayIndex}`"
          :date="day.date"
          :is-current-month="day.isCurrentMonth"
          :is-today="day.isToday"
          :is-selected="isDateSelected(day.date)"
          :locale="locale"
          @click="emit('date-selected', day.date)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type SupportedLocale, getLocaleConfig } from '@/composable/locales'
import { type CalendarDate, isSameDay, getShortDayNames } from '@/composable/date-utils'
import CalendarDay from './CalendarDay.vue'

interface Props {
  monthView: CalendarDate[][]
  selectedDate: Date | null
  locale: SupportedLocale
}

interface Emits {
  (e: 'date-selected', date: Date): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localeConfig = computed(() => getLocaleConfig(props.locale))
const dayNames = computed(() => getShortDayNames(props.locale, localeConfig.value.weekStartsOn))

const isDateSelected = (date: Date): boolean => {
  return props.selectedDate ? isSameDay(date, props.selectedDate) : false
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as vars;
@use '@/styles/mixins' as mixins;

.calendar-grid {
  display: flex;
  flex-direction: column;
  padding: vars.$spacing-lg;

  .day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: vars.$spacing-sm;
    margin-bottom: vars.$spacing-lg;

    .day-name {
      text-align: center;
      font-size: vars.$font-size-sm;
      font-weight: vars.$font-weight-semibold;
      color: vars.$text-secondary;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .weeks {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-xs;

    .week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: vars.$spacing-sm;
    }
  }
}

.dark-theme .calendar-grid {
  .day-names .day-name {
    color: vars.$dark-text-secondary;
  }
}

@media (prefers-color-scheme: dark) {
  .day-names .day-name {
    color: vars.$color-gray-400;
  }
}
</style>
