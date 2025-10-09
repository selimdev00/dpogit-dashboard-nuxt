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

      <div class="flex gap-4">
        <!-- Date Grid -->
        <div class="mb-4 flex gap-4 flex-1">
          <!-- Years Column -->
          <div class="flex flex-1 flex-col gap-1">
            <button
              v-for="year in years"
              :key="year"
              @click="selectYear(year)"
              :class="[
                'rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                selectedYear === year
                  ? 'bg-primary text-primary-foreground'
                  : '',
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

        <!-- Period Calendar -->
        <div v-if="selectedPeriod === 'period'" class="mb-4">
          <!-- Month Navigation -->
          <div class="mb-4 flex items-center justify-between">
            <button
              @click="previousMonth"
              class="rounded-md p-1 hover:bg-accent"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div class="flex gap-2">
              <span class="text-sm font-medium"
                >{{ getMonthName(currentMonth) }} {{ currentYear }}</span
              >
              <span
                v-if="
                  currentMonth !== displayMonth || currentYear !== displayYear
                "
                class="text-sm text-muted-foreground"
              >
                — {{ getMonthName(displayMonth) }} {{ displayYear }}
              </span>
            </div>
            <button @click="nextMonth" class="rounded-md p-1 hover:bg-accent">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 text-center text-xs">
            <!-- Week headers -->
            <div
              v-for="day in weekDays"
              :key="day"
              class="p-2 text-muted-foreground font-medium"
            >
              {{ day }}
            </div>

            <!-- Calendar days -->
            <button
              v-for="date in calendarDays"
              :key="`${date.year}-${date.month}-${date.day}`"
              @click="selectDate(date)"
              :disabled="isDateDisabled(date)"
              :class="[
                'p-2 rounded-md text-sm transition-colors',
                !date.isCurrentMonth && 'text-muted-foreground',
                isDateDisabled(date)
                  ? 'text-muted-foreground/50 cursor-not-allowed'
                  : 'hover:bg-accent',
                isDateInRange(date) &&
                  !isDateDisabled(date) &&
                  'bg-primary/20 text-primary',
                isDateSelected(date, 'start') &&
                  !isDateDisabled(date) &&
                  'bg-primary text-primary-foreground',
                isDateSelected(date, 'end') &&
                  !isDateDisabled(date) &&
                  'bg-primary text-primary-foreground',
              ]"
            >
              {{ date.day }}
            </button>
          </div>
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
    value: {
      period: string;
      year: number;
      month?: number;
      quarter?: number;
      startDate?: string;
      endDate?: string;
      dateFrom?: string;
      dateTo?: string;
    },
  ): void;
}

interface DatePickerProps {
  modelValue?: {
    period: string;
    year: number;
    month?: number;
    quarter?: number;
    startDate?: string;
    endDate?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const props = defineProps<DatePickerProps>();
const emit = defineEmits<DatePickerEmits>();

const datepickerRef = ref<HTMLElement>();
const isOpen = ref(false);

// State
const selectedPeriod = ref("month");
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1); // Current month (1-indexed)
const selectedQuarter = ref(Math.ceil((new Date().getMonth() + 1) / 3)); // Current quarter

// Period calendar state - start from current month for period selection
const currentMonth = ref(new Date().getMonth()); // Current month (0-indexed)
const currentYear = ref(new Date().getFullYear());
const displayMonth = ref(new Date().getMonth()); // Current month (0-indexed)
const displayYear = ref(new Date().getFullYear());
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

// Data
const periods = [
  { value: "month", label: "Месяц" },
  { value: "quarter", label: "Квартал" },
  { value: "year", label: "Год" },
  { value: "period", label: "Период" },
];

// Generate years from 2023 to current year (inclusive)
const currentYearNumber = new Date().getFullYear();
const years = Array.from({ length: currentYearNumber - 2022 }, (_, i) => 2023 + i);

// Generate all months from January to current month (if current year selected)
const months = computed(() => {
  const allMonths = [
    { value: 1, label: "январь" },
    { value: 2, label: "февраль" },
    { value: 3, label: "март" },
    { value: 4, label: "апрель" },
    { value: 5, label: "май" },
    { value: 6, label: "июнь" },
    { value: 7, label: "июль" },
    { value: 8, label: "август" },
    { value: 9, label: "сентябрь" },
    { value: 10, label: "октябрь" },
    { value: 11, label: "ноябрь" },
    { value: 12, label: "декабрь" },
  ];

  const currentYearValue = new Date().getFullYear();
  const currentMonthValue = new Date().getMonth() + 1; // 1-indexed

  // If current year is selected, only show months up to current month
  if (selectedYear.value === currentYearValue) {
    return allMonths.filter(month => month.value <= currentMonthValue);
  }

  // For past years, show all months
  return allMonths;
});

// Generate quarters up to current quarter (if current year selected)
const quarters = computed(() => {
  const allQuarters = [
    { value: 1, label: "Q1" },
    { value: 2, label: "Q2" },
    { value: 3, label: "Q3" },
    { value: 4, label: "Q4" },
  ];

  const currentYearValue = new Date().getFullYear();
  const currentMonthValue = new Date().getMonth() + 1; // 1-indexed
  const currentQuarterValue = Math.ceil(currentMonthValue / 3);

  // If current year is selected, only show quarters up to current quarter
  if (selectedYear.value === currentYearValue) {
    return allQuarters.filter(quarter => quarter.value <= currentQuarterValue);
  }

  // For past years, show all quarters
  return allQuarters;
});

const weekDays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Computed
const formatSelectedDate = computed(() => {
  if (selectedPeriod.value === "month") {
    const monthName =
      months.value.find((m) => m.value === selectedMonth.value)?.label || "текущий месяц";
    return `${monthName} ${selectedYear.value}`;
  } else if (selectedPeriod.value === "quarter") {
    return `Q${selectedQuarter.value} ${selectedYear.value}`;
  } else if (selectedPeriod.value === "year") {
    return `${selectedYear.value}`;
  } else if (selectedPeriod.value === "period") {
    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      return `${start.getDate()}.${String(start.getMonth() + 1).padStart(2, "0")}.${start.getFullYear()} — ${end.getDate()}.${String(end.getMonth() + 1).padStart(2, "0")}.${end.getFullYear()}`;
    }
    return "Выберите период";
  }
  return "Период";
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);

  // Add days from previous month
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7));

  // Add days until we have 6 weeks (42 days)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    days.push({
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth: date.getMonth() === currentMonth.value,
    });
  }

  return days;
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

const getMonthName = (monthIndex: number) => {
  return monthNames[monthIndex];
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  const today = new Date();
  const currentDate = new Date(currentYear.value, currentMonth.value);

  // Don't allow navigating to future months
  if (currentDate.getFullYear() >= today.getFullYear() &&
      currentDate.getMonth() >= today.getMonth()) {
    return;
  }

  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDate = (date: { day: number; month: number; year: number }) => {
  // Don't allow selection of disabled dates
  if (isDateDisabled(date)) return;

  const selected = new Date(date.year, date.month, date.day);

  if (!startDate.value || (startDate.value && endDate.value)) {
    // Start new selection
    startDate.value = selected;
    endDate.value = null;
  } else if (!endDate.value) {
    // Set end date
    if (selected >= startDate.value) {
      endDate.value = selected;
    } else {
      endDate.value = startDate.value;
      startDate.value = selected;
    }
  }
};

const isDateSelected = (
  date: { day: number; month: number; year: number },
  type: "start" | "end",
) => {
  const dateObj = new Date(date.year, date.month, date.day);
  if (type === "start") {
    return startDate.value && dateObj.getTime() === startDate.value.getTime();
  }
  return endDate.value && dateObj.getTime() === endDate.value.getTime();
};

const isDateInRange = (date: { day: number; month: number; year: number }) => {
  if (!startDate.value || !endDate.value) return false;
  const dateObj = new Date(date.year, date.month, date.day);
  return dateObj > startDate.value && dateObj < endDate.value;
};

const isDateDisabled = (date: { day: number; month: number; year: number }) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const dateObj = new Date(date.year, date.month, date.day);
  return dateObj > today;
};

const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDateRange = () => {
  let dateFrom: Date;
  let dateTo: Date;

  if (selectedPeriod.value === "year") {
    // Year: first day to last day of the year
    dateFrom = new Date(selectedYear.value, 0, 1); // January 1st
    dateTo = new Date(selectedYear.value, 11, 31); // December 31st
  } else if (selectedPeriod.value === "month") {
    // Month: first day to last day of the selected month
    const month = selectedMonth.value - 1; // Convert from 1-based to 0-based
    dateFrom = new Date(selectedYear.value, month, 1); // First day of selected month
    dateTo = new Date(selectedYear.value, month + 1, 0); // Last day of selected month
  } else if (selectedPeriod.value === "quarter") {
    // Quarter: first day to last day of the quarter
    const quarter = selectedQuarter.value;
    const startMonth = (quarter - 1) * 3; // Q1=0, Q2=3, Q3=6, Q4=9
    const endMonth = startMonth + 2;

    dateFrom = new Date(selectedYear.value, startMonth, 1);
    dateTo = new Date(selectedYear.value, endMonth + 1, 0); // Last day of quarter's last month
  } else if (
    selectedPeriod.value === "period" &&
    startDate.value &&
    endDate.value
  ) {
    // Period: use selected start and end dates
    dateFrom = startDate.value;
    dateTo = endDate.value;
  } else {
    // Default fallback
    dateFrom = new Date();
    dateTo = new Date();
  }

  console.log({
    dateFrom: formatDateToYYYYMMDD(dateFrom), // YYYY-MM-DD format
    dateTo: formatDateToYYYYMMDD(dateTo),
  })

  return {
    dateFrom: formatDateToYYYYMMDD(dateFrom), // YYYY-MM-DD format
    dateTo: formatDateToYYYYMMDD(dateTo),
  };
};

const confirmSelection = () => {
  const { dateFrom, dateTo } = getDateRange();

  const value = {
    period: selectedPeriod.value,
    year: selectedYear.value,
    dateFrom,
    dateTo,
    ...(selectedPeriod.value === "month" && { month: selectedMonth.value }),
    ...(selectedPeriod.value === "quarter" && {
      quarter: selectedQuarter.value,
    }),
    ...(selectedPeriod.value === "period" && {
      startDate: startDate.value?.toISOString(),
      endDate: endDate.value?.toISOString(),
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
    if (props.modelValue.startDate)
      startDate.value = new Date(props.modelValue.startDate);
    if (props.modelValue.endDate)
      endDate.value = new Date(props.modelValue.endDate);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
