<template>
  <div class="space-y-2">
    <!-- Header with label and current/total values -->
    <div class="flex justify-between items-center">
      <div class="text-muted-foreground">{{ label }}</div>
      <div class="font-medium">
        {{ formatValue(current) }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full  bg-[#383941] rounded-full h-[2px]">
      <div
        :class="`${progressColor} h-full rounded-full transition-all duration-300`"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>

    <!-- Remaining Caption -->
    <div class="text-xs text-muted-foreground ">
      {{ formatValue(current) }} / {{ formatValue(total) }}

    </div>
  </div>
</template>

<script setup lang="ts">
interface MetricProgressProps {
  label: string;
  current: number;
  total: number;
  type?: 'number' | 'currency';
}

const props = withDefaults(defineProps<MetricProgressProps>(), {
  type: 'number',
});

const progressPercentage = computed((): number => {
  if (props.total === 0) return 0;
  return Math.min(100, Math.max(0, (props.current / props.total) * 100));
});

const progressColor = computed((): string => {
  const percentage = progressPercentage.value;

  if (percentage < 33) {
    return 'bg-danger'; // danger - low progress
  } else if (percentage < 67) {
    return 'bg-warning'; // warning - medium progress
  } else {
    return 'bg-success'; // success - high progress
  }
});

const remaining = computed((): number => {
  return Math.max(0, props.total - props.current);
});

const formatValue = (value: number): string => {
  if (props.type === 'currency') {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return value.toString();
};
</script>