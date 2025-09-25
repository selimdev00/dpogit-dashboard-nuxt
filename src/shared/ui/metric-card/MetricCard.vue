<template>
  <div class="rounded-lg bg-card text-card-foreground shadow-sm p-6">
    <div class="flex flex-col space-y-1.5 pb-2">
      <h3 class="text-sm font-medium text-muted-foreground">{{ title }}</h3>
    </div>

    <div class="flex items-baseline justify-between">
      <div class="flex flex-col">
        <span class="text-2xl font-bold">{{ formattedValue }}</span>
        <span v-if="subtitle" class="text-xs text-muted-foreground mt-1">{{ subtitle }}</span>
      </div>

    </div>

    <div v-if="description" class="text-xs text-muted-foreground mt-2">
      {{ description }}
    </div>

    <div v-if="progressValue !== undefined" class="mt-3">
      <div class="w-full bg-[#383941] rounded-full h-[2px]">
        <div
          :class="[progressColor, 'h-[2px] rounded-full transition-all duration-300']"
          :style="{ width: `${Math.min(progressValue, 100)}%` }"
        ></div>
      </div>
      <div class="text-xs text-muted-foreground mt-1 text-right">{{ progressValue }}%</div>
    </div>

    <div v-if="showChange" class="flex items-center space-x-1">
      <svg
          v-if="changeType === 'increase'"
          class="h-4 w-4 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
      </svg>
      <svg
          v-else-if="changeType === 'decrease'"
          class="h-4 w-4 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
      </svg>
      <span
          :class="{
            'text-success': changeType === 'increase',
            'text-danger': changeType === 'decrease',
            'text-muted-foreground': changeType === 'neutral'
          }"
          class="text-sm font-medium"
      >
          {{ changeText }}
        </span>
    </div>

  </div>
</template>

<script setup lang="ts">
interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  changeText?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  description?: string
  progressValue?: number
  formatType?: 'currency' | 'number' | 'percentage' | 'text'
}

const props = withDefaults(defineProps<MetricCardProps>(), {
  formatType: 'text',
  changeType: 'neutral'
})

const showChange = computed(() => props.changeText !== undefined)

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value

  switch (props.formatType) {
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
      }).format(props.value).replace('RUB', '₽')
    case 'number':
      return new Intl.NumberFormat('ru-RU').format(props.value)
    case 'percentage':
      return `${props.value}%`
    default:
      return props.value.toString()
  }
})

const progressColor = computed(() => {
  if (props.progressValue === undefined) return 'bg-primary'

  if (props.progressValue < 40) {
    return 'bg-danger'
  } else if (props.progressValue < 70) {
    return 'bg-warning'
  } else {
    return 'bg-success'
  }
})
</script>