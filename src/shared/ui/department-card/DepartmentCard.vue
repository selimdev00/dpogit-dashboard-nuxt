<template>
  <NuxtLink
    :to="`/department/${id}`"
    class="block rounded-lg border bg-card p-6 shadow-sm transition-all hover:bg-muted/10 hover:shadow-md cursor-pointer"
  >
    <!-- Department Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          v-if="color"
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: color }"
        ></div>
        <h3 class="font-medium text-foreground">{{ name }}</h3>
      </div>
      <div class="text-sm text-muted-foreground">
        {{ employees?.length || 0 }} сотр.
      </div>
    </div>

    <!-- Employee Avatars -->
    <div class="mb-4 flex -space-x-2 overflow-hidden">
      <template v-for="(employee, index) in displayedEmployees" :key="employee.id">
        <div
          v-if="employee.photo"
          class="relative h-8 w-8 rounded-full border-2 border-background"
        >
          <img
            :src="employee.photo"
            :alt="employee.name"
            class="h-full w-full rounded-full object-cover"
          />
        </div>
        <div
          v-else
          class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground"
        >
          {{ getInitials(employee.name) }}
        </div>
      </template>

      <!-- Show remaining count if there are more employees -->
      <div
        v-if="remainingCount > 0"
        class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground"
      >
        +{{ remainingCount }}
      </div>
    </div>

    <!-- Department Stats -->
    <div class="space-y-4 text-sm grid grid-cols-2 gap-4">
      <!-- Leads Progress -->
      <MetricProgress
        label="Лиды"
        :current="metrics?.leads || 0"
        :total="metrics?.leadsTotal || 0"
        type="number"
      />

      <!-- Sales Progress -->
      <MetricProgress
        label="Продажи"
        :current="metrics?.sales || 0"
        :total="metrics?.salesTotal || 0"
        type="number"
      />

      <!-- Contracts Progress -->
      <MetricProgress
        label="Договоры"
        :current="metrics?.contracts || 0"
        :total="metrics?.contractsTotal || 0"
        type="currency"
      />

      <!-- Margin Progress -->
      <MetricProgress
        label="Маржа"
        :current="metrics?.margin || 0"
        :total="metrics?.marginTotal || 0"
        type="currency"
      />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Department } from "@/shared/api/types";
import { MetricProgress } from "@/shared/ui/metric-progress";

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

interface DepartmentCardProps {
  id: number;
  name: string;
  color?: string | null;
  employees?: Department['employees'];
  metrics?: DepartmentMetrics;
}

const props = defineProps<DepartmentCardProps>();

const maxDisplayedEmployees = 5;

const displayedEmployees = computed(() =>
  props.employees?.slice(0, maxDisplayedEmployees) || []
);

const remainingCount = computed(() =>
  Math.max(0, (props.employees?.length || 0) - maxDisplayedEmployees)
);

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

</script>