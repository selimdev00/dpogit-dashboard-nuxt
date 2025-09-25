<template>
  <div class="datepicker" ref="datepickerRef">
    <button
      @click="toggleDropdown"
      class="datepicker-trigger"
    >
      <CalendarIcon class="datepicker-icon" />
      {{ formatSelectedDate }}
    </button>

    <div
      v-if="isOpen"
      class="datepicker-dropdown"
    >
      <div class="datepicker-content">
        <!-- Period Selector -->
        <div class="period-selector">
          <button
            v-for="period in periods"
            :key="period.value"
            @click="selectPeriod(period.value)"
            :class="['period-button', { active: selectedPeriod === period.value }]"
          >
            {{ period.label }}
          </button>
        </div>

        <!-- Date Grid -->
        <div class="date-grid">
          <!-- Years Column -->
          <div class="date-column">
            <button
              v-for="year in years"
              :key="year"
              @click="selectYear(year)"
              :class="['date-button', { active: selectedYear === year }]"
            >
              {{ year }}
            </button>
          </div>

          <!-- Months Column -->
          <div class="date-column" v-if="selectedPeriod === 'month' || selectedPeriod === 'quarter'">
            <button
              v-for="month in months"
              :key="month.value"
              @click="selectMonth(month.value)"
              :class="['date-button', { active: selectedMonth === month.value }]"
            >
              {{ month.label }}
            </button>
          </div>

          <!-- Quarters Column -->
          <div class="date-column" v-if="selectedPeriod === 'quarter'">
            <button
              v-for="quarter in quarters"
              :key="quarter.value"
              @click="selectQuarter(quarter.value)"
              :class="['date-button', { active: selectedQuarter === quarter.value }]"
            >
              {{ quarter.label }}
            </button>
          </div>
        </div>

        <!-- Confirm Button -->
        <div class="datepicker-footer">
          <button @click="confirmSelection" class="confirm-button">
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DatePickerEmits {
  (e: 'update:modelValue', value: { period: string; year: number; month?: number; quarter?: number }): void
}

interface DatePickerProps {
  modelValue?: {
    period: string
    year: number
    month?: number
    quarter?: number
  }
}

const props = defineProps<DatePickerProps>()
const emit = defineEmits<DatePickerEmits>()

const datepickerRef = ref<HTMLElement>()
const isOpen = ref(false)

// State
const selectedPeriod = ref('month')
const selectedYear = ref(2025)
const selectedMonth = ref(9) // September
const selectedQuarter = ref(1)

// Data
const periods = [
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
  { value: 'period', label: 'Период' }
]

const years = Array.from({ length: 8 }, (_, i) => 2025 + i)

const months = [
  { value: 9, label: 'сентябрь' },
  { value: 10, label: 'октябрь' },
  { value: 11, label: 'ноябрь' },
  { value: 12, label: 'декабрь' }
]

const quarters = [
  { value: 1, label: 'Q1' },
  { value: 2, label: 'Q2' },
  { value: 3, label: 'Q3' },
  { value: 4, label: 'Q4' }
]

// Computed
const formatSelectedDate = computed(() => {
  if (selectedPeriod.value === 'month') {
    const monthName = months.find(m => m.value === selectedMonth.value)?.label || 'сентябрь'
    return `${monthName} ${selectedYear.value}`
  } else if (selectedPeriod.value === 'quarter') {
    return `Q${selectedQuarter.value} ${selectedYear.value}`
  } else if (selectedPeriod.value === 'year') {
    return `${selectedYear.value}`
  }
  return 'Период'
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectPeriod = (period: string) => {
  selectedPeriod.value = period
}

const selectYear = (year: number) => {
  selectedYear.value = year
}

const selectMonth = (month: number) => {
  selectedMonth.value = month
}

const selectQuarter = (quarter: number) => {
  selectedQuarter.value = quarter
}

const confirmSelection = () => {
  const value = {
    period: selectedPeriod.value,
    year: selectedYear.value,
    ...(selectedPeriod.value === 'month' && { month: selectedMonth.value }),
    ...(selectedPeriod.value === 'quarter' && { quarter: selectedQuarter.value })
  }

  emit('update:modelValue', value)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (datepickerRef.value && !datepickerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // Initialize from props
  if (props.modelValue) {
    selectedPeriod.value = props.modelValue.period
    selectedYear.value = props.modelValue.year
    if (props.modelValue.month) selectedMonth.value = props.modelValue.month
    if (props.modelValue.quarter) selectedQuarter.value = props.modelValue.quarter
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.datepicker {
  position: relative;
}

.datepicker-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.datepicker-trigger:hover {
  border-color: #555;
  background: #1a1a1a;
}

.datepicker-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.datepicker-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 50;
  min-width: 400px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.datepicker-content {
  padding: 16px;
}

.period-selector {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  background: #1a1a1a;
  border-radius: 6px;
  padding: 4px;
}

.period-button {
  flex: 1;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #888;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-button:hover {
  color: #ffffff;
  background: #333;
}

.period-button.active {
  background: #007acc;
  color: #ffffff;
}

.date-grid {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.date-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-button {
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 4px;
  color: #888;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.date-button:hover {
  color: #ffffff;
  border-color: #555;
  background: #333;
}

.date-button.active {
  background: #007acc;
  border-color: #007acc;
  color: #ffffff;
}

.datepicker-footer {
  display: flex;
  justify-content: flex-end;
}

.confirm-button {
  padding: 8px 16px;
  background: #007acc;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-button:hover {
  background: #0056b3;
}
</style>