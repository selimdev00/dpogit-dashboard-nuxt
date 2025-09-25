import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { apiClient } from './client'
import type { MetricApiResponse, ApiQueryParams, MetricKey } from './types'

export interface UseMetricQueryOptions {
  enabled?: boolean
  staleTime?: number
  refetchInterval?: number
}

export function useMetricQuery(
  key: Ref<MetricKey> | MetricKey,
  params: Ref<ApiQueryParams> | ApiQueryParams = {},
  options: UseMetricQueryOptions = {}
): UseQueryReturnType<MetricApiResponse, Error> {
  const keyRef = isRef(key) ? key : ref(key)
  const paramsRef = isRef(params) ? params : ref(params)

  return useQuery({
    queryKey: ['metric', keyRef, paramsRef] as const,
    queryFn: () => apiClient.fetchMetric(unref(keyRef), unref(paramsRef)),
    enabled: (options.enabled ?? true) && process.client, // Only run on client
    staleTime: options.staleTime ?? 5 * 60 * 1000, // 5 minutes
    refetchInterval: options.refetchInterval,
  })
}

// Convenience function for multiple metrics
export function useMultipleMetrics(
  metrics: Array<{ key: MetricKey; params?: ApiQueryParams }>,
  options: UseMetricQueryOptions = {}
) {
  return metrics.map(({ key, params = {} }) =>
    useMetricQuery(key, params, options)
  )
}