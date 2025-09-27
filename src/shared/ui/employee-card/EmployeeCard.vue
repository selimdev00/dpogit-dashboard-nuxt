<template>
  <div
    class="rounded-lg border bg-card p-6 shadow-sm transition-all hover:bg-muted/10 hover:shadow-md"
  >
    <!-- Employee Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative h-10 w-10 flex-shrink-0">
          <img
            v-if="photo"
            :src="photo"
            :alt="name"
            class="h-full w-full rounded-full object-cover"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
          >
            {{ getInitials(name) }}
          </div>
        </div>
        <div>
          <h3 class="font-medium text-foreground">{{ name }}</h3>
          <p v-if="position" class="text-xs text-muted-foreground">
            {{ position }}
          </p>
        </div>
      </div>
      <div class="text-sm text-muted-foreground">ID: {{ id }}</div>
    </div>

    <!-- Employee Color Indicator (if provided) -->
    <div v-if="color" class="mb-4 flex items-center gap-2">
      <div
        class="h-3 w-3 rounded-full"
        :style="{ backgroundColor: color }"
      ></div>
      <span class="text-xs text-muted-foreground">Персональный цвет</span>
    </div>

    <!-- Employee Stats -->
    <div class="space-y-4 text-sm grid grid-cols-2 gap-4">
      <template v-for="metric in employeeMetrics" :key="metric.id">
        <MetricProgress
          :label="metric.title"
          :current="Number(metric.value) || 0"
          v-bind="
            metric.plan !== undefined ? { total: Number(metric.plan) || 0 } : {}
          "
          :type="metric.formatType"
          :loading="isLoading"
          :additional-text="metric.additionalText"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from "@/shared/api/types";
import { MetricProgress } from "@/shared/ui/metric-progress";
import { useMetricQuery } from "@/shared/api/queries";
import { useDashboardStore } from "@/shared/stores/dashboard";
import { dashboardMetricsConfig } from "@/shared/lib/dashboard/config";
import type { DashboardMetric } from "@/shared/lib/dashboard/types";
import type { MetricData } from "@/shared/api/types";
import { formatValue } from "@/shared/lib/formatters";

interface EmployeeCardProps {
  id: number;
  name: string;
  position?: string;
  photo?: string | null;
  color?: string | null;
}

const props = defineProps<EmployeeCardProps>();

const dashboardStore = useDashboardStore();

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Generate unique queries from dashboard config (excluding average_check)
const queryConfigs = computed(() => {
  const uniqueQueries = new Map();

  dashboardMetricsConfig.filter(config => config.id !== "average_check").forEach((config) => {
    const apiParams = config.apiParams || {};
    const queryKey = `${config.apiKey}_${JSON.stringify(apiParams)}`;

    if (!uniqueQueries.has(queryKey)) {
      uniqueQueries.set(queryKey, {
        queryKey,
        apiKey: config.apiKey,
        apiParams,
        params: {
          employee_ids: [props.id],
          dateFrom: dashboardStore.selectedDateRange.dateFrom,
          dateTo: dashboardStore.selectedDateRange.dateTo,
          ...apiParams,
        },
      });
    }
  });

  return Array.from(uniqueQueries.values());
});

// Create queries dynamically based on config
const queries = queryConfigs.value.map((config) => {
  const queryParams = computed(() => config.params);

  return {
    ...useMetricQuery(config.apiKey, queryParams, {
      staleTime: 0,
      refetchInterval: false,
    }),
    queryKey: config.queryKey,
  };
});

// Combined loading state
const isLoading = computed(() => {
  return queries.some(
    (query) => query.isLoading.value || query.isFetching.value,
  );
});

// Process the data using dashboard configuration
const employeeMetrics = computed(() => {
  const metrics: DashboardMetric[] = [];

  // Process each config (excluding average_check which is only for main dashboard)
  dashboardMetricsConfig.filter(config => config.id !== "average_check").forEach((config) => {
    // Find the matching query for this config
    const configQueryKey = `${config.apiKey}_${JSON.stringify(config.apiParams || {})}`;
    const matchingQuery = queries.find(
      (query) => query.queryKey === configQueryKey,
    );

    if (matchingQuery?.data?.value) {
      const apiData = matchingQuery.data.value;
      const dataProperty = config.dataProperty;
      const valueProperty = config.valueProperty || "count";
      const progressProperty = config.progressProperty || "assumptionPercent";
      const planProperty = config.planProperty || "plan";

      // Get the data from the response (e.g., apiData.invoices)
      const metricData = apiData[dataProperty] as MetricData | undefined;

      if (metricData) {
        const rawValue = metricData[valueProperty as keyof MetricData];
        const rawPlan = metricData[planProperty as keyof MetricData];
        const rawProgress = metricData[progressProperty as keyof MetricData];

        const metric: DashboardMetric = {
          id: config.id,
          title: config.title,
          value: Number(rawValue) || 0,
          formatType: config.formatType || "text",
          description: config.description,
        };

        // Set plan from plan/assumption value (only if planProperty is not false)
        if (config.planProperty !== false) {
          const planValue = Number(rawPlan) || 0;
          metric.plan = planValue;

          // Set progress percentage (only if there's a plan)
          const progressPercent = Number(rawProgress) || 0;
          metric.progressValue = Math.max(0, Math.min(100, progressPercent));
        }

        // Calculate average check for paid invoices total metric
        if (config.id === "invoices_paid_total") {
          // Find the paid invoices count from the same employee
          const paidCountQuery = queries.find(
            (query) =>
              query.queryKey === `invoices_${JSON.stringify({ is_paid: 1 })}`,
          );

          if (paidCountQuery?.data?.value) {
            const paidCountData = paidCountQuery.data.value;
            const paidCountMetricData = paidCountData.invoices;
            const paidCount = paidCountMetricData?.count || 0;

            let averageCheck = Number(metric.value) / paidCount;
            if (isNaN(averageCheck)) {
              averageCheck = 0;
            }
            metric.additionalText = `Ср. чек: ${formatValue(averageCheck, "currency")}`;
          }
        }

        console.log(metric);

        metrics.push(metric);
      }
    }
  });

  return metrics;
});
</script>
