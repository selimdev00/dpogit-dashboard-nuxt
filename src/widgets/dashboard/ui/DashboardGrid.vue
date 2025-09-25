<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
  >
    <MetricCard
      v-for="metric in metrics"
      :key="metric.id"
      :title="metric.title"
      :value="metric.value"
      :plan="metric.plan"
      :change-text="metric.changeText"
      :change-percent="metric.changePercent"
      :change-type="metric.changeType"
      :description="metric.description"
      :progress-value="metric.progressValue"
      :format-type="metric.formatType"
    />
  </div>
</template>

<script setup lang="ts">
import { MetricCard } from "@/shared/ui/metric-card";
import type { DashboardMetric } from "@/shared/lib/dashboard/types";

interface DashboardGridProps {
  metrics: DashboardMetric[];
}

defineProps<DashboardGridProps>();
</script>
