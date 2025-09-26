export interface ApiResponse<T = unknown> {
  message: string;
  [key: string]: T | string;
}

export interface MetricData {
  count: number;
  plan: number;
  progress: number;
  remain: number;
  assumption: number;
  assumptionPercent: number;
  need: number;
  prevCount: number;
  moreThan3s: {
    count: number;
    percentage: number;
  };
  moreThan30s: {
    count: number;
    percentage: number;
  };
  moreThan90s: {
    count: number;
    percentage: number;
  };
}

export interface MetricApiResponse extends ApiResponse {
  invoices?: MetricData;
  [key: string]: MetricData | string | undefined;
}

export interface ApiQueryParams {
  dateFrom?: string;
  dateTo?: string;
  by?: string;
  employee_ids?: number[];
  department_ids?: number[];
  is_paid?: 0 | 1;
}

export interface PlanData {
  id: number;
  department_id: number | null;
  employee_id: number | null;
  event_id: number | null;
  ticket_id: number | null;
  month: string;
  calls: number;
  invoices: number;
  sold_tickets: number;
  created_at: string;
  updated_at: string;
}

export type MetricKey = string;

export interface Employee {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  color: string | null;
}

export interface Department {
  id: number;
  name: string;
  color: string | null;
  employees: Employee[];
}
