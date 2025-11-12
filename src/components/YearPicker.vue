<template>
  <div class="year-picker" :class="{ 'dark-theme': isDarkTheme }">
    <div class="year-input-wrapper">
      <input
        ref="input"
        v-model="inputValue"
        type="number"
        class="year-input"
        :placeholder="placeholder"
        @focus="() => { toggleDropdown(); showDropdown = true; }"
        @blur="handleBlur"
        @keydown.enter="handleEnter"
        @keydown.escape="showDropdown = false"
      />
      <button
        class="year-dropdown-button"
        :class="{ 'dropdown-open': showDropdown }"
        @click="toggleDropdown"
        @mousedown.prevent
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <div v-if="showDropdown" class="year-dropdown">
      <div
        ref="dropdown"
        class="year-dropdown-list"
        @scroll="handleScroll"
      >
        <div class="year-dropdown-content" :style="contentStyle">
          <div
            v-for="year in visibleYears"
            :key="year"
            class="year-item-wrapper"
            :style="getYearItemStyle(year)"
          >
            <button
              class="year-item"
              :class="{
                'selected': year === selectedYear,
                'current': year === currentYear
              }"
              @click="selectYear(year)"
              @mousedown.prevent
            >
              {{ year }}
              <span v-if="year === currentYear" class="current-indicator">•</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, useTemplateRef, watch } from 'vue'

interface Props {
  modelValue?: number
  isDarkTheme?: boolean
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', year: number): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  isDarkTheme: false,
  placeholder: 'Enter year...'
})

const emit = defineEmits<Emits>()

// Constants
const START_YEAR = 1970
const ITEM_HEIGHT = 40
const VISIBLE_ITEMS = 9
const OVERSCAN = 5

// Refs
const input = useTemplateRef<HTMLInputElement>('input')
const dropdown = useTemplateRef<HTMLDivElement>('dropdown')
const showDropdown = ref(false)
const inputValue = ref('')
const scrollTop = ref(0)
const currentYear = new Date().getFullYear()

// Computed properties
const selectedYear = computed(() => props.modelValue)

const yearsRange = computed(() => {
  const current = currentYear
  // Show from START_YEAR to current + 100 years
  return {
    start: START_YEAR,
    end: current + 100,
    total: (current + 100) - START_YEAR + 1
  }
})

const contentStyle = computed(() => ({
  height: `${yearsRange.value.total * ITEM_HEIGHT}px`
}))

const visibleYears = computed(() => {
  const startIndex = Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN)
  const endIndex = Math.min(
    yearsRange.value.total,
    startIndex + VISIBLE_ITEMS + OVERSCAN * 2
  )

  const years = []
  for (let i = startIndex; i < endIndex; i++) {
    years.push(yearsRange.value.start + i)
  }

  return years
})

// Methods
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value

  if (showDropdown.value) {
    nextTick(() => {
      scrollToSelectedYear()
    })
  }
}

const handleBlur = (event: FocusEvent) => {
  // Use setTimeout to allow click events to process first
  setTimeout(() => {
    const relatedTarget = event.relatedTarget as HTMLElement
    if (!dropdown.value?.contains(relatedTarget) && !input.value?.contains(relatedTarget)) {
      showDropdown.value = false
    }
  }, 150)
}

const handleEnter = () => {
  const year = parseInt(inputValue.value)

  if (!isNaN(year) && year >= START_YEAR) {
    emit('update:modelValue', year)
    showDropdown.value = false
  }
}

const handleScroll = () => {
  if (dropdown.value) {
    scrollTop.value = dropdown.value.scrollTop
  }
}

const selectYear = (year: number) => {
  inputValue.value = year.toString()
  emit('update:modelValue', year)
  showDropdown.value = false
}

const scrollToSelectedYear = () => {
  if (selectedYear.value && dropdown.value) {
    const yearIndex = selectedYear.value - yearsRange.value.start
    const targetScrollTop = yearIndex * ITEM_HEIGHT - (dropdown.value.clientHeight / 2) + (ITEM_HEIGHT / 2)

    dropdown.value.scrollTo?.({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    })
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement

  if (!input.value?.contains(target) && !dropdown.value?.contains(target)) {
    showDropdown.value = false
  }
}

const getYearItemStyle = (year: number) => {
  const top = (year - yearsRange.value.start) * ITEM_HEIGHT

  return {
    top: `${top}px`,
    height: `${ITEM_HEIGHT}px`
  }
}

// Lifecycle
onMounted(() => {
  if (selectedYear.value) {
    inputValue.value = selectedYear.value.toString()
  } else {
    inputValue.value = currentYear.toString()
    emit('update:modelValue', currentYear)
  }

  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Watch for modelValue changes from parent
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    inputValue.value = newValue.toString()
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as vars;
@use '@/styles/mixins' as mixins;

.year-picker {
  position: relative;
  display: inline-block;
  width: 120px;

  .year-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  .year-input {
    width: 100%;
    padding: 8px 32px 8px 12px;
    border: 2px solid vars.$color-gray-300;
    border-radius: vars.$border-radius-md;
    font-size: vars.$font-size-sm;
    font-weight: vars.$font-weight-medium;
    background: vars.$bg-primary;
    color: vars.$text-primary;
    transition: all 0.2s ease;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: none;
      border-color: vars.$color-primary;
      box-shadow: 0 0 0 3px rgba(vars.$color-primary, 0.1);
    }

    &::placeholder {
      color: vars.$color-gray-400;
    }
  }

  .year-dropdown-button {
    @include mixins.button-reset;
    position: absolute;
    right: 8px;
    padding: 4px;
    color: vars.$color-gray-500;
    transition: all 0.2s ease;
    border-radius: 3px;

    &:hover {
      color: vars.$color-primary;
      background: rgba(vars.$color-primary, 0.1);
    }

    &.dropdown-open {
      transform: rotate(180deg);
      color: vars.$color-primary;
    }

    svg {
      display: block;
    }
  }

  .year-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    z-index: vars.$z-dropdown;
    background: vars.$bg-primary;
    border: 2px solid vars.$color-gray-300;
    border-radius: vars.$border-radius-md;
    box-shadow: vars.$shadow-lg;
    overflow: hidden;
  }

  .year-dropdown-list {
    max-height: 340px;
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  .year-dropdown-content {
    position: relative;
  }

  .year-item-wrapper {
    position: absolute;
    left: 0;
    right: 0;
  }

  .year-item {
    @include mixins.button-reset;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: vars.$font-size-sm;
    font-weight: vars.$font-weight-medium;
    color: vars.$text-primary;
    background: vars.$bg-primary;
    transition: all 0.15s ease;
    border-bottom: 1px solid vars.$color-gray-200;

    &:hover {
      background: vars.$color-primary-light;
      color: vars.$color-primary-dark;
    }

    &.selected {
      background: vars.$color-primary;
      color: vars.$text-light;
      font-weight: vars.$font-weight-semibold;
    }

    &.current {
      color: vars.$color-primary;
      font-weight: vars.$font-weight-semibold;

      .current-indicator {
        color: vars.$color-primary;
        font-weight: vars.$font-weight-bold;
      }

      &.selected {
        color: vars.$text-light;

        .current-indicator {
          color: vars.$text-light;
        }
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

/* Dark theme styles */
.year-picker.dark-theme {
  .year-input {
    background: vars.$dark-bg-secondary;
    border-color: vars.$dark-bg-tertiary;
    color: vars.$dark-text-primary;

    &:focus {
      border-color: vars.$color-primary;
      box-shadow: 0 0 0 3px rgba(vars.$color-primary, 0.2);
    }

    &::placeholder {
      color: vars.$dark-text-muted;
    }
  }

  .year-dropdown-button {
    color: vars.$dark-text-muted;

    &:hover {
      color: vars.$color-primary;
      background: rgba(vars.$color-primary, 0.2);
    }

    &.dropdown-open {
      color: vars.$color-primary;
    }
  }

  .year-dropdown {
    background: vars.$dark-bg-secondary;
    border-color: vars.$dark-bg-tertiary;
  }

  .year-item {
    background: vars.$dark-bg-secondary;
    color: vars.$dark-text-primary;
    border-bottom-color: vars.$dark-bg-tertiary;

    &:hover {
      background: rgba(vars.$color-primary, 0.2);
      color: vars.$dark-text-primary;
    }

    &.selected {
      background: vars.$color-primary;
      color: vars.$text-light;
    }

    &.current {
      color: vars.$color-primary;

      .current-indicator {
        color: vars.$color-primary;
      }

      &.selected {
        color: vars.$text-light;

        .current-indicator {
          color: vars.$text-light;
        }
      }
    }
  }
}

/* Custom scrollbar for dropdown */
.year-dropdown-list::-webkit-scrollbar {
  width: 6px;
}

.year-dropdown-list::-webkit-scrollbar-track {
  background: vars.$color-gray-100;
  border-radius: 3px;
}

.year-dropdown-list::-webkit-scrollbar-thumb {
  background: vars.$color-gray-400;
  border-radius: 3px;
}

.year-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: vars.$color-gray-500;
}

.dark-theme .year-dropdown-list::-webkit-scrollbar-track {
  background: vars.$dark-bg-tertiary;
}

.dark-theme .year-dropdown-list::-webkit-scrollbar-thumb {
  background: vars.$dark-text-muted;
}

.dark-theme .year-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: vars.$dark-text-secondary;
}
</style>
