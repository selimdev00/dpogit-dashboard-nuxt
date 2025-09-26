<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-foreground">Сотрудники</h2>
      <div v-if="isLoading" class="text-sm text-muted-foreground">
        Загрузка...
      </div>
    </div>

    <!-- Employee Cards Grid -->
    <div
      v-if="employees && employees.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <EmployeeCard
        v-for="employee in employees"
        :key="employee.id"
        :id="employee.id"
        :name="employee.name"
        :position="employee.position"
        :photo="employee.photo"
        :color="employee.color"
        :metrics="getEmployeeMetrics(employee.id)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading"
      class="flex items-center justify-center py-12"
    >
      <div class="text-center">
        <h3 class="mb-2 text-lg font-medium text-foreground">
          Нет сотрудников
        </h3>
        <p class="text-muted-foreground">
          Сотрудники не найдены в этом отделе
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from "@/shared/api/types";
import { EmployeeCard } from "@/shared/ui/employee-card";

interface EmployeeMetrics {
  leads: number;
  leadsTotal: number;
  sales: number;
  salesTotal: number;
  contracts: number;
  contractsTotal: number;
  margin: number;
  marginTotal: number;
}

interface EmployersGridProps {
  employees?: Employee[];
  employeeMetrics?: Record<number, EmployeeMetrics>;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<EmployersGridProps>(), {
  employees: () => [],
  employeeMetrics: () => ({}),
  isLoading: false,
});

const getEmployeeMetrics = (employeeId: number): EmployeeMetrics => {
  return props.employeeMetrics[employeeId] || {
    leads: 0,
    leadsTotal: 0,
    sales: 0,
    salesTotal: 0,
    contracts: 0,
    contractsTotal: 0,
    margin: 0,
    marginTotal: 0,
  };
};
</script>