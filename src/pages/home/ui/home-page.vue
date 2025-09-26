<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <!-- Error State -->
      <div
        v-if="hasError && !isLoading"
        class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
      >
        <h3 class="text-destructive font-medium mb-2">
          Ошибка загрузки данных
        </h3>
        <ul class="text-sm text-destructive/80">
          <li v-for="error in errors" :key="error.message">
            {{ error.message }}
          </li>
        </ul>
      </div>

      <div class="space-y-12">
        <!-- Dashboard Content -->
        <DashboardGrid :metrics="dashboardMetrics" />

        <!-- Department Grid -->
        <DepartmentGrid />

        <!-- Circle Metrics -->
        <MetricsCircleGrid
          :circle-metrics="circleMetrics"
          :is-loading="isLoading"
          :has-error="hasError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardGrid } from "@/widgets/dashboard";
import { DepartmentGrid } from "@/widgets/departments";
import { MetricsCircleGrid } from "@/widgets/metrics-circle";
import { useDashboardData } from "@/widgets/dashboard/model/useDashboardData";
import { useDashboardStore } from "@/shared/stores/dashboard";

const dashboardStore = useDashboardStore();

const { dashboardMetrics, isLoading, hasError, errors, refetchAll } =
  useDashboardData();

// Create circle metrics from dashboard data
const circleMetrics = computed(() => {
  // Consistent color palette
  const colors = [
    "rgba(0, 119, 247, 1)",    // Blue
    "rgba(151, 71, 255, 1)",   // Purple
    "rgba(24, 160, 251, 1)",   // Light Blue
  ];

  const baseMetrics = [
    {
      id: "leads",
      label: "Лиды, шт",
      totalValue: 754,
      formatType: "number" as const,
      showDetails: true,
      valueGroups: [
        { name: "Холодные", value: 300, percentage: 35, color: colors[0] },
        { name: "Теплые", value: 250, percentage: 30, color: colors[1] },
        { name: "Горячие", value: 204, percentage: 25, color: colors[2] },
      ],
    },
    {
      id: "calls",
      label: "Звонки, шт",
      totalValue: 754,
      formatType: "number" as const,
      showDetails: true,
      valueGroups: [
        { name: "Исходящие", value: 450, percentage: 60, color: colors[0] },
        { name: "Входящие", value: 304, percentage: 40, color: colors[1] },
      ],
    },
    {
      id: "sales",
      label: "Продажи, шт",
      totalValue: 754,
      formatType: "number" as const,
      showDetails: true,
      valueGroups: [
        { name: "Новые", value: 400, percentage: 53, color: colors[0] },
        { name: "Повторные", value: 354, percentage: 47, color: colors[1] },
      ],
    },
    {
      id: "contracts",
      label: "Сумма договоров, руб",
      totalValue: 754000,
      formatType: "currency" as const,
      showDetails: true,
      valueGroups: [
        { name: "Крупные", value: 400000, percentage: 55, color: colors[0] },
        { name: "Средние", value: 250000, percentage: 30, color: colors[1] },
        { name: "Мелкие", value: 104000, percentage: 15, color: colors[2] },
      ],
    },
  ];

  return baseMetrics;
});
</script>
