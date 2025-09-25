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

export const useDashboardStore = defineStore("dashboard", () => {
  // State
  const selectedDateRange = ref<DateRange>({
    period: "month",
    year: 2025,
    month: 9,
    dateFrom: "2025-09-01",
    dateTo: "2025-09-30",
  });

  // Actions
  const setDateRange = (dateRange: DateRange) => {
    selectedDateRange.value = { ...dateRange };
  };

  const updateDateRange = (updates: Partial<DateRange>) => {
    selectedDateRange.value = { ...selectedDateRange.value, ...updates };
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

  return {
    // State
    selectedDateRange: readonly(selectedDateRange),

    // Actions
    setDateRange,
    updateDateRange,

    // Getters
    getFormattedDateRange,
    getApiParams,
  };
});
