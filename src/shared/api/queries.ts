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
    queryKey: computed(() => [
      "metric",
      unref(keyRef),
      JSON.stringify(unref(paramsRef))
    ]),
    queryFn: () => apiClient.fetchMetric(unref(keyRef), unref(paramsRef)),
    enabled: (options.enabled ?? true) && process.client, // Only run on client
    staleTime: options.staleTime ?? 30 * 1000, // 30 seconds for development
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
  const metricsArray = unref(metrics);

  // Ensure we have an array before calling map
  if (!Array.isArray(metricsArray)) {
    console.warn('useMultipleMetrics: metrics is not an array', metrics);
    return ref([]);
  }

  // Create all queries immediately during setup
  const queries = metricsArray.map(({ key, params = {} }) =>
    useMetricQuery(key, params, options),
  );

  return ref(queries);
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
