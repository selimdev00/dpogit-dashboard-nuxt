import { useMultipleMetrics } from "@/shared/api";
import {
  dashboardMetricsConfig,
  type DashboardMetricConfig,
} from "@/shared/lib/dashboard/config";
import type { DashboardMetric } from "@/shared/lib/dashboard/types";
import type { MetricData, MetricApiResponse } from "@/shared/api";
import { useDashboardStore } from "@/shared/stores/dashboard";

export function useDashboardData() {
  const dashboardStore = useDashboardStore();

  // Create reactive queries that update when date range changes
  const metricQueries = useMultipleMetrics(
    computed(() =>
      dashboardMetricsConfig.map((config) => ({
        key: config.apiKey,
        params: {
          ...config.apiParams,
          ...dashboardStore.getApiParams,
        },
      })),
    ),
  );

  // Transform API data to dashboard metrics
  const dashboardMetrics = computed(() => {
    const queries = metricQueries.value;
    return dashboardMetricsConfig.map((config, index) => {
      const query = queries[index];
      const metric: DashboardMetric = {
        id: config.id,
        title: config.title,
        value: query.isLoading.value ? "..." : 0,
        formatType: config.formatType || "text",
        description: config.description,
      };

      if (query.data?.value && query.data.value.message === "success") {
        const apiData = query.data.value;
        const dataProperty = config.dataProperty;
        const valueProperty = config.valueProperty || "count";
        const progressProperty = config.progressProperty || "assumptionPercent";
        const planProperty = config.planProperty || "plan";

        // Get the data from the response (e.g., apiData.invoices)
        const metricData = apiData[dataProperty] as MetricData | undefined;

        if (metricData) {
          // Set the main value (e.g., metricData.count)
          metric.value = metricData[valueProperty as keyof MetricData] || 0;

          // Set plan from plan/assumption value
          const planValue = metricData[planProperty as keyof MetricData] || 0;
          if (planValue > 0) {
            metric.plan = planValue;
          }

          // Set progress percentage
          const progressPercent = metricData[
            progressProperty as keyof MetricData
          ] as number;
          metric.progressValue = Math.max(0, Math.min(100, progressPercent));

          // Calculate change compared to previous value
          const currentValue = metric.value as number;
          const previousValue = metricData.prevCount || 0;

          if (previousValue !== undefined && previousValue !== currentValue) {
            const changePercent =
              previousValue === 0
                ? currentValue > 0
                  ? 100
                  : 0
                : ((currentValue - previousValue) / Math.abs(previousValue)) *
                  100;

            if (Math.abs(changePercent) > 0.01) {
              // Only show if change is meaningful
              metric.changeText = `чем в прошлом периоде`;
              metric.changePercent = changePercent;
              metric.changeType = changePercent >= 0 ? "increase" : "decrease";
            }
          }
        }
      } else if (query.isError.value) {
        // Show error state
        metric.value = "Ошибка";
        metric.formatType = "text";
      }

      return metric;
    });
  });

  // Loading and error states
  const isLoading = computed(() =>
    metricQueries.value.some((query) => query.isLoading.value),
  );

  const hasError = computed(() =>
    metricQueries.value.some((query) => query.isError.value),
  );

  const errors = computed(() =>
    metricQueries.value.map((query) => query.error.value).filter(Boolean),
  );

  // Refetch all metrics
  const refetchAll = () => {
    metricQueries.value.forEach((query) => query.refetch());
  };

  return {
    dashboardMetrics,
    isLoading,
    hasError,
    errors,
    refetchAll,
    metricQueries, // Expose individual queries if needed
  };
}
