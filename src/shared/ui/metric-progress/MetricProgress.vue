<template>
  <div class="space-y-2">
    <!-- Header with label and current/total values -->
    <div class="flex justify-between items-center">
      <div class="text-muted-foreground">{{ label }}</div>
      <div class="font-medium">
        <template v-if="loading">
          <div class="animate-pulse bg-muted rounded w-12 h-4"></div>
        </template>
        <template v-else>
          {{ formatValueLocal(current) }}
        </template>
      </div>
    </div>

    <!-- Progress Bar (only if hasProgress) -->
    <div class="w-full bg-[#383941] rounded-full h-[2px]">
      <template v-if="loading">
        <div class="bg-muted h-full rounded-full animate-pulse w-full"></div>
      </template>
      <template v-else>
        <div
          :class="`${progressColor} h-full rounded-full transition-all duration-300`"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </template>
    </div>

    <!-- Remaining Caption (only if hasProgress) -->
    <div v-if="hasProgress" class="text-xs text-muted-foreground">
      <template v-if="loading">
        <div class="animate-pulse bg-muted rounded w-16 h-3"></div>
      </template>
      <template v-else>
        {{ formatValueLocal(current) }} / {{ formatValueLocal(total) }}
      </template>
    </div>
    <div v-else class="h-3"></div>
  </div>
</template>

<script setup lang="ts">
import { formatValue, type FormatType } from "@/shared/lib/formatters";

interface MetricProgressProps {
  label: string;
  current: number;
  total?: number;
  type?: FormatType;
  loading?: boolean;
}

const props = withDefaults(defineProps<MetricProgressProps>(), {
  type: "number",
  loading: false,
});

const progressPercentage = computed((): number => {
  if (!props.total || props.total === 0) return 0;
  return Math.min(100, Math.max(0, (props.current / props.total) * 100));
});

const hasProgress = computed((): boolean => {
  return props.total !== undefined;
});

const progressColor = computed((): string => {
  const percentage = progressPercentage.value;

  if (percentage < 33) {
    return "bg-danger"; // danger - low progress
  } else if (percentage < 67) {
    return "bg-warning"; // warning - medium progress
  } else {
    return "bg-success"; // success - high progress
  }
});

const remaining = computed((): number => {
  if (!props.total) return 0;
  return Math.max(0, props.total - props.current);
});

const formatValueLocal = (value: number): string => {
  return formatValue(value, props.type);
};
</script>
