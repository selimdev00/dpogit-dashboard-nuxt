<template>
  <div class="rounded-lg border bg-card p-6 shadow-sm transition-all hover:bg-muted/10 hover:shadow-md">
    <!-- Employee Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative h-10 w-10 flex-shrink-0">
          <img
            v-if="photo"
            :src="photo"
            :alt="name"
            class="h-full w-full rounded-full object-cover"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
          >
            {{ getInitials(name) }}
          </div>
        </div>
        <div>
          <h3 class="font-medium text-foreground">{{ name }}</h3>
          <p v-if="position" class="text-xs text-muted-foreground">
            {{ position }}
          </p>
        </div>
      </div>
      <div class="text-sm text-muted-foreground">
        ID: {{ id }}
      </div>
    </div>

    <!-- Employee Color Indicator (if provided) -->
    <div v-if="color" class="mb-4 flex items-center gap-2">
      <div
        class="h-3 w-3 rounded-full"
        :style="{ backgroundColor: color }"
      ></div>
      <span class="text-xs text-muted-foreground">Персональный цвет</span>
    </div>

    <!-- Employee Stats -->
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
  </div>
</template>

<script setup lang="ts">
import type { Employee } from "@/shared/api/types";
import { MetricProgress } from "@/shared/ui/metric-progress";

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

interface EmployeeCardProps {
  id: number;
  name: string;
  position?: string;
  photo?: string | null;
  color?: string | null;
  metrics?: EmployeeMetrics;
}

const props = defineProps<EmployeeCardProps>();

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0][0].toUpperCase();
};
</script>