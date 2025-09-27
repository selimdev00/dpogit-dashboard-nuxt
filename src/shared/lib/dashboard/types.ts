import { type FormatType } from "@/shared/lib/formatters";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  plan?: string | number;
  changeText?: string;
  changePercent?: number;
  changeType?: "increase" | "decrease" | "neutral";
  description?: string;
  progressValue?: number;
  formatType?: FormatType;
  additionalText?: string; // For displaying calculated values like average check
}

export interface DashboardData {
  metrics: DashboardMetric[];
}
