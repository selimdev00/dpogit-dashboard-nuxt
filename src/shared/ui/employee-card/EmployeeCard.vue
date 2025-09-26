<template>
  <div class="rounded-lg border bg-card p-6 shadow-sm transition-all hover:bg-muted/10 hover:shadow-md">
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
      <div class="text-sm text-muted-foreground">
        ID: {{ id }}
      </div>
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
          :total="Number(metric.plan) || 0"
          :type="metric.formatType"
          :loading="isLoading"
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

// Create reactive query parameters
const queryParams = computed(() => ({
  employee_ids: [props.id],
  dateFrom: dashboardStore.selectedDateRange.dateFrom,
  dateTo: dashboardStore.selectedDateRange.dateTo,
}));

// Fetch invoices and calls data separately for this employee
const {
  data: invoicesData,
  isLoading: invoicesLoading,
  isFetching: invoicesFetching,
  error: invoicesError,
} = useMetricQuery("invoices", queryParams, {
  staleTime: 0, // Always refetch
  refetchInterval: false,
});

const {
  data: callsData,
  isLoading: callsLoading,
  isFetching: callsFetching,
  error: callsError,
} = useMetricQuery("calls", queryParams, {
  staleTime: 0, // Always refetch
  refetchInterval: false,
});

// Combined loading state (use isFetching for refetches, isLoading for initial load)
const isLoading = computed(() => {
  const loading = invoicesLoading.value || callsLoading.value;
  const fetching = invoicesFetching.value || callsFetching.value;
  const combinedState = loading || fetching;

  console.log(`Employee ${props.id} states:`, {
    invoicesLoading: invoicesLoading.value,
    callsLoading: callsLoading.value,
    invoicesFetching: invoicesFetching.value,
    callsFetching: callsFetching.value,
    combinedLoading: combinedState,
    dateRange: dashboardStore.selectedDateRange
  });

  return combinedState;
});

// Process the data using dashboard configuration
const employeeMetrics = computed(() => {
  const metrics: DashboardMetric[] = [];

  console.log(callsData.value);
  console.log(invoicesData.value);

  // Process each config that matches our fetched data
  dashboardMetricsConfig.forEach((config) => {
    let apiData = null;

    if (config.apiKey === "invoices" && invoicesData.value) {
      apiData = invoicesData.value;
    } else if (config.apiKey === "calls" && callsData.value) {
      apiData = callsData.value;
    }

    if (apiData) {
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

        // Set plan from plan/assumption value
        const planValue = Number(rawPlan) || 0;
        if (planValue > 0) {
          metric.plan = planValue;
        }

        // Set progress percentage
        const progressPercent = Number(rawProgress) || 0;
        metric.progressValue = Math.max(0, Math.min(100, progressPercent));

        metrics.push(metric);
      }
    }
  });

  // Add call duration metrics if calls data is available
  if (callsData.value) {
    const callsResponse: MetricData = callsData.value.calls;

    // Add moreThan3s metric
    if (callsResponse.moreThan3s) {
      metrics.push({
        id: "calls_more_than_3s",
        title: "Звонки > 3 сек",
        value: Number(callsResponse.moreThan3s.count) || 0,
        plan: 100, // Assuming 100% as target
        formatType: "count",
        progressValue: Number(callsResponse.moreThan3s.percentage) || 0,
      });
    }

    // Add moreThan30s metric
    if (callsResponse.moreThan30s) {
      metrics.push({
        id: "calls_more_than_30s",
        title: "Звонки > 30 сек",
        value: Number(callsResponse.moreThan30s.count) || 0,
        plan: 100, // Assuming 100% as target
        formatType: "count",
        progressValue: Number(callsResponse.moreThan30s.percentage) || 0,
      });
    }

    // Add moreThan90s metric
    if (callsResponse.moreThan90s) {
      metrics.push({
        id: "calls_more_than_90s",
        title: "Звонки > 90 сек",
        value: Number(callsResponse.moreThan90s.count) || 0,
        plan: 100, // Assuming 100% as target
        formatType: "count",
        progressValue: Number(callsResponse.moreThan90s.percentage) || 0,
      });
    }
  }

  return metrics;
});
</script>