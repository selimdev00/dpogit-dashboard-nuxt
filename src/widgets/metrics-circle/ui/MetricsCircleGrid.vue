<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-foreground">Метрики</h2>
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
        Ошибка загрузки метрик
      </h3>
      <p class="text-sm text-destructive/80">
        Не удалось загрузить данные круговых метрик
      </p>
    </div>

    <!-- Circle Metrics Grid -->
    <div
      v-else-if="circleMetrics && circleMetrics.length > 0"
      class="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      <CircleMetric
        v-for="metric in circleMetrics"
        :key="metric.id"
        :label="metric.label"
        :total-value="metric.totalValue"
        :value-groups="metric.valueGroups"
        :format-type="metric.formatType"
        :subtitle="metric.subtitle"
        :show-details="metric.showDetails"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!isLoading"
      class="flex items-center justify-center py-12"
    >
      <div class="text-center">
        <h3 class="mb-2 text-lg font-medium text-foreground">
          Нет данных
        </h3>
        <p class="text-muted-foreground">
          Метрики не найдены
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleMetric } from "@/shared/ui/circle-metric";

interface ValueGroup {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface CircleMetricData {
  id: string;
  label: string;
  totalValue: number;
  valueGroups: ValueGroup[];
  formatType: 'number' | 'currency' | 'percentage';
  subtitle?: string;
  showDetails?: boolean;
}

interface MetricsCircleGridProps {
  circleMetrics?: CircleMetricData[];
  isLoading?: boolean;
  hasError?: boolean;
}

const props = withDefaults(defineProps<MetricsCircleGridProps>(), {
  circleMetrics: () => [],
  isLoading: false,
  hasError: false,
});
</script>