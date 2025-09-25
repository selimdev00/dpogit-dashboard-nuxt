import type { ApiQueryParams } from "@/shared/api";

export interface DashboardMetricConfig {
  id: string;
  title: string;
  apiKey: string;
  apiParams?: ApiQueryParams;
  formatType?: "currency" | "number" | "percentage" | "text" | "count";
  description?: string;
  dataProperty: string; // Property name in the API response (e.g., 'invoices')
  valueProperty?:
    | "count"
    | "plan"
    | "progress"
    | "remain"
    | "assumption"
    | "assumptionPercent"
    | "need"
    | "prevCount";
  progressProperty?: "assumptionPercent" | "progress";
  planProperty?: "plan" | "assumption";
}

// Configuration for all dashboard metrics
export const dashboardMetricsConfig: DashboardMetricConfig[] = [
  {
    id: "invoices",
    title: "Сумма выставленных счетов ",
    apiKey: "invoices",
    apiParams: {
      by: "currency",
    },
    formatType: "currency",
    dataProperty: "invoices",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: "plan",
  },
  {
    id: "calls",
    title: "Звонки исх/вх",
    apiKey: "calls",
    apiParams: {
      by: "currency",
    },
    formatType: "count",
    dataProperty: "calls",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: "plan",
  },
];
