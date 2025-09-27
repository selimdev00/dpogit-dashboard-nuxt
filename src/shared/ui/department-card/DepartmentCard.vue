<template>
  <NuxtLink
    :to="`/department/${id}`"
    class="block rounded-lg border bg-card p-6 shadow-sm transition-all hover:bg-muted/10 hover:shadow-md cursor-pointer"
  >
    <!-- Department Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          v-if="color"
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: color }"
        ></div>
        <h3 class="font-medium text-foreground">{{ name }}</h3>
      </div>
      <div class="text-sm text-muted-foreground">
        {{ employees?.length || 0 }} сотр.
      </div>
    </div>

    <!-- Employee Avatars -->
    <div class="mb-4 flex -space-x-2 overflow-hidden">
      <template
        v-for="(employee, index) in displayedEmployees"
        :key="employee.id"
      >
        <div
          v-if="employee.photo"
          class="relative h-8 w-8 rounded-full border-2 border-background"
        >
          <img
            :src="employee.photo"
            :alt="employee.name"
            class="h-full w-full rounded-full object-cover"
          />
        </div>
        <div
          v-else
          class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground"
        >
          {{ getInitials(employee.name) }}
        </div>
      </template>

      <!-- Show remaining count if there are more employees -->
      <div
        v-if="remainingCount > 0"
        class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground"
      >
        +{{ remainingCount }}
      </div>
    </div>

    <!-- Department Stats -->
    <div class="space-y-4 text-sm grid grid-cols-2 gap-4">
      <template v-for="metric in departmentMetrics" :key="metric.id">
        <MetricProgress
          :label="metric.title"
          :current="Number(metric.value) || 0"
          v-bind="
            metric.plan !== undefined ? { total: Number(metric.plan) || 0 } : {}
          "
          :type="metric.formatType"
          :loading="isLoading"
        />
      </template>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Department } from "@/shared/api/types";
import { MetricProgress } from "@/shared/ui/metric-progress";
import { useMetricQuery } from "@/shared/api/queries";
import { useDashboardStore } from "@/shared/stores/dashboard";
import { dashboardMetricsConfig } from "@/shared/lib/dashboard/config";
import type { DashboardMetric } from "@/shared/lib/dashboard/types";
import type { MetricData } from "@/shared/api/types";

interface DepartmentCardProps {
  id: number;
  name: string;
  color?: string | null;
  employees?: Department["employees"];
}

const props = defineProps<DepartmentCardProps>();

const dashboardStore = useDashboardStore();
const maxDisplayedEmployees = 5;

const displayedEmployees = computed(
  () => props.employees?.slice(0, maxDisplayedEmployees) || [],
);

const remainingCount = computed(() =>
  Math.max(0, (props.employees?.length || 0) - maxDisplayedEmployees),
);

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// Generate unique queries from dashboard config
const queryConfigs = computed(() => {
  const uniqueQueries = new Map();

  dashboardMetricsConfig.forEach((config) => {
    const apiParams = config.apiParams || {};
    const queryKey = `${config.apiKey}_${JSON.stringify(apiParams)}`;

    if (!uniqueQueries.has(queryKey)) {
      uniqueQueries.set(queryKey, {
        queryKey,
        apiKey: config.apiKey,
        apiParams,
        params: {
          department_ids: [props.id],
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
const departmentMetrics = computed(() => {
  const metrics: DashboardMetric[] = [];

  // Process each config
  dashboardMetricsConfig.forEach((config) => {
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

        metrics.push(metric);
      }
    }
  });

  return metrics;
});
</script>
