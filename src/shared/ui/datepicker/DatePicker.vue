<template>
  <div class="relative" ref="datepickerRef">
    <button
      @click="toggleDropdown"
      class="inline-flex items-center gap-2 rounded-md bg-card text-muted-foreground px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      <Calendar class="h-4 w-4" />
      {{ formatSelectedDate }}
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 top-full z-50 mt-1 min-w-[400px] rounded-md bg-popover p-4 text-popover-foreground shadow-md"
    >
      <!-- Period Selector -->
      <div class="mb-4 flex rounded-lg bg-card p-1">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="selectPeriod(period.value)"
          :class="[
            'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            selectedPeriod === period.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ]"
        >
          {{ period.label }}
        </button>
      </div>

      <!-- Date Grid -->
      <div class="mb-4 flex gap-4">
        <!-- Years Column -->
        <div class="flex flex-1 flex-col gap-1">
          <button
            v-for="year in years"
            :key="year"
            @click="selectYear(year)"
            :class="[
              'rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              selectedYear === year ? 'bg-primary text-primary-foreground' : '',
            ]"
          >
            {{ year }}
          </button>
        </div>

        <!-- Months Column -->
        <div
          v-if="selectedPeriod === 'month' || selectedPeriod === 'quarter'"
          class="flex flex-1 flex-col gap-1"
        >
          <button
            v-for="month in months"
            :key="month.value"
            @click="selectMonth(month.value)"
            :class="[
              'rounded-md  px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              selectedMonth === month.value
                ? 'bg-primary text-primary-foreground'
                : '',
            ]"
          >
            {{ month.label }}
          </button>
        </div>

        <!-- Quarters Column -->
        <div
          v-if="selectedPeriod === 'quarter'"
          class="flex flex-1 flex-col gap-1"
        >
          <button
            v-for="quarter in quarters"
            :key="quarter.value"
            @click="selectQuarter(quarter.value)"
            :class="[
              'rounded-md  px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              selectedQuarter === quarter.value
                ? ' bg-primary text-primary-foreground'
                : '',
            ]"
          >
            {{ quarter.label }}
          </button>
        </div>
      </div>

      <!-- Confirm Button -->
      <div class="flex justify-end">
        <button
          @click="confirmSelection"
          class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Подтвердить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from "lucide-vue-next";

interface DatePickerEmits {
  (
    e: "update:modelValue",
    value: { period: string; year: number; month?: number; quarter?: number },
  ): void;
}

interface DatePickerProps {
  modelValue?: {
    period: string;
    year: number;
    month?: number;
    quarter?: number;
  };
}

const props = defineProps<DatePickerProps>();
const emit = defineEmits<DatePickerEmits>();

const datepickerRef = ref<HTMLElement>();
const isOpen = ref(false);

// State
const selectedPeriod = ref("month");
const selectedYear = ref(2025);
const selectedMonth = ref(9); // September
const selectedQuarter = ref(1);

// Data
const periods = [
  { value: "month", label: "Месяц" },
  { value: "quarter", label: "Квартал" },
  { value: "year", label: "Год" },
  { value: "period", label: "Период" },
];

const years = Array.from({ length: 8 }, (_, i) => 2025 + i);

const months = [
  { value: 9, label: "сентябрь" },
  { value: 10, label: "октябрь" },
  { value: 11, label: "ноябрь" },
  { value: 12, label: "декабрь" },
];

const quarters = [
  { value: 1, label: "Q1" },
  { value: 2, label: "Q2" },
  { value: 3, label: "Q3" },
  { value: 4, label: "Q4" },
];

// Computed
const formatSelectedDate = computed(() => {
  if (selectedPeriod.value === "month") {
    const monthName =
      months.find((m) => m.value === selectedMonth.value)?.label || "сентябрь";
    return `${monthName} ${selectedYear.value}`;
  } else if (selectedPeriod.value === "quarter") {
    return `Q${selectedQuarter.value} ${selectedYear.value}`;
  } else if (selectedPeriod.value === "year") {
    return `${selectedYear.value}`;
  }
  return "Период";
});

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectPeriod = (period: string) => {
  selectedPeriod.value = period;
};

const selectYear = (year: number) => {
  selectedYear.value = year;
};

const selectMonth = (month: number) => {
  selectedMonth.value = month;
};

const selectQuarter = (quarter: number) => {
  selectedQuarter.value = quarter;
};

const confirmSelection = () => {
  const value = {
    period: selectedPeriod.value,
    year: selectedYear.value,
    ...(selectedPeriod.value === "month" && { month: selectedMonth.value }),
    ...(selectedPeriod.value === "quarter" && {
      quarter: selectedQuarter.value,
    }),
  };

  emit("update:modelValue", value);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    datepickerRef.value &&
    !datepickerRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Initialize from props
  if (props.modelValue) {
    selectedPeriod.value = props.modelValue.period;
    selectedYear.value = props.modelValue.year;
    if (props.modelValue.month) selectedMonth.value = props.modelValue.month;
    if (props.modelValue.quarter)
      selectedQuarter.value = props.modelValue.quarter;
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
