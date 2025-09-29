<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto py-8">
      <!-- Department Header -->
      <div class="mb-6 flex items-center gap-4">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Назад к главной
        </NuxtLink>
        <div v-if="departmentName" class="flex items-center gap-3">
          <div
            v-if="departmentColor"
            class="h-4 w-4 rounded-full"
            :style="{ backgroundColor: departmentColor }"
          ></div>
          <h1 class="text-2xl font-bold text-foreground">
            {{ departmentName }}
          </h1>
        </div>
      </div>

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

        <!-- Employers Grid - show employees of current department -->
        <EmployersGrid
          :employees="currentDepartment?.employees"
          :employee-metrics="employeeMetricsMap"
          :is-loading="!departments"
        />

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
import { EmployersGrid } from "@/widgets/employers";
import { MetricsCircleGrid } from "@/widgets/metrics-circle";
import { useDashboardData } from "@/widgets/dashboard/model/useDashboardData";
import { useDepartmentsQuery } from "@/shared/api";

definePageMeta({
  layout: "default",
  middleware: "can-access-department",
});

const route = useRoute();
const departmentId = computed(() => parseInt(route.params.id as string));

// Get department info for header
const { data: departments } = useDepartmentsQuery();
const currentDepartment = computed(() =>
  departments.value?.find((dept) => dept.id === departmentId.value),
);

const departmentName = computed(() => currentDepartment.value?.name);
const departmentColor = computed(() => currentDepartment.value?.color);

// Get dashboard data with department filter
const { dashboardMetrics, isLoading, hasError, errors } =
  useDashboardData(departmentId);

// Circle metrics for department-specific data
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
        id: "department_invoices_count",
        label: `Счета отдела: ${departmentName.value || "Загрузка..."}`,
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
        id: "department_invoices_total",
        label: "Сумма счетов отдела, руб",
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
        id: "department_calls",
        label: "Звонки отдела",
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

// Mock employee metrics for now - in real app this would come from API with departmentId filter
const employeeMetricsMap = computed(() => {
  const mockMetrics: Record<number, any> = {};

  // Generate mock data for each employee in the current department
  currentDepartment.value?.employees.forEach((employee) => {
    const leads = Math.floor(Math.random() * 20) + 5;
    const sales = Math.floor(Math.random() * 10) + 2;
    const contracts = Math.floor(Math.random() * 1000000) + 500000;
    const margin = Math.floor(Math.random() * 300000) + 100000;

    mockMetrics[employee.id] = {
      leads,
      leadsTotal: leads + Math.floor(Math.random() * 15) + 10, // Total higher than current
      sales,
      salesTotal: sales + Math.floor(Math.random() * 8) + 5, // Total higher than current
      contracts,
      contractsTotal: contracts + Math.floor(Math.random() * 800000) + 400000, // Total higher than current
      margin,
      marginTotal: margin + Math.floor(Math.random() * 200000) + 100000, // Total higher than current
    };
  });

  return mockMetrics;
});
</script>
