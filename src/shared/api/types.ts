export interface ApiResponse<T = unknown> {
  message: string
  [key: string]: T | string
}

export interface MetricData {
  count: number
  plan: number
  progress: number
  remain: number
  assumption: number
  assumptionPercent: number
  need: number
  prevCount: number
}

export interface MetricApiResponse extends ApiResponse {
  invoices?: MetricData
  [key: string]: MetricData | string | undefined
}

export interface ApiQueryParams {
  dateFrom?: string
  dateTo?: string
  by?: string
  employee_ids?: number[]
  department_ids?: number[]
  is_paid?: 0 | 1
}

export type MetricKey = string