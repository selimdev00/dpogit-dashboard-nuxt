<template>
  <div class="flex flex-col items-center space-y-3 bg-card p-6 rounded-lg shadow-sm border">
    <!-- ECharts Circle Chart -->
    <div ref="chartContainer" class="w-full h-48"></div>

    <!-- Label -->
    <div class="text-center">
      <div class="text-sm text-muted-foreground">{{ label }}</div>
      <div v-if="showDetails" class="flex items-center gap-2 mt-1">
        <span class="text-xs text-muted-foreground">Подробнее</span>
        <svg class="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

interface ValueGroup {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface CircleMetricProps {
  label: string;
  totalValue: number;
  valueGroups: ValueGroup[];
  formatType?: 'number' | 'currency' | 'percentage';
  subtitle?: string;
  showDetails?: boolean;
}

const props = withDefaults(defineProps<CircleMetricProps>(), {
  formatType: 'number',
  showDetails: false,
});

const chartContainer = ref<HTMLDivElement>();
let chartInstance: ECharts | null = null;

const formattedTotalValue = computed(() => {
  switch (props.formatType) {
    case 'currency':
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(props.totalValue);
    case 'percentage':
      return `${props.totalValue}%`;
    default:
      return props.totalValue.toLocaleString('ru-RU');
  }
});

// Calculate remaining percentage if total doesn't add up to 100%
const remainingPercentage = computed(() => {
  const totalPercentage = props.valueGroups.reduce((sum, group) => sum + group.percentage, 0);
  return Math.max(0, 100 - totalPercentage);
});

const initChart = () => {
  if (!chartContainer.value) return;

  chartInstance = echarts.init(chartContainer.value);

  // Prepare data for ECharts
  const chartData = [
    ...props.valueGroups.map(group => ({
      name: group.name,
      value: group.percentage,
      itemStyle: {
        color: group.color,
      },
    })),
  ];

  // Add remaining percentage as background if needed
  if (remainingPercentage.value > 0) {
    chartData.push({
      name: 'Remaining',
      value: remainingPercentage.value,
      itemStyle: {
        color: '#383941',
      },
    });
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.name === 'Remaining') return '';
        return `${params.name}: ${params.percent}%`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        startAngle: 90,
        clockwise: true,
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => formattedTotalValue.value,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ffffff',
        },
        labelLine: {
          show: false,
        },
        data: chartData,
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

const updateChart = () => {
  if (!chartInstance) return;

  // Prepare updated data
  const chartData = [
    ...props.valueGroups.map(group => ({
      name: group.name,
      value: group.percentage,
      itemStyle: {
        color: group.color,
      },
    })),
  ];

  // Add remaining percentage as background if needed
  if (remainingPercentage.value > 0) {
    chartData.push({
      name: 'Remaining',
      value: remainingPercentage.value,
      itemStyle: {
        color: '#383941',
      },
    });
  }

  chartInstance.setOption({
    series: [
      {
        data: chartData,
        label: {
          formatter: () => formattedTotalValue.value,
        },
      },
    ],
  });
};

onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});

// Watch for prop changes and update chart
watch([() => props.totalValue, () => props.valueGroups], () => {
  updateChart();
}, { deep: true });

watch(formattedTotalValue, () => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [
        {
          label: {
            formatter: () => formattedTotalValue.value,
          },
        },
      ],
    });
  }
});
</script>