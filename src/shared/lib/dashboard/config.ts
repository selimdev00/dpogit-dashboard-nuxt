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
    id: "invoices_count",
    title: "Количество выставленных счетов",
    apiKey: "invoices",
    formatType: "count",
    dataProperty: "invoices",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: "plan",
  },
  {
    id: "invoices_total",
    title: "Сумма выставленных счетов",
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
    id: "invoices_paid_count",
    title: "Количество оплаченных счетов",
    apiKey: "invoices",
    apiParams: {
      is_paid: 1,
    },
    formatType: "count",
    dataProperty: "invoices",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: "plan",
  },
  {
    id: "invoices_paid_total",
    title: "Сумма оплаченных счетов",
    apiKey: "invoices",
    apiParams: {
      by: "currency",
      is_paid: 1,
    },
    formatType: "currency",
    dataProperty: "invoices",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: "plan",
  },
  {
    id: "incoming_calls",
    title: "Входящие звонки",
    apiKey: "calls",
    apiParams: {
      direction: "in",
    },
    formatType: "count",
    dataProperty: "calls",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: "plan",
  },
    {
        id: "outcoming_calls",
        title: "Исходящие звонки",
        apiKey: "calls",
        apiParams: {
            direction: "out",
        },
        formatType: "count",
        dataProperty: "calls",
        valueProperty: "count",
        progressProperty: "assumptionPercent",
        planProperty: "plan",
    },
];
