import { useQuery, type UseQueryReturnType } from "@tanstack/vue-query";
import { apiClient } from "./client";
import type {
  MetricApiResponse,
  ApiQueryParams,
  MetricKey,
  Department,
} from "./types";

export interface UseMetricQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

export function useMetricQuery(
  key: Ref<MetricKey> | MetricKey,
  params: Ref<ApiQueryParams> | ApiQueryParams = {},
  options: UseMetricQueryOptions = {},
): UseQueryReturnType<MetricApiResponse, Error> {
  const keyRef = isRef(key) ? key : ref(key);
  const paramsRef = isRef(params) ? params : ref(params);

  return useQuery({
    queryKey: ["metric", keyRef, paramsRef] as const,
    queryFn: () => apiClient.fetchMetric(unref(keyRef), unref(paramsRef)),
    enabled: options.enabled ?? true, // Only run on client
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.refetchInterval,
  });
}

// Convenience function for multiple metrics
export function useMultipleMetrics(
  metrics:
    | Ref<Array<{ key: MetricKey; params?: ApiQueryParams }>>
    | Array<{ key: MetricKey; params?: ApiQueryParams }>,
  options: UseMetricQueryOptions = {},
) {
  const metricsRef = isRef(metrics) ? metrics : ref(metrics);

  return computed(() => {
    return unref(metricsRef).map(({ key, params = {} }) =>
      useMetricQuery(key, params, options),
    );
  });
}

// Query for departments
export function useDepartmentsQuery(
  options: UseMetricQueryOptions = {},
): UseQueryReturnType<Department[], Error> {
  return useQuery({
    queryKey: ["departments"] as const,
    queryFn: () => apiClient.fetchDepartments(),
    enabled: (options.enabled ?? true) && process.client,
    staleTime: options.staleTime ?? 10 * 60 * 1000, // 10 minutes
    refetchInterval: options.refetchInterval,
  });
}
