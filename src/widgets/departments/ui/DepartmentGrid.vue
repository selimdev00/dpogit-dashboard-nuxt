<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-foreground">Отделы</h2>
      <div v-if="isLoading" class="text-sm text-muted-foreground">
        Загрузка...
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="hasError && !isLoading"
      class="rounded-lg border border-destructive/20 bg-destructive/10 p-4"
    >
      <h3 class="font-medium text-destructive mb-2">
        Ошибка загрузки отделов
      </h3>
      <p class="text-sm text-destructive/80">
        Не удалось загрузить данные отделов
      </p>
    </div>

    <!-- Department Cards Grid -->
    <div
      v-else-if="departments && departments.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <DepartmentCard
        v-for="department in departments"
        :key="department.id"
        :id="department.id"
        :name="department.name"
        :color="department.color"
        :employees="department.employees"
        :metrics="getDepartmentMetrics(department.id)"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading"
      class="flex items-center justify-center py-12"
    >
      <div class="text-center">
        <h3 class="mb-2 text-lg font-medium text-foreground">
          Нет отделов
        </h3>
        <p class="text-muted-foreground">
          Отделы не найдены
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DepartmentCard } from "@/shared/ui/department-card";
import { useDepartmentsQuery } from "@/shared/api";
import type { Department } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth";

interface DepartmentMetrics {
  leads: number;
  leadsTotal: number;
  sales: number;
  salesTotal: number;
  contracts: number;
  contractsTotal: number;
  margin: number;
  marginTotal: number;
}

interface DepartmentGridProps {
  departmentMetrics?: Record<number, DepartmentMetrics>;
}

const props = defineProps<DepartmentGridProps>();

const authStore = useAuthStore();
const { data: allDepartments, isLoading, error } = useDepartmentsQuery();

// Filter departments based on user's departmentIds access
const departments = computed(() => {
  if (!allDepartments.value) return null;

  return allDepartments.value.filter(department =>
    authStore.canAccessDepartment(department.id)
  );
});

const hasError = computed(() => !!error.value);

const getDepartmentMetrics = (departmentId: number): DepartmentMetrics => {
  return props.departmentMetrics?.[departmentId] || {
    leads: 12,
    leadsTotal: 50,
    sales: 8,
    salesTotal: 25,
    contracts: 1500000,
    contractsTotal: 3000000,
    margin: 450000,
    marginTotal: 900000,
  };
};
</script>