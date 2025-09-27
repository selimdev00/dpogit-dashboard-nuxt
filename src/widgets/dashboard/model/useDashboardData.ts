import { useMetricQuery } from "@/shared/api";
import {
  dashboardMetricsConfig,
  type DashboardMetricConfig,
} from "@/shared/lib/dashboard/config";
import type { DashboardMetric } from "@/shared/lib/dashboard/types";
import type { MetricData, MetricApiResponse } from "@/shared/api";
import { useDashboardStore } from "@/shared/stores/dashboard";
import { formatValue } from "@/shared/lib/formatters";

export function useDashboardData(departmentId?: Ref<number> | number) {
  const dashboardStore = useDashboardStore();

  // Create individual queries for each metric
  const metricQueries = dashboardMetricsConfig.map((config) => {
    const params = computed(() => {
      const baseParams = {
        ...config.apiParams,
        ...dashboardStore.getApiParams,
      };

      // Add department filter if provided
      if (departmentId) {
        const deptId = unref(departmentId);
        if (deptId) {
          baseParams.department_ids = [deptId];
        }
      }

      return baseParams;
    });

    return useMetricQuery(config.apiKey, params);
  });

  // Transform API data to dashboard metrics
  const dashboardMetrics = computed(() => {
    return dashboardMetricsConfig.map((config, index) => {
      const query = metricQueries[index];
      if (!query) {
        return {
          id: config.id,
          title: config.title,
          value: 0,
          formatType: config.formatType || ("text" as const),
          description: config.description,
        };
      }

      const metric: DashboardMetric = {
        id: config.id,
        title: config.title,
        value: query.isLoading.value ? "..." : 0,
        formatType: config.formatType || "text",
        description: config.description,
      };

      // Debug logging - check what the API is returning
      if (query.data?.value) {
        // console.log(`API Response for ${config.id}:`, query.data.value);
      }
      if (query.error?.value) {
        // console.error(`API Error for ${config.id}:`, query.error.value);
      }

      if (query.data?.value) {
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

          // Set plan from plan/assumption value (only if planProperty is not false)
          if (config.planProperty !== false) {
            const planValue = metricData[planProperty as keyof MetricData] || 0;
            metric.plan = planValue;

            // Set progress percentage (only if there's a plan)
            const progressPercent = metricData[
              progressProperty as keyof MetricData
            ] as number;
            metric.progressValue = Math.max(0, Math.min(100, progressPercent));
          }

          // Calculate average check for paid invoices total metric
          if (config.id === "invoices_paid_total") {
            // Find the paid invoices count metric
            const paidCountConfig = dashboardMetricsConfig.find(c => c.id === "invoices_paid_count");
            if (paidCountConfig) {
              const paidCountIndex = dashboardMetricsConfig.indexOf(paidCountConfig);
              const paidCountQuery = metricQueries[paidCountIndex];

              if (paidCountQuery?.data?.value) {
                const paidCountData = paidCountQuery.data.value;
                const paidCountMetricData = paidCountData.invoices;
                const paidCount = paidCountMetricData?.count || 0;

                if (paidCount > 0) {
                  const averageCheck = Number(metric.value) / paidCount;
                  metric.additionalText = `Ср. чек: ${formatValue(averageCheck, "currency")}`;
                }
              }
            }
          }

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
    metricQueries.some((query) => query?.isLoading.value ?? false),
  );

  const hasError = computed(() =>
    metricQueries.some((query) => query?.isError.value ?? false),
  );

  const errors = computed(() =>
    metricQueries.map((query) => query?.error.value).filter(Boolean),
  );

  // Refetch all metrics
  const refetchAll = () => {
    metricQueries.forEach((query) => query?.refetch?.());
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
