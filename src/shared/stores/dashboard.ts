import { defineStore } from "pinia";

export interface DateRange {
  period: string;
  year: number;
  month?: number;
  quarter?: number;
  dateFrom?: string;
  dateTo?: string;
  startDate?: string;
  endDate?: string;
}

const STORAGE_KEY = "dashboard-date-range";

function getDefaultDateRange(): DateRange {
  return {
    period: "month",
    year: 2025,
    month: 9,
    dateFrom: "2025-09-01",
    dateTo: "2025-09-30",
  };
}

function loadDateRangeFromStorage(): DateRange {
  if (process.server) return getDefaultDateRange();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure has required fields
      if (parsed.period && parsed.year) {
        return { ...getDefaultDateRange(), ...parsed };
      }
    }
  } catch (error) {
    console.warn("Failed to load date range from localStorage:", error);
  }

  return getDefaultDateRange();
}

function saveDateRangeToStorage(range: DateRange) {
  if (process.server) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(range));
  } catch (error) {
    console.warn("Failed to save date range to localStorage:", error);
  }
}

export const useDashboardStore = defineStore("dashboard", () => {
  // State
  const selectedDateRange = ref<DateRange>(loadDateRangeFromStorage());

  // Actions
  const setDateRange = (dateRange: DateRange) => {
    selectedDateRange.value = { ...dateRange };
    saveDateRangeToStorage(selectedDateRange.value);
  };

  const updateDateRange = (updates: Partial<DateRange>) => {
    selectedDateRange.value = { ...selectedDateRange.value, ...updates };
    saveDateRangeToStorage(selectedDateRange.value);
  };

  const initFromStorage = () => {
    if (process.client) {
      selectedDateRange.value = loadDateRangeFromStorage();
    }
  };

  // Getters
  const getFormattedDateRange = computed(() => {
    const range = selectedDateRange.value;

    if (range.period === "year") {
      return `${range.year}`;
    } else if (range.period === "quarter") {
      return `Q${range.quarter} ${range.year}`;
    } else if (range.period === "month") {
      const monthNames = [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
      ];
      const monthName = range.month ? monthNames[range.month - 1] : "месяц";
      return `${monthName} ${range.year}`;
    } else if (range.period === "period" && range.dateFrom && range.dateTo) {
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
      };
      return `${formatDate(range.dateFrom)} — ${formatDate(range.dateTo)}`;
    }

    return "Период";
  });

  const getApiParams = computed(() => ({
    dateFrom: selectedDateRange.value.dateFrom,
    dateTo: selectedDateRange.value.dateTo,
  }));

  const getCurrentMonth = computed(() => {
    const range = selectedDateRange.value;
    if (range.year && range.month) {
      return `${range.year}-${range.month.toString().padStart(2, '0')}`;
    }
    // Fallback to current month if not set
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  return {
    // State
    selectedDateRange: readonly(selectedDateRange),

    // Actions
    setDateRange,
    updateDateRange,
    initFromStorage,

    // Getters
    getFormattedDateRange,
    getApiParams,
    getCurrentMonth,
  };
});
