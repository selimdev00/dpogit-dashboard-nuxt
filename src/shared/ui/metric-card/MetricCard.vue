<template>
  <div class="rounded-lg bg-card text-card-foreground shadow-sm p-6 border">
    <div class="flex flex-col space-y-1.5 pb-2">
      <h3 class="text-sm font-medium text-muted-foreground">{{ title }}</h3>
    </div>

    <div class="flex items-baseline justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">{{ formattedValue }}</span>

        <div class="flex items-center gap-2 mt-1">
          <span v-if="plan" class="text-xs text-muted-foreground"
            >/ {{ formattedPlan }}</span
          >
        </div>
      </div>
    </div>

    <div v-if="description" class="text-xs text-muted-foreground mt-2">
      {{ description }}
    </div>

    <div v-if="progressValue !== undefined" class="mt-3">
      <div class="w-full bg-[#383941] rounded-full h-[2px]">
        <div
          :class="[
            progressColor,
            'h-[2px] rounded-full transition-all duration-300',
          ]"
          :style="{ width: `${Math.min(progressValue, 100)}%` }"
        ></div>
      </div>
      <div class="text-xs text-muted-foreground mt-1 text-right">
        {{ progressValue }}%
      </div>
    </div>

    <div v-if="showChange" class="flex items-center space-x-1">
      <svg
        v-if="changeType === 'increase'"
        class="h-4 w-4 text-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 17l9.2-9.2M17 17V7H7"
        />
      </svg>
      <svg
        v-else-if="changeType === 'decrease'"
        class="h-4 w-4 text-danger"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 7l-9.2 9.2M7 7v10h10"
        />
      </svg>

      <span class="text-sm font-medium text-muted-foreground">
        <span
          v-if="changePercent !== undefined"
          :class="[
            'text-xs font-medium',
            {
              'text-success': changeType === 'increase',
              'text-danger': changeType === 'decrease',
              'text-muted-foreground': changeType === 'neutral',
            },
          ]"
        >
          {{ changePercent >= 0 ? "+" : "" }}{{ changePercent.toFixed(1) }}%
        </span>

        {{ changeText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatValue, type FormatType } from "@/shared/lib/formatters";

interface MetricCardProps {
  title: string;
  value: string | number;
  plan?: string | number;
  changeText?: string;
  changePercent?: number;
  changeType?: "increase" | "decrease" | "neutral";
  description?: string;
  progressValue?: number;
  formatType?: FormatType;
}

const props = withDefaults(defineProps<MetricCardProps>(), {
  formatType: "text",
  changeType: "neutral",
});

const showChange = computed(() => props.changeText !== undefined);

const formattedValue = computed(() => {
  return formatValue(props.value, props.formatType);
});

const formattedPlan = computed(() => {
  if (!props.plan) return "";
  return formatValue(props.plan, props.formatType);
});

const progressColor = computed(() => {
  if (props.progressValue === undefined) return "bg-primary";

  if (props.progressValue < 40) {
    return "bg-danger";
  } else if (props.progressValue < 70) {
    return "bg-warning";
  } else {
    return "bg-success";
  }
});
</script>
