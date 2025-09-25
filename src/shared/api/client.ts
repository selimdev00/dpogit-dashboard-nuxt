import type { ApiQueryParams, MetricApiResponse, MetricKey } from './types'

class ApiClient {
  private baseUrl: string

  constructor() {
    const config = useRuntimeConfig()
    this.baseUrl = config.public.apiHost as string
  }

  private buildQueryString(params: ApiQueryParams): string {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array parameters like employee_ids[]
          value.forEach(item => {
            searchParams.append(`${key}[]`, item.toString())
          })
        } else {
          searchParams.append(key, value.toString())
        }
      }
    })

    return searchParams.toString()
  }

  async fetchMetric(key: MetricKey, params: ApiQueryParams = {}): Promise<MetricApiResponse> {
    const queryString = this.buildQueryString(params)
    const url = `${this.baseUrl}/api/${key}${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()