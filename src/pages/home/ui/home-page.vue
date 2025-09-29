<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <!-- Error State -->
      <div
        v-if="hasError && !isLoading"
        class="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
      >
        <h3 class="text-destructive font-medium mb-2">
          Ошибка загрузки данных
        </h3>
        <ul class="text-sm text-destructive/80">
          <li v-for="error in errors" :key="error.message">
            {{ error.message }}
          </li>
        </ul>
      </div>

      <div class="space-y-12">
        <!-- Dashboard Content -->
        <DashboardGrid :metrics="dashboardMetrics" />

        <!-- Department Grid -->
        <DepartmentGrid />

        <!-- Circle Metrics -->
        <!--        <MetricsCircleGrid-->
        <!--          :circle-metrics="circleMetrics"-->
        <!--          :is-loading="isLoading"-->
        <!--          :has-error="hasError"-->
        <!--        />-->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DashboardGrid } from "@/widgets/dashboard";
import { DepartmentGrid } from "@/widgets/departments";
import { MetricsCircleGrid } from "@/widgets/metrics-circle";
import { useDashboardData } from "@/widgets/dashboard/model/useDashboardData";
import { useDashboardStore } from "@/shared/stores/dashboard";

const dashboardStore = useDashboardStore();

const { dashboardMetrics, isLoading, hasError, errors, refetchAll } =
  useDashboardData();

// Create circle metrics from dashboard data
const circleMetrics = computed(() => {
  // Consistent color palette
  const colors = [
    "rgba(0, 119, 247, 1)", // Blue
    "rgba(151, 71, 255, 1)", // Purple
    "rgba(24, 160, 251, 1)", // Light Blue
  ];

  if (!dashboardMetrics.value) {
    return [];
  }

  // Find metrics by ID from dashboard data
  const getMetric = (id: string) =>
    dashboardMetrics.value?.find((m) => m.id === id);

  // Invoice metrics
  const invoiceCount = getMetric("invoices_count");
  const invoiceTotal = getMetric("invoices_total");
  const invoicePaidCount = getMetric("invoices_paid_count");
  const invoicePaidTotal = getMetric("invoices_paid_total");

  // Call metrics
  const incomingCalls = getMetric("incoming_calls");
  const outcomingCalls = getMetric("outcoming_calls");

  const metrics = [];

  // Invoices Count Circle (count + paid_count)
  if (invoiceCount && invoicePaidCount) {
    const totalCount =
      (invoiceCount.value || 0) + (invoicePaidCount.value || 0);
    const paidValue = invoicePaidCount.value || 0;
    const unpaidValue = invoiceCount.value || 0;

    if (totalCount > 0) {
      metrics.push({
        id: "invoices_count",
        label: "Счета, шт",
        totalValue: totalCount,
        formatType: "number" as const,
        showDetails: false,
        valueGroups: [
          {
            name: "Неоплаченные",
            value: unpaidValue,
            percentage: Math.round((unpaidValue / totalCount) * 100),
            color: colors[0],
          },
          {
            name: "Оплаченные",
            value: paidValue,
            percentage: Math.round((paidValue / totalCount) * 100),
            color: colors[1],
          },
        ],
      });
    }
  }

  // Invoices Total Circle (total + paid_total)
  if (invoiceTotal && invoicePaidTotal) {
    const totalAmount =
      (invoiceTotal.value || 0) + (invoicePaidTotal.value || 0);
    const paidAmount = invoicePaidTotal.value || 0;
    const unpaidAmount = invoiceTotal.value || 0;

    if (totalAmount > 0) {
      metrics.push({
        id: "invoices_total",
        label: "Сумма счетов, руб",
        totalValue: totalAmount,
        formatType: "currency" as const,
        showDetails: false,
        valueGroups: [
          {
            name: "Неоплаченные",
            value: unpaidAmount,
            percentage: Math.round((unpaidAmount / totalAmount) * 100),
            color: colors[0],
          },
          {
            name: "Оплаченные",
            value: paidAmount,
            percentage: Math.round((paidAmount / totalAmount) * 100),
            color: colors[1],
          },
        ],
      });
    }
  }

  // Calls Circle (incoming + outgoing)
  if (incomingCalls && outcomingCalls) {
    const totalCalls = (incomingCalls.value || 0) + (outcomingCalls.value || 0);
    const incomingValue = incomingCalls.value || 0;
    const outcomingValue = outcomingCalls.value || 0;

    if (totalCalls > 0) {
      metrics.push({
        id: "calls",
        label: "Звонки, шт",
        totalValue: totalCalls,
        formatType: "number" as const,
        showDetails: false,
        valueGroups: [
          {
            name: "Входящие",
            value: incomingValue,
            percentage: Math.round((incomingValue / totalCalls) * 100),
            color: colors[0],
          },
          {
            name: "Исходящие",
            value: outcomingValue,
            percentage: Math.round((outcomingValue / totalCalls) * 100),
            color: colors[1],
          },
        ],
      });
    }
  }

  return metrics;
});
</script>
