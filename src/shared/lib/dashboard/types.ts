export interface DashboardMetric {
  id: string
  title: string
  value: string | number
  subtitle?: string
  changeText?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  description?: string
  progressValue?: number
  formatType?: 'currency' | 'number' | 'percentage' | 'text'
}

export interface DashboardData {
  metrics: DashboardMetric[]
}